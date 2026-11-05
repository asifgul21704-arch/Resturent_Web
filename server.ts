import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter, connectDatabaseAndBootstrapAdmin } from "./src/server/auth.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/admin", authRouter);

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini AI Food Concierge & Assistant API
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, menuContext, activeOrders, userProfile } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message prompt is required" });
    }

    const ai = getAIClient();
    if (!ai) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        reply: `Hello! I'm your Foody Culinary Concierge. Our chefs recommend trying our signature **Berries Salad** ($5.00), **Classic Truffle Burger** ($8.00), or **Artisan Pepperoni Sourdough Pizza** ($11.00). Use coupon code **FOODY20** at checkout for 20% off! How can I assist your appetite today?`,
        suggestedItems: ["salad-1", "burger-1", "pizza-1"],
        actionType: "view_menu"
      });
    }

    const systemInstruction = `You are "Foody Chef AI", the smart, friendly, and expert culinary assistant for "The Foody" restaurant and food delivery platform.
Your goals:
1. Help users discover the best dishes based on their taste, budget, dietary needs (Vegan, Gluten-free, Keto, Low-Calorie, Spicy).
2. Answer questions about nutritional info, calories, ingredients, cooking times, pairings (e.g. what shake goes well with a burger).
3. If the user asks about tracking or their order, check the active orders provided in context and provide reassuring, helpful updates.
4. Keep replies conversational, appetizing, concise (2-4 paragraphs max), warm, and structured with bold highlights and bullet points when listing items.
5. If recommending items, mention their exact names and prices from the menu.

Menu items available at Foody:
${JSON.stringify(menuContext || [], null, 2)}

User profile / dietary preferences:
${JSON.stringify(userProfile || {}, null, 2)}

Active Orders (if any):
${JSON.stringify(activeOrders || [], null, 2)}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I would love to help you find the best meal at Foody! Check out our featured Berries Salad and Truffle Burgers.";

    res.json({
      reply: replyText,
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      fallbackReply: "I'm having a slight connection blip with the kitchen AI, but I highly recommend our fresh Berries Salad ($5.00) and Artisan Pepperoni Pizza ($11.00) with code FOODY20 for 20% off!"
    });
  }
});

// Gemini Meal Recommender API
app.post("/api/gemini/recommend", async (req, res) => {
  try {
    const { dietaryPreference, calorieTarget, mood } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        recommendation: "Our signature combo: Fresh Berries Salad ($5.00) paired with Sparkling Passionfruit Cooler ($3.50) for a revitalizing, light lunch under 400 calories!",
        recommendedIds: ["salad-1", "drink-1"]
      });
    }

    const prompt = `Based on mood "${mood || 'hungry & healthy'}", dietary preference "${dietaryPreference || 'Any'}", and calorie target around "${calorieTarget || '600'} kcal", recommend 2-3 items from Foody's menu with a brief appetizing explanation of why they pair well.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite nutritionist and executive chef at Foody. Provide a concise, delightful combo recommendation."
      }
    });

    res.json({
      recommendation: response.text || "Try our Healthy Salad and Avocado Burger for a balanced, energizing meal!"
    });
  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ error: "Failed to create recommendation" });
  }
});

// Start the server with Vite middleware in dev or static files in prod
async function startServer() {
  await connectDatabaseAndBootstrapAdmin();
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
    console.log(`Foody Server running at http://localhost:${PORT}`);
  });
}

startServer();
