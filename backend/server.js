const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const db = require("./db");

/* ── Middleware ── */
app.use(cors());
app.use(express.json());

/* ── Auth Middleware ── */
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "lumeray_secret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* ── Auto-create tables on startup ── */
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )
`, (err) => { if (err) console.error("Users table error:", err); });

db.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    description VARCHAR(255),
    date DATE,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`, (err) => { if (err) console.error("Expenses table error:", err); });

/* ── Auth Routes ── */
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

/* ── Health check ── */
app.get("/", (req, res) => res.send("🚀 LUMERAY Backend Running"));

/* ── GET all expenses for logged-in user ── */
app.get("/api/expenses", auth, (req, res) => {
  db.query(
    "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

/* ── ADD expense ── */
app.post("/api/expenses/add", auth, (req, res) => {
  const { amount, category, description, date, currency } = req.body;
  if (!amount || !category || !description || !date) {
    return res.status(400).json({ error: "All fields required" });
  }
  db.query(
    "INSERT INTO expenses (user_id, amount, category, description, date, currency) VALUES (?, ?, ?, ?, ?, ?)",
    [req.userId, amount, category, description, date, currency || "USD"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Expense added", id: result.insertId });
    }
  );
});

/* ── DELETE expense ── */
app.delete("/api/expenses/:id", auth, (req, res) => {
  const { id } = req.params;
  // Only delete if it belongs to the logged-in user
  db.query(
    "DELETE FROM expenses WHERE id = ? AND user_id = ?",
    [id, req.userId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Expense not found or unauthorized" });
      }
      res.json({ message: "Expense deleted" });
    }
  );
});

/* ── UPDATE profile (name, email, password) ── */
app.put("/api/user/update", auth, async (req, res) => {
  const { name, email, password } = req.body;
  const bcrypt = require("bcryptjs");

  try {
    if (password && password.trim() !== "") {
      // Update name, email and password
      const hashed = await bcrypt.hash(password, 10);
      db.query(
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
        [name, email, hashed, req.userId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Profile updated", user: { name, email } });
        }
      );
    } else {
      // Update name and email only
      db.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, req.userId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Profile updated", user: { name, email } });
        }
      );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 LUMERAY backend running on port ${PORT}`));
