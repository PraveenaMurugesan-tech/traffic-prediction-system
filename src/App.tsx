/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrafficMap from './components/TrafficMap';
import RouteComparison from './components/RouteComparison';
import AnalysisPanel from './components/AnalysisPanel';
import PredictionForm from './components/PredictionForm';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Globe, Cpu, Activity, LayoutGrid } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeRouteId, setActiveRouteId] = useState('r2');
  const [liveStats, setLiveStats] = useState({
    sensors: 84022,
    prediction: 99.4,
    load: 64
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        sensors: prev.sensors + (Math.random() > 0.5 ? 1 : -1),
        prediction: Math.min(99.9, Math.max(98.5, prev.prediction + (Math.random() > 0.5 ? 0.1 : -0.1))),
        load: Math.min(100, Math.max(0, prev.load + (Math.random() > 0.5 ? 2 : -2)))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-cyan-500/30 font-sans">
      {/* Theme Background Mesh */}
      <div className="bg-mesh">
        <div className="mesh-1"></div>
        <div className="mesh-2"></div>
        <div className="mesh-3"></div>
      </div>

      <Navbar onNavigate={setCurrentPage} />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onStart={() => setCurrentPage('dashboard')} />
            
            {/* Features Preview */}
            <section className="py-32 max-w-7xl mx-auto px-6 relative">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Core Infrastructure</h2>
                <p className="text-slate-500 max-w-xl mx-auto">Decentralized protocols for the next era of urban transport.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <Shield className="text-cyan-400" />, title: "Quantum Security", desc: "Military-grade encryption for all city traffic data exchanges." },
                  { icon: <Zap className="text-purple-400" />, title: "Zero Latency", desc: "Edge computing ensures sub-millisecond response for emergency routing." },
                  { icon: <Globe className="text-cyan-400" />, title: "Global Sync", desc: "Seamless inter-city logistics coordination via satellite mesh." },
                ].map((f, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="glass-card-sm p-10 group cursor-default"
                  >
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-cyan-500/50 transition-all">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {currentPage === 'dashboard' && (
          <motion.main
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 max-w-7xl mx-auto px-6 space-y-12"
          >
            <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-white/10 pb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]" />
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Oracle Link: Optimized</span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tight">Command Center</h1>
              </div>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center gap-2">
                  <LayoutGrid size={16} /> Grid View
                </button>
                <button className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all flex items-center gap-2">
                  <Activity size={16} /> Metrics v4.2
                </button>
              </div>
            </div>

            <TrafficMap activeRouteId={activeRouteId} />
            
            <RouteComparison activeRouteId={activeRouteId} onRouteSelect={setActiveRouteId} />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Active Sensors", val: liveStats.sensors.toLocaleString(), mood: "cyan" },
                { label: "AI Prediction", val: `${liveStats.prediction.toFixed(1)}%`, mood: "purple" },
                { label: "City Load", val: `${liveStats.load}%`, mood: "amber" },
                { label: "Network Health", val: "Optimal", mood: "cyan" },
              ].map((s, i) => (
                <div key={i} className="glass-card-sm p-6 flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{s.label}</span>
                  <span className={`text-2xl font-black text-white neon-text-${s.mood}`}>{s.val}</span>
                </div>
              ))}
            </div>

            <AnalysisPanel />
          </motion.main>
        )}

        {(currentPage === 'prediction' || currentPage === 'analytics') && (
           <motion.main
            key="prediction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 max-w-7xl mx-auto px-6 space-y-12"
          >
             <div className="text-center mb-16">
               <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4">Neural Predictive Engine</h1>
               <p className="text-slate-500 max-w-xl mx-auto">Input logistics parameters to synchronize with the city-wide mesh network.</p>
             </div>
             <PredictionForm />
          </motion.main>
        )}

        {currentPage === 'about' && (
           <motion.main
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-20 max-w-7xl mx-auto px-6"
           >
             <div className="glass-card-sm p-12 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20">
                    <Cpu size={32} className="text-cyan-400" />
                  </div>
                  <h1 className="text-4xl font-black text-white uppercase tracking-tight">The Vision</h1>
                </div>
                <div className="space-y-6 text-slate-400 leading-relaxed font-medium">
                  <p>TRAFFIC.AI was founded on a simple principle: Urban mobility should be a solved problem. By treating city traffic as a fluid dynamic system regulated by decentralized AI, we eliminate the friction of modern life.</p>
                  <p>Our "Oracle" technology uses a hyper-converged mesh of IoT sensors, satellite imagery, and user telemetry to create a 4-dimensional map of city stress, allowing us to predict and dissipate congestion before the first brake light even flickers.</p>
                  <div className="grid grid-cols-2 gap-8 pt-10">
                    <div>
                      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Mission</h4>
                      <p className="text-sm italic">"To reclaim 200 million hours of lost human time per year through algorithmic flow optimization."</p>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Infrastructure</h4>
                      <p className="text-sm italic">Built on the Silicon Valley Sentinel Backbone and Integrated with 42 Global Smart City hubs.</p>
                    </div>
                  </div>
                </div>
             </div>
           </motion.main>
        )}
      </AnimatePresence>

      <Chatbot />
      <Footer />
    </div>
  );
}

