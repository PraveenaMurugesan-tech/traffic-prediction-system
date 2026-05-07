import { Github, Twitter, Linkedin, Activity, Shield, Globe, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-20 px-8 py-6 bg-white/5 backdrop-blur-xl border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 tracking-widest uppercase font-bold">
      <div className="mb-4 md:mb-0">System Uptime: 99.98% • v4.2.0-Alpha</div>
      <div className="mb-4 md:mb-0">Built for Smart Cities using AI Neural Matrix</div>
      <div className="flex gap-6">
        <span className="text-cyan-500 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
          Network Status: Stable
        </span>
        <a href="#" className="hover:text-white transition-colors">Support</a>
        <a href="#" className="hover:text-white transition-colors">API Docs</a>
      </div>
    </footer>
  );
}
