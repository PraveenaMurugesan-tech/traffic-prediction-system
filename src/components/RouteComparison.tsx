import { motion } from "motion/react";
import { Route, Clock, Zap, AlertTriangle, ChevronRight, Navigation } from "lucide-react";
import { useState, useEffect } from "react";

interface RouteOption {
  id: string;
  name: string;
  time: number;
  distance: string;
  density: number;
  delay: string;
  recommended: boolean;
  type: 'Fastest' | 'Balanced' | 'Economy';
}

const INITIAL_ROUTES: RouteOption[] = [
  { 
    id: "r1", 
    name: "Express Alpha (Bridge J-12)", 
    time: 14, 
    distance: "8.4 km", 
    density: 82, 
    delay: "+6 min", 
    recommended: false,
    type: 'Fastest'
  },
  { 
    id: "r2", 
    name: "Neural Bypass 402", 
    time: 18, 
    distance: "12.1 km", 
    density: 24, 
    delay: "None", 
    recommended: true,
    type: 'Balanced'
  },
  { 
    id: "r3", 
    name: "Industrial Sector W", 
    time: 22, 
    distance: "9.8 km", 
    density: 45, 
    delay: "+2 min", 
    recommended: false, 
    type: 'Economy'
  }
];

interface RouteComparisonProps {
  activeRouteId: string;
  onRouteSelect: (id: string) => void;
}

export default function RouteComparison({ activeRouteId, onRouteSelect }: RouteComparisonProps) {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(r => ({
        ...r,
        density: Math.max(5, Math.min(100, r.density + (Math.random() > 0.5 ? 1 : -1) * 2)),
        time: Math.max(5, r.time + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Navigation className="text-cyan-400" size={20} />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Route Comparison Matrix</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Real-time Stream</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route) => (
          <motion.div
            key={route.id}
            whileHover={{ y: -4 }}
            onClick={() => onRouteSelect(route.id)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              activeRouteId === route.id 
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                route.type === 'Fastest' ? 'bg-red-500/20 text-red-400' :
                route.type === 'Balanced' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-emerald-500/20 text-emerald-400'
              }`}>
                {route.type}
              </span>
              {route.recommended && (
                <div className="flex items-center gap-1 text-cyan-400">
                  <Zap size={12} fill="currentColor" />
                  <span className="text-[10px] font-black uppercase">AI Match</span>
                </div>
              )}
            </div>

            <h3 className="text-sm font-bold text-white mb-4 line-clamp-1">{route.name}</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Clock size={14} /> Travel Time
                </div>
                <span className="text-white font-bold">{route.time} min</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Route size={14} /> Distance
                </div>
                <span className="text-white font-bold">{route.distance}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest">
                <span className="text-slate-500">Density</span>
                <span className={route.density > 70 ? 'text-red-400' : 'text-cyan-400'}>{route.density}%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${route.density}%` }}
                  className={`h-full transition-all duration-1000 ${route.density > 70 ? 'bg-red-500' : 'bg-cyan-500'}`}
                />
              </div>
            </div>

            {route.delay !== "None" && (
              <div className="mt-4 flex items-center gap-2 text-amber-500/80 text-[10px] font-bold uppercase tracking-tighter p-2 bg-amber-500/5 rounded-lg border border-amber-500/10">
                <AlertTriangle size={12} /> Predicted Delay: {route.delay}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-cyan-500/40 transition-all">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
             <Zap size={20} />
           </div>
           <div>
             <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-0.5">Optimized Execution</div>
             <p className="text-xs text-slate-300">Synchronize all traffic nodes for chosen vector and establish priority lane.</p>
           </div>
        </div>
        <ChevronRight size={20} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}

