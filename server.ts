import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", system: "TRAFFIC.AI Oracle" });
  });

  // Simulated AI Traffic Data Endpoint
  app.post("/api/predict", async (req, res) => {
    const { location, time, weather, density } = req.body;
    
    // In a real app, this might call a Python ML model or complex logic.
    // We'll return a sophisticated simulated response that the frontend can use.
    // The actual AI reasoning will happen in the frontend component using the Gemini SDK.
    
    const baseCongestion = Math.random() * 40 + 20; // 20-60%
    const weatherFactor = weather === 'Rainy' ? 1.4 : weather === 'Stormy' ? 1.8 : 1.0;
    const densityFactor = density === 'High' ? 1.5 : density === 'Medium' ? 1.1 : 0.8;
    
    const finalScore = Math.min(100, baseCongestion * weatherFactor * densityFactor);
    
    res.json({
      score: Math.round(finalScore),
      confidence: 85 + Math.random() * 10,
      alerts: finalScore > 75 ? ["High risk of gridlock", "Emergency lane restriction likely"] : [],
      recommendation: finalScore > 50 ? "Alternate route suggested via AI-optimized bypass" : "Stay on current path"
    });
  });

  // Vite middleware for development
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
    console.log(`TRAFFIC.AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
