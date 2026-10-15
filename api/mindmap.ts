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
    const { topic } = req.body || {};
    if (!topic) {
      return res.status(400).json({ error: "Missing topic parameter." });
    }

    if (!process.env.GEMINI_API_KEY) {
      const mockMindmap = {
        title: `Project ${topic} Node Graph`,
        nodes: [
          {
            id: "root",
            label: topic,
            description: `Central hub exploring ${topic}.`,
            connections: ["branch1", "branch2"]
          },
          {
            id: "branch1",
            label: "Foundations",
            description: "Essential prerequisites and structural patterns.",
            connections: []
          },
          {
            id: "branch2",
            label: "Advanced Modules",
            description: "Scale metrics and performance enhancements.",
            connections: ["sub-branch1"]
          },
          {
            id: "sub-branch1",
            label: "Execution Strategy",
            description: "Final optimization details.",
            connections: []
          }
        ]
      };
      return res.json(mockMindmap);
    }

    const ai = getAI();
    const prompt = `Deconstruct the topic "${topic}" into a logical node graph (5 to 8 nodes total) for visualization. Provide a central root node, and connecting branch nodes. Connect children to parents or sibling nodes.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert system mapping consultant. Structure information into a hierarchical node graph with clear text and connected nodes. Nodes must have brief descriptions (10 words max). Connections must refer to node IDs.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Clean conceptual title of the mind map." },
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique short alphanumeric identifier, e.g., 'root', 'branch1', 'branch2'." },
                  label: { type: Type.STRING, description: "Short title of this concept (1-3 words)." },
                  description: { type: Type.STRING, description: "Short summary explanation." },
                  connections: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "List of other node IDs that this node connects to (edges)."
                  }
                },
                required: ["id", "label", "description", "connections"]
              }
            }
          },
          required: ["title", "nodes"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini.");
    }

    const mindmap = JSON.parse(response.text.trim());
    return res.json(mindmap);
  } catch (err: any) {
    console.error("Error in /api/mindmap:", err);
    return res.status(500).json({ error: err.message || "An error occurred constructing your mindmap." });
  }
}
