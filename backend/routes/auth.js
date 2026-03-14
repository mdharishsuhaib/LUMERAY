const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");


// REGISTER
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {

        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Registration failed" });
        }

        res.json({ message: "User registered successfully" });

      }
    );

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});


// LOGIN
router.post("/login", (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {

      if (err) {
        return res.status(500).json({ error: err });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // COMPARE PASSWORD
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token: token,
        user: {
          name: user.name,
          email: user.email
        }
      });

    }
  );

});

module.exports = router;