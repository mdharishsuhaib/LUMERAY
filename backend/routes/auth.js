const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "lumeray_secret";

// ── SIGNUP ──
router.post("/signup", async (req, res) => {
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
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "User already exists" });
          }
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Signup successful" });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── LOGIN ──
// Now returns a real JWT containing the user's DB id,
// so auth middleware can identify which user is making requests.
router.post("/login", (req, res) => {
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

      // ✅ Sign a real JWT with the user's id inside
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        token,
        user: { name: user.name, email: user.email },
      });
    }
  );
});

module.exports = router;
