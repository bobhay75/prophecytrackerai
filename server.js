const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root test endpoint
app.get("/", (req, res) => {
  res.send("✅ Prophecy Tracker AI Backend Running");
});

// Example prophecy endpoint
app.get("/api/prophecies", async (req, res) => {
  try {
    // Placeholder: fetch prophecy data (replace with your DB or API)
    const sampleProphecies = [
      { id: 1, prophecy: "Wars and rumors of wars", source: "Matthew 24:6" },
      { id: 2, prophecy: "Knowledge will increase", source: "Daniel 12:4" }
    ];
    res.json(sampleProphecies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching prophecies" });
  }
});

// Example AI endpoint
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // Placeholder AI call – hook to OpenAI or Trust AI
    const aiResponse = `You asked: "${question}". AI response would go here.`;

    res.json({ answer: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
