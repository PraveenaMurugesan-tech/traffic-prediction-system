import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, X, Terminal, BrainCircuit } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Systems online. I am Traffic Intelligence Core v4.2. How can I assist with your logistics optimization today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userText = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userText,
        config: {
          systemInstruction: "You are the TRAFFIC.AI Oracle, a futuristic smart city traffic assistant. Use highly technical, professional, and futuristic language. You know about smart city infrastructure, route optimization, self-driving car grids, and predictive analytics. Keep responses concise and information-dense. Use markdown for technical lists."
        }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "Error processing data stream." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', text: "Signal interference detected. Cloud link unstable." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[1000] w-14 h-14 bg-cyan-500 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)]"
      >
        <MessageSquare />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-[1000] w-[400px] max-w-[calc(100vw-64px)] h-[550px] glass-card flex flex-col overflow-hidden border-cyan-500/30"
          >
            {/* Header */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BrainCircuit size={20} className="text-cyan-400" />
                <div>
                  <h3 className="text-sm font-black text-white tracking-widest uppercase">Traffic Intelligence</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Active Link</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user' 
                      ? 'bg-cyan-500 text-black font-medium rounded-tr-none' 
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}>
                    {m.role === 'ai' ? (
                      <div className="markdown-body">
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    ) : m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/40 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Intercept local grid data..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 w-9 h-9 flex items-center justify-center text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 opacity-30">
                <Terminal size={10} />
                <span className="text-[8px] font-mono uppercase tracking-widest">Encrypted SSL/TLS 256-bit</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
