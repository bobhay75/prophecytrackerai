import express from "express";

const app = express();
const PORT = 3000;

// Simple health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "ProphecyTrackerAI server is running!" });
});

// Root
app.get("/", (req, res) => {
  res.send("Welcome to ProphecyTrackerAI 🚀");
});

app.listen(PORT, () => {
  console.log(`🟢 Server running at http://localhost:${PORT}`);
});

