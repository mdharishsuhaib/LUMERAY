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

/* ── Routes ── */
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);

/* ── Health check ── */
app.get("/", (req, res) => res.send("🚀 LUMERAY Backend Running"));

/* ── UPDATE profile ── */
app.put("/api/user/update", auth, async (req, res) => {
  const { name, email, password } = req.body;
  const bcrypt = require("bcryptjs");
  try {
    if (password && password.trim() !== "") {
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
