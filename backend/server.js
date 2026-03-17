const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 LUMERAY Backend Running");
});

/* Test Route */
app.get("/api", (req, res) => {
  res.send("LUMERAY API Running");
});

app.get('/api/expenses', async (req, res) => {
  try {
    res.json([]); // temporary safe response
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

/* Start Server */
app.listen(PORT, () => {
  console.log(`🚀 LUMERAY backend running on port ${PORT}`);
});