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
    const { history = [], message, systemInstruction = "You are a helpful creative assistant." } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Missing message parameter." });
    }

    if (!process.env.GEMINI_API_KEY) {
      let reply = `Hello! I am DigiWorku Admin. Our custom technical workflows and project parameters are running successfully.`;
      if (message.toLowerCase().includes('report') || message.toLowerCase().includes('pdf') || message.toLowerCase().includes('analytics')) {
        reply = "Understood! The optimization analytics report is ready in your Client Portal. Let me know if you would like me to compile additional comparative matrices.";
      } else if (message.toLowerCase().includes('brand') || message.toLowerCase().includes('logo') || message.toLowerCase().includes('design')) {
        reply = "We have mapped out 3 fresh aesthetic options for your custom branding. Let's schedule a call tomorrow with our Lead visual director to finalize.";
      } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('help') || message.toLowerCase().includes('who')) {
        reply = "As your DigiWorku Client Partner, I am here to help you coordinate design, dev, and analytics tasks.";
      }
      return res.json({ text: reply });
    }

    const ai = getAI();
    const contents = history.map((item: any) => ({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content || '' }]
    }));
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text || "No response text generated." });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return res.status(500).json({ error: err.message || "An error occurred with Gemini API." });
  }
}
