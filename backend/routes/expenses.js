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
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD expense
router.post("/add", auth, async (req, res) => {
  const { amount, category, description, date, currency } = req.body;
  if (!amount || !category || !description || !date) {
    return res.status(400).json({ error: "All fields required" });
  }
  try {
    const result = await db.query(
      "INSERT INTO expenses (user_id, amount, category, description, date, currency) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [req.userId, amount, category, description, date, currency || "USD"]
    );
    res.json({ message: "Expense added", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2",
      [id, req.userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Expense not found or unauthorized" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;