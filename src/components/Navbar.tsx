import { motion } from "motion/react";
import { Activity, Zap, Shield, BarChart3, Map as MapIcon, Info, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", id: "home", icon: <Zap size={18} /> },
    { name: "Dashboard", id: "dashboard", icon: <Activity size={18} /> },
    { name: "Analytics", id: "analytics", icon: <BarChart3 size={18} /> },
    { name: "Prediction", id: "prediction", icon: <MapIcon size={18} /> },
    { name: "About", id: "about", icon: <Info size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/5 backdrop-blur-xl py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase">AURA TRAFFIC</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onNavigate(item.id)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
            >
              {item.name}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <div className="text-[10px] uppercase tracking-widest text-slate-500">System Link</div>
            <div className="text-xs text-green-400 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Stable
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('dashboard')}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/20 p-0.5 rounded-full"
          >
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TrafficAI" className="w-8 h-8 rounded-full bg-slate-800" alt="Profile" />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
