import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style = "Professional", format = "Markdown Report" } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt parameter." });
    }

    if (!process.env.GEMINI_API_KEY) {
      const markdownText = `
# Compiled Report: ${prompt}

*Style: ${style}*  
*Format: ${format}*

---

## Executive Overview
This document represents an automated conceptual summary regarding **${prompt}**. It is tailored to conform with **${style}** guidelines and outputted in a clean **${format}** layout.

### Key Takeaways
- **Efficiency first:** Establishing modular component paradigms enables seamless operations.
- **Robustness & Scalability:** Scaling depends strictly on architectural consistency.
- **Continuous Integration:** Live parameters are tracked continuously.

## Next Steps
1. Refine functional parameter indices.
2. Synchronize workspace settings with DigiWorku cloud server.
3. Initiate second development review milestone.
`;
      return res.json({ text: markdownText });
    }

    const ai = getAI();
    const userPrompt = `Write a document about: "${prompt}". 
Style: "${style}". 
Format: "${format}". 
Make it expansive, clean, and extremely polished. Use Markdown headlines, lists, and quotes nicely. Do not use conversational preambles.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userPrompt,
      config: {
        systemInstruction: "You are an elite creative writer, author, and professional summarizer. Produce stellar typography-friendly content directly without apologies or introductions.",
        temperature: 0.8,
      }
    });

    return res.json({ text: response.text || "" });
  } catch (err: any) {
    console.error("Error in /api/compose:", err);
    return res.status(500).json({ error: err.message || "An error occurred writing draft." });
  }
}
