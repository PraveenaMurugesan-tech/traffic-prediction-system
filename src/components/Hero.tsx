import { motion } from "motion/react";
import { Sparkles, ArrowRight, Play, Globe } from "lucide-react";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 text-xs font-bold mb-8 uppercase tracking-widest"
        >
          <Sparkles size={14} />
          Autonomous Neural Infrastructure
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tight"
        >
          AI-POWERED <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">TRAFFIC ORACLE</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-slate-400 md:text-lg mb-10 font-medium"
        >
          Predict gridlocks with 99.2% accuracy. Our mesh network synchronizes city flow in real-time using quantum-resistant machine learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-cyan-500 text-black font-bold rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold rounded-xl transition-all flex items-center gap-2">
            <Play size={18} fill="currentColor" /> Watch Simulation
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10"
        >
          {[
            { label: "Data Nodes", val: "1.2M+" },
            { label: "Prediction Accuracy", val: "99.2%" },
            { label: "Cities Active", val: "42" },
            { label: "Latency", val: "<0.4ms" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
