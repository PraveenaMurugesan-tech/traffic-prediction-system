import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'motion/react';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';

const FLOW_DATA = [
  { time: '00:00', load: 30, cars: 420 },
  { time: '04:00', load: 15, cars: 200 },
  { time: '08:00', load: 85, cars: 1200 },
  { time: '12:00', load: 60, cars: 950 },
  { time: '16:00', load: 95, cars: 1450 },
  { time: '20:00', load: 70, cars: 880 },
  { time: '23:59', load: 45, cars: 550 },
];

const ACCURACY_DATA = [
  { name: 'Route A', accuracy: 98 },
  { name: 'Route B', accuracy: 92 },
  { name: 'Route C', accuracy: 95 },
  { name: 'Route D', accuracy: 88 },
];

export default function AnalysisPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Traffic Flow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 glass-card p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Traffic Flow Dynamics</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Neural prediction vs Actual volume</p>
          </div>
          <div className="flex items-center gap-2 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/20">
            <TrendingUp size={14} className="text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400">+12% Peak Surge</span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FLOW_DATA}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#06b6d4' }}
              />
              <Area 
                type="monotone" 
                dataKey="load" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#flowGradient)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Model Performance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Model Training Status</h3>
          <Info size={16} className="text-slate-500" />
        </div>

        <div className="space-y-6">
          {ACCURACY_DATA.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">{item.name} Accuracy</span>
                <span className="text-cyan-400 font-bold">{item.accuracy}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.accuracy}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3">
          <AlertTriangle size={20} className="text-amber-500 shrink-0" />
          <div className="text-[10px] text-amber-500/80 leading-relaxed uppercase tracking-widest font-bold">
            Anomaly detected in sector 4. Sensor recalibration triggered via edge computing layer.
          </div>
        </div>
      </motion.div>
    </div>
  );
}
