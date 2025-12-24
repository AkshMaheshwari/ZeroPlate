import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()


const app = express();
app.use(cors());
app.use(express.json());

// Direct API Key Usage
const geminiapikey=process.env.GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(geminiapikey);

app.post("/analyze-waste", async (req, res) => {
  const { feedbackData } = req.body;

  const prompt = `
    Analyze this food waste feedback: ${JSON.stringify(feedbackData)}.
    Return a RAW JSON object (no markdown, no backticks) in this format:
    {
      "insights": [
        {"id": 1, "suggestion": "Text", "impact": "Text", "priority": "High"}
      ]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean JSON if Gemini adds markdown backticks
    const cleanJSON = text.replace(/```json|```/g, "").trim();
    
    res.json(JSON.parse(cleanJSON));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI failed" });
  }
});

app.listen(3001, () => console.log("🚀 Backend on http://localhost:3001"));