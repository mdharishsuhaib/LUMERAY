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
          return res.status(500).json({ error: err.message });
        }

        console.log("USER INSERTED");
        res.json({ message: "Signup successful" });
      }
    );
  } catch (error) {
    console.error("HASH ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;