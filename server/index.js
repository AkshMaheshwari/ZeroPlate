import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- RATE LIMIT (protects Gemini limits) ----
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 4, // max 4 requests per minute per IP
  message: {
    error: "Too many requests. Please wait a minute and try again."
  }
});

// ---- GEMINI SETUP (single instance) ----
const geminiapikey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiapikey);

// IMPORTANT: reuse model (do NOT create inside route)
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

// ---- ROUTE ----
app.post("/analyze-waste", analyzeLimiter, async (req, res) => {
  const { feedbackData, wastageData } = req.body;

  const prompt = `
You are a food waste reduction AI analyzing cafeteria data.

FEEDBACK DATA: ${JSON.stringify(feedbackData || [])}
WASTAGE DATA: ${JSON.stringify(wastageData || [])}

Analyze the data and identify:
1. Dishes with high wastage - suggest portion changes or recipe improvements
2. Correlation between low ratings and high wastage
3. Sentiment trends - which dishes get negative feedback
4. Time patterns - which meals generate more waste
5. Actionable recommendations to reduce waste by at least 20%

Return ONLY a RAW JSON object (no markdown, no backticks) in this EXACT format:
{
  "insights": [
    {
      "id": 1,
      "suggestion": "Specific actionable recommendation",
      "impact": "Expected reduction in waste or improvement",
      "priority": "High"
    }
  ]
}

Create 4-6 insights.
`;

  try {
    // ---- SIMPLE RETRY (1 attempt) ----
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch {
      result = await model.generateContent(prompt);
    }

    const text = result.response.text().trim();
    const cleanJSON = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleanJSON));
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "AI failed or rate limit hit" });
  }
});

app.listen(3001, () =>
  console.log("🚀 Backend running at http://localhost:3001")
);
