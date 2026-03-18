const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "lumeray_secret";

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET all expenses
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// ADD expense
router.post("/add", auth, (req, res) => {
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

// DELETE expense
router.delete("/:id", auth, (req, res) => {
  const { id } = req.params;
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

module.exports = router;
