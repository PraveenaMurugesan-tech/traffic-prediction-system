import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Activity, Clock, TrendingUp, Layers, Map as MapIcon, Globe, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const INITIAL_HOTSPOTS = [
  { id: 1, pos: [40.7128, -74.0060] as [number, number], name: "Manhattan Bridge", density: 85, trend: "up" },
  { id: 2, pos: [40.7306, -73.9352] as [number, number], name: "Queens Midtown", density: 42, trend: "down" },
  { id: 3, pos: [40.7589, -73.9851] as [number, number], name: "Times Square Hub", density: 98, trend: "steady" },
  { id: 4, pos: [40.7484, -73.9857] as [number, number], name: "Empire State Link", density: 65, trend: "up" },
];

const ROUTE_VECTORS: Record<string, { coords: [number, number][], color: string }> = {
  r1: {
    coords: [[40.7128, -74.0060], [40.7250, -74.0050], [40.7350, -74.0150], [40.7480, -74.0050]],
    color: '#ef4444' // Red for Fastest/Aggressive
  },
  r2: {
    coords: [[40.7128, -74.0060], [40.7150, -73.9900], [40.7250, -73.9700], [40.7350, -73.9500]],
    color: '#22d3ee' // Cyan for Balanced/Optimized
  },
  r3: {
    coords: [[40.7128, -74.0060], [40.7050, -73.9950], [40.6950, -73.9850], [40.6850, -73.9750]],
    color: '#10b981' // Emerald for Economy/Green
  }
};

interface TrafficMapProps {
  activeRouteId: string;
}

export default function TrafficMap({ activeRouteId }: TrafficMapProps) {
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);

  const criticalAlerts = useMemo(() => 
    hotspots.filter(h => h.density > 85),
  [hotspots]);

  // Create custom icon for alerts
  const alertIcon = L.divIcon({
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        <div className="absolute w-8 h-8 bg-red-600 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-red-600 p-1.5 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <AlertTriangle size={18} className="text-white" />
        </div>
      </div>
    ),
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHotspots(prev => prev.map(h => ({
        ...h,
        density: Math.max(10, Math.min(100, h.density + (Math.random() > 0.5 ? 1 : -1) * 2)),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : h.trend
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[650px] w-full rounded-2xl overflow-hidden glass-card p-1 border-white/5">
      {/* Live Feed Overlay */}
      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-3 pointer-events-none md:pointer-events-auto">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl w-64">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="text-cyan-400 animate-pulse" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Grid Nodes</span>
            </div>
            <div className="flex h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
          </div>
          <div className="space-y-4">
            {hotspots.map(h => (
              <div key={h.id} className="flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{h.name}</span>
                  <span className="text-[9px] text-slate-600 font-mono tracking-tighter">Lat: {h.pos[0].toFixed(2)} Lng: {h.pos[1].toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-xs font-black ${h.density > 80 ? 'text-red-400' : h.density > 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {h.density}%
                    </span>
                  </div>
                  {h.trend === 'up' ? <TrendingUp size={14} className="text-red-400 animate-bounce" /> : <Clock size={14} className="text-emerald-400" />}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-4">
              <span>Telemetry Sync</span>
              <span className="text-cyan-500">Active</span>
            </div>

            {/* Critical Alerts Feed */}
            <AnimatePresence>
              {criticalAlerts.length > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-[9px] font-black text-red-400 uppercase tracking-widest border-b border-red-500/20 pb-2 mb-2">
                    <AlertTriangle size={12} />
                    Critical Alerts ({criticalAlerts.length})
                  </div>
                  {criticalAlerts.map(alert => (
                    <motion.div 
                      key={alert.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg flex items-center justify-between group"
                    >
                      <span className="text-[10px] text-red-200 font-bold">{alert.name}</span>
                      <span className="text-[10px] font-black text-red-400">{alert.density}%</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <MapContainer 
        center={[40.7128, -74.0060]} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full z-10"
      >
        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Dark Matrix">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="map-dark-filter"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite View">
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Terrain Detail">
            <TileLayer
              attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* Neural Route Vectors */}
        {Object.entries(ROUTE_VECTORS).map(([id, data]) => {
          const isActive = id === activeRouteId;
          return (
            <Polyline
              key={id}
              positions={data.coords}
              pathOptions={{
                color: isActive ? data.color : 'rgba(255,255,255,0.1)',
                weight: isActive ? 6 : 2,
                opacity: isActive ? 1 : 0.3,
                dashArray: isActive ? undefined : '5, 10',
                className: isActive ? 'active-route-glow' : ''
              }}
            />
          );
        })}

        {hotspots.map(hotspot => (
          <Circle
            key={hotspot.id}
            center={hotspot.pos}
            pathOptions={{ 
              fillColor: hotspot.density > 80 ? '#ef4444' : hotspot.density > 50 ? '#f59e0b' : '#10b981',
              color: hotspot.density > 80 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
              weight: 2,
              fillOpacity: 0.5,
              className: hotspot.density > 85 ? 'animate-crit-pulse' : 'animate-pulse'
            }}
            radius={600}
          >
            <Popup className="custom-popup">
              <div className="bg-slate-900 text-white p-3 rounded-lg min-w-40 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${hotspot.density > 80 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-green-500'}`} />
                  <h3 className="font-black uppercase text-[10px] tracking-widest">{hotspot.name}</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Density</p>
                    <p className="text-sm font-black text-white">{hotspot.density}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest font-bold">Trend</p>
                    <p className={`text-sm font-black ${hotspot.trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {hotspot.trend === 'up' ? 'Rising' : 'Clearing'}
                    </p>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Critical Alert Markers */}
        {criticalAlerts.map(alert => (
          <Marker 
            key={`alert-${alert.id}`} 
            position={alert.pos} 
            icon={alertIcon}
            zIndexOffset={1000}
          >
            <Popup className="custom-popup">
              <div className="bg-red-950 text-white p-3 rounded-lg min-w-40 border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-red-500 animate-pulse" size={16} />
                  <h3 className="font-black uppercase text-[10px] tracking-widest text-red-400">Critical Congestion</h3>
                </div>
                <p className="text-[11px] font-bold text-red-200/80 mb-3">{alert.name} infrastructure limit reached.</p>
                <div className="bg-red-500/20 rounded p-2 border border-red-500/20">
                  <div className="flex justify-between text-[10px] font-black uppercase text-red-400">
                    <span>Peak Density</span>
                    <span>{alert.density}%</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Decorative HUD */}
      <div className="absolute top-6 right-6 z-[400] hidden lg:block">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Globe size={14} className="text-cyan-400" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">S-01 Sector Active</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <MapIcon size={14} className="text-purple-400" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Logistics Layer: Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
}

