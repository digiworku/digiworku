import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

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
    const { topic, count = 6 } = req.body || {};
    if (!topic) {
      return res.status(400).json({ error: "Missing topic parameter." });
    }

    if (!process.env.GEMINI_API_KEY) {
      const mockCards = [
        {
          question: `What are the core concepts of "${topic}"?`,
          answer: `The core concepts of "${topic}" revolve around fundamental principles of structure, efficiency, and real-time execution parameters.`,
          category: "Fundamentals"
        },
        {
          question: `How do teams optimize "${topic}" workflows?`,
          answer: "Teams optimize these workflows by establishing clear pipelines, caching critical parameters, and implementing modular components.",
          category: "Optimization"
        },
        {
          question: `Why is "${topic}" essential for scaling models?`,
          answer: "It provides the robust architectural foundation necessary to support multi-tenant synchronization and high-demand operations.",
          category: "Strategic Value"
        }
      ];
      return res.json({ cards: mockCards.slice(0, count) });
    }

    const ai = getAI();
    const prompt = `Generate a set of ${count} high-quality educational flashcards about: "${topic}". Make sure the target audience gets intuitive and clear answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite educator. Create deep learning flashcards with questions, concise answers, and sub-topic categories.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of custom flashcards.",
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Clear, engaging educational prompt or question." },
              answer: { type: Type.STRING, description: "Detailed yet easy-to-understand response/answer." },
              category: { type: Type.STRING, description: "The specific sub-topic or theme of the card." }
            },
            required: ["question", "answer", "category"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini.");
    }

    const cards = JSON.parse(response.text.trim());
    return res.json({ cards });
  } catch (err: any) {
    console.error("Error in /api/flashcards:", err);
    return res.status(500).json({ error: err.message || "An error occurred building flashcards." });
  }
}
