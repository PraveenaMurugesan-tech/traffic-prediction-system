import { motion } from "motion/react";
import { Send, MapPin, Clock, Cloud, Users, Sparkles, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<null | any>(null);
  const [formData, setFormData] = useState({
    location: "Downtown NY",
    time: "17:30",
    weather: "Overcast",
    density: "High"
  });

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Backend simulation call
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const simData = await res.json();

      // Gemini AI Insights
      const prompt = `Act as a Smart City Traffic AI. 
      Generate a brief, futuristic traffic advisory for: 
      Location: ${formData.location}, Time: ${formData.time}, Weather: ${formData.weather}, Base Density: ${formData.density}.
      Simulation score: ${simData.score}% congestion.
      Provide: 1. A catchy AI status (e.g. "Congestion Threshold Exceeded") 2. A 1-sentence analytical insight. 3. One "Smart Optimization" tip.
      Keep it high-tech and professional. Output JSON format: { "status": "...", "insight": "...", "tip": "..." }`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const aiData = JSON.parse(aiResponse.text || "{}");
      setPrediction({ ...simData, ai: aiData });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <BrainCircuit className="text-cyan-400" size={24} />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Prediction Matrix</h2>
        </div>

        <form onSubmit={handlePredict} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Target Sector</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Temporal Context</label>
              <input 
                type="time" 
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all [color-scheme:dark]" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Weather Matrix</label>
              <select 
                value={formData.weather}
                onChange={e => setFormData({...formData, weather: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
              >
                <option value="Clear">Clear Skies</option>
                <option value="Rainy">Precipitation: High</option>
                <option value="Stormy">Severe Storm</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Vehicle Density</label>
              <select 
                value={formData.density}
                onChange={e => setFormData({...formData, density: e.target.value})}
                className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none transition-all"
              >
                <option value="Low">Low Load</option>
                <option value="Medium">Nominal</option>
                <option value="High">Congestion Cap</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Sparkles size={18} /> RUN ML ANALYSIS</>}
          </button>
        </form>
      </motion.div>

      <div className="space-y-6">
        {prediction ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-20 h-20 rounded-full border-4 border-cyan-500/10 flex items-center justify-center relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 226 }}
                    animate={{ strokeDashoffset: 226 - (226 * prediction.score) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="40" cy="40" r="36" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="226" 
                  />
                </svg>
                <span className="absolute text-xl font-black text-white">{prediction.score}%</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">AI Confidence Score</div>
                <div className="text-3xl font-black text-white">{prediction.confidence.toFixed(1)}%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Oracle System Status</div>
                <div className="text-white font-bold neon-text-cyan">{prediction.ai?.status || "Analyzing..."}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Machine Insight</div>
                <div className="text-slate-300 text-sm leading-relaxed">{prediction.ai?.insight}</div>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="text-[10px] font-bold text-purple-400 uppercase mb-2 tracking-widest">Optimization Strategy</div>
                <div className="text-purple-200 text-sm italic">"{prediction.ai?.tip}"</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center opacity-40 grayscale h-full min-h-[300px]">
            <BrainCircuit className="mb-4" size={48} />
            <p className="text-xs uppercase tracking-widest font-bold">Awaiting Data Streams...</p>
          </div>
        )}
      </div>
    </div>
  );
}
