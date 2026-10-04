import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from "@google/genai";
import rateLimit from 'express-rate-limit';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined securely in secrets. Please set it in Settings > Secrets.");
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

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// 1. Global limiter — sab routes pe: 200 requests/15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again after 15 minutes.' },
});

// 2. Admin login — strict: 5 attempts/15 min per IP (brute-force blocker)
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  skipSuccessfulRequests: true, // successful login attempts count nahi hote
});

// 3. AI endpoints — Gemini API bill protect: 30 requests/min per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'AI request limit reached. Please wait 1 minute.' },
});

// ──────────────────────────────────────────────────────────────────────────────

async function startServer() {
  const app = express();

  // Body size limit — bade payload attacks se protection (default 100kb)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // Global rate limit — sab routes pe apply
  app.use(globalLimiter);

  // Security Headers (SEO audit fixes)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: blob: https:",
        "connect-src 'self' https://rjxbdjgagizjmjwnlbxx.supabase.co wss://rjxbdjgagizjmjwnlbxx.supabase.co https://generativelanguage.googleapis.com",
        "media-src 'self' blob: data: https:",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ')
    );
    next();
  });

  // 0. ADMIN LOGIN ENDPOINT (Strict rate limit — brute-force protection)
  app.post('/api/admin-login', adminLoginLimiter, (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      // Credentials live ONLY on the server — never shipped to the browser
      const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'digiworku55@gmail.com,virkanwlia@gmail.com')
        .split(',')
        .map((e: string) => e.trim().toLowerCase());

      const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DigiWorku55@';

      const cleanEmail = email.trim().toLowerCase();

      if (ADMIN_EMAILS.includes(cleanEmail) && password === ADMIN_PASSWORD) {
        res.json({ success: true });
        return;
      }

      res.status(401).json({ error: 'Access Denied: Invalid credentials.' });
    } catch (err: any) {
      console.error('Error in /api/admin-login:', err);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  // 1. CHAT ENDPOINT (AI rate limited)
  app.post('/api/chat', aiLimiter, async (req, res) => {
    try {
      const { history = [], message, systemInstruction = "You are a helpful creative assistant." } = req.body;
      if (!message) {
        res.status(400).json({ error: "Missing message parameter." });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using simulated chatbot fallback response.");
        let reply = `Hello! I am DigiWorku Admin. Our custom technical workflows and project parameters are running successfully.`;
        if (message.toLowerCase().includes('report') || message.toLowerCase().includes('pdf') || message.toLowerCase().includes('analytics')) {
          reply = "Understood! The optimization analytics report is ready in your Client Portal. Let me know if you would like me to compile additional comparative matrices.";
        } else if (message.toLowerCase().includes('brand') || message.toLowerCase().includes('logo') || message.toLowerCase().includes('design')) {
          reply = "We have mapped out 3 fresh aesthetic options for your custom branding. Let's schedule a call tomorrow with our Lead visual director to finalize.";
        } else if (message.toLowerCase().includes('status') || message.toLowerCase().includes('help') || message.toLowerCase().includes('who')) {
          reply = "As your DigiWorku Client Partner, I am here to help you coordinate design, dev, and analytics tasks. We ensure: 'Results jo aapki growth ko define karein'.";
        }
        res.json({ text: reply });
        return;
      }

      const ai = getAI();
      
      // Build standard contents array
      const contents = history.map((item: any) => ({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content || '' }]
      }));
      
      // Add current message
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "No response text generated." });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({ error: err.message || "An error occurred with Gemini API." });
    }
  });

  // 2. FLASHCARDS ENDPOINT (Structured JSON)
  app.post('/api/flashcards', aiLimiter, async (req, res) => {
    try {
      const { topic, count = 6 } = req.body;
      if (!topic) {
        res.status(400).json({ error: "Missing topic parameter." });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using simulated flashcards fallback.");
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
        res.json({ cards: mockCards.slice(0, count) });
        return;
      }

      const ai = getAI();
      const prompt = `Generate a set of ${count} high-quality educational flashcards about: "${topic}". Make sure the target audience gets intuitive and clear answers.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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
      res.json({ cards });
    } catch (err: any) {
      console.error("Error in /api/flashcards:", err);
      res.status(500).json({ error: err.message || "An error occurred building flashcards." });
    }
  });

  // 3. MIND MAP ENDPOINT (Structured JSON Graph)
  app.post('/api/mindmap', aiLimiter, async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) {
        res.status(400).json({ error: "Missing topic parameter." });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using simulated mindmap fallback.");
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
        res.json(mockMindmap);
        return;
      }

      const ai = getAI();
      const prompt = `Deconstruct the topic "${topic}" into a logical node graph (5 to 8 nodes total) for visualization. Provide a central root node, and connecting branch nodes. Connect children to parents or sibling nodes.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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
      res.json(mindmap);
    } catch (err: any) {
      console.error("Error in /api/mindmap:", err);
      res.status(500).json({ error: err.message || "An error occurred constructing your mindmap." });
    }
  });

  // 4. COMPOSE DOC ENDPOINT (Creative text styling)
  app.post('/api/compose', aiLimiter, async (req, res) => {
    try {
      const { prompt, style = "Professional", format = "Markdown Report" } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Missing prompt parameter." });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. Using simulated compose fallback.");
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
        res.json({ text: markdownText });
        return;
      }

      const ai = getAI();
      const userPrompt = `Write a document about: "${prompt}". 
Style: "${style}". 
Format: "${format}". 
Make it expansive, clean, and extremely polished. Use Markdown headlines, lists, and quotes nicely. Do not use conversational preambles.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: "You are an elite creative writer, author, and professional summarizer. Produce stellar typography-friendly content directly without apologies or introductions.",
          temperature: 0.8,
        }
      });

      res.json({ text: response.text || "" });
    } catch (err: any) {
      console.error("Error in /api/compose:", err);
      res.status(500).json({ error: err.message || "An error occurred writing draft." });
    }
  });

  // SERVE CLIENT ASSETS & ROUTING
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Express server + Vite running on port ${port} (production: ${process.env.NODE_ENV === 'production'})`);
  });
}

startServer();
