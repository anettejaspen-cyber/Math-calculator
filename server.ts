import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase request size to handle large base64 camera images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Lazy initializer for Google Gen AI to prevent start-up failure if key is not yet set.
let aiClient: any = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("PLACEHOLDER") || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY environment variable is not configured. Please add your key in the 'Settings > Secrets' panel in Google AI Studio.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Math solver structured output schema
const mathSolverResponseSchema = {
  type: Type.OBJECT,
  properties: {
    problem: {
      type: Type.STRING,
      description: "Mathematical text or equation of the parsed problem, represented elegantly.",
    },
    category: {
      type: Type.STRING,
      description: "Topic of the math problem (e.g., Quadratic Equations, Calculus - Derivatives, Basic Algebra).",
    },
    difficulty: {
      type: Type.STRING,
      description: "Difficulty level (Easy, Medium, Hard).",
    },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of key mathematical formulas, theorems, or concepts used.",
    },
    finalAnswer: {
      type: Type.STRING,
      description: "The ultimate final answer to the question.",
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER },
          title: { type: Type.STRING },
          expression: { type: Type.STRING, description: "The mathematical expression or result of this specific step." },
          explanation: { type: Type.STRING, description: "Clear, encouraging explanation of how this step was completed." },
          tip: { type: Type.STRING, description: "Helpful hint, alternative approach, or trap to watch out for." },
        },
        required: ["step", "title", "expression", "explanation"],
      },
    },
    practiceMatches: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "A similar math question the user can practice on." },
          hint: { type: Type.STRING, description: "A helpful tip or hint to solve this practice question." },
        },
        required: ["question", "hint"],
      },
    },
  },
  required: ["problem", "category", "difficulty", "keyConcepts", "finalAnswer", "steps", "practiceMatches"],
};

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", keyAvailable: !!process.env.GEMINI_API_KEY });
});

// Photo Scan Math Solver Route
app.post("/api/solve", async (req, res) => {
  try {
    const { image, mimeType, additionalPrompt } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing uploaded image payload" });
    }

    // Clean up base64 payload if it includes data-URL headers
    let base64Data = image;
    let resolvedMimeType = mimeType || "image/jpeg";
    if (image.startsWith("data:")) {
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches) {
        resolvedMimeType = matches[1];
        base64Data = matches[2];
      }
    }

    const ai = getGeminiClient();
    let promptText = "Review and parse this scanned hand-written or printed mathematics question. Solve it step-by-step and explain each technique used clearly.";
    if (additionalPrompt && additionalPrompt.trim()) {
      promptText += `\nStudent's instruction/request: "${additionalPrompt}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: resolvedMimeType,
            data: base64Data,
          },
        },
        {
          text: promptText,
        },
      ],
      config: {
        systemInstruction: `You are an expert high school and college math tutor.
Analyze the user's uploaded math image and solve it step-by-step.
Be engaging, accurate, and educational. Make math feel visual and clear!
You must structure the response strictly using the provided JSON schema. Ensure equations and steps are clean.`,
        responseMimeType: "application/json",
        responseSchema: mathSolverResponseSchema,
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error solving math scan:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while processing the math image.",
    });
  }
});

// Typed Formula Math Solver Route
app.post("/api/solve-text", async (req, res) => {
  try {
    const { expression, additionalPrompt } = req.body;
    if (!expression || !expression.trim()) {
      return res.status(400).json({ error: "Missing math expression to solve." });
    }

    const ai = getGeminiClient();
    let promptText = `Solve the following mathematical expression or problem step-by-step: "${expression}".`;
    if (additionalPrompt && additionalPrompt.trim()) {
      promptText += `\nStudent's instruction/request: "${additionalPrompt}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          text: promptText,
        },
      ],
      config: {
        systemInstruction: `You are an expert math tutor.
Solve the typed mathematical problem step-by-step.
Structure your reply strictly using the provided JSON schema.`,
        responseMimeType: "application/json",
        responseSchema: mathSolverResponseSchema,
      },
    });

    const parsedJson = JSON.parse(response.text || "{}");
    return res.json(parsedJson);

  } catch (error: any) {
    console.error("Error solving typed math:", error);
    return res.status(500).json({
      error: error.message || "An unexpected error occurred while processing the typed formula.",
    });
  }
});

// Vite frontend integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched successfully on port ${PORT}`);
  });
}

startServer();
