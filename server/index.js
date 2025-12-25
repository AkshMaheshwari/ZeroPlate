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

// ---- GEMINI SETUP ----
const geminiapikey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(geminiapikey);

// Reusing model instance for better performance
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash" // Using stable 2.5 flash or your preferred version
});

// ---- ROUTE ----
app.get("/",(req, res) =>{
  res.send("Welcome to ZeroPlate AI Backend");
})
app.post("/analyze-waste", analyzeLimiter, async (req, res) => {
  const { feedbackData, wastageData } = req.body;

  // UPDATED PROMPT: Now explicitly instructs AI to look at verbal feedback (transcripts)
  const prompt = `
You are a food waste reduction AI for a university cafeteria. 

DATA TO ANALYZE:
1. FEEDBACK & VOICE TRANSCRIPTS: ${JSON.stringify(feedbackData || [])}
2. PHYSICAL WASTAGE DATA: ${JSON.stringify(wastageData || [])}

INSTRUCTIONS:
- Analyze student comments and voice transcripts (found in fields like 'transcript', 'comment', or 'content').
- Look for specific verbal reasons for waste (e.g., "too salty", "rice was hard", "portion too big").
- Identify:
    1. Dishes with high wastage - suggest portion changes or recipe improvements.
    2. Correlation between low ratings/negative voice feedback and high wastage.
    3. Sentiment trends - which dishes get negative verbal feedback.
    4. Actionable recommendations to reduce waste by at least 20%.

Return ONLY a RAW JSON object (no markdown, no backticks) in this EXACT format:
{
  "insights": [
    {
      "id": 1,
      "suggestion": "Specific actionable recommendation based on data or student voice",
      "impact": "Expected reduction in waste or student satisfaction improvement",
      "priority": "High"
    }
  ]
}

Create 4-6 high-quality insights.
`;

  try {
    // SIMPLE RETRY logic
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (retryErr) {
      console.log("Retrying Gemini request...");
      result = await model.generateContent(prompt);
    }

    const text = result.response.text().trim();
    
    // Clean potential markdown formatting from AI response
    const cleanJSON = text.replace(/```json|```/g, "").trim();

    res.json(JSON.parse(cleanJSON));
  } catch (err) {
    console.error("Gemini Error:", err.message);
    res.status(500).json({ error: "AI analysis failed. Ensure your API key is valid and backend is receiving data." });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 ZeroPlate AI Backend running at http://localhost:${PORT}`)
);