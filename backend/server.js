const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const db = require("./db");

/* -- Middleware -- */
app.use(cors());
app.use(express.json());

/* -- Auth Middleware -- */
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

/* -- Routes -- */
const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");
app.use("/api", authRoutes);
app.use("/api/expenses", expenseRoutes);

/* -- Health check -- */
app.get("/", (req, res) => res.send("LUMERAY Backend Running"));

/* -- UPDATE profile -- */
app.put("/api/user/update", auth, async (req, res) => {
  const { name, email, password } = req.body;
  const bcrypt = require("bcryptjs");
  try {
    if (password && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      const result = await db.query(
        "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4",
        [name, email, hashed, req.userId]
      );
      res.json({ message: "Profile updated", user: { name, email } });
    } else {
      const result = await db.query(
        "UPDATE users SET name = $1, email = $2 WHERE id = $3",
        [name, email, req.userId]
      );
      res.json({ message: "Profile updated", user: { name, email } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`LUMERAY backend running on port ${PORT}`));