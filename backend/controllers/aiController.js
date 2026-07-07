const { generateResponse } = require("../services/aiService");

const generateAI = async (req, res) => {
  try {
    const text = req.body.text;
    const result = await generateResponse(text);

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "AI request failed" });
  }
};

module.exports = { generateAI };