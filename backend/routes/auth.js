const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

// ✅ SIGNUP ROUTE
router.post("/signup", async (req, res) => {
  console.log("Signup API HIT");

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
  "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
  [name, email, hashedPassword],
  (err, result) => {
    if (err) {
      console.error("INSERT ERROR:", err);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "User already exists" });
      }

      return res.status(500).json({ error: "Database error" });
    }

    console.log("USER INSERTED");
    res.json({ message: "Signup successful" });
  }
);

router.post("/login", (req, res) => {
  console.log("Login API HIT");

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });

      if (results.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid password" });
      }

      res.json({
        token: "dummy-token",
        user: { name: user.name, email: user.email },
      });
    }
  );
});

module.exports = router;