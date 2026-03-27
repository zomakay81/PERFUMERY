import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, X, Send, Bot, User, RefreshCw, AlertCircle } from 'lucide-react';
import { getAIChatResponse } from '../../lib/gemini';
import { useStore } from '../../store/useStore';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const { stock, batches, suppliers, documents } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Proactive analysis on mount
  useEffect(() => {
    const checkAlerts = () => {
      const lowStock = stock.filter(i => i.status !== 'Ottimo');
      if (lowStock.length > 0) {
        setNotification(`Attenzione: ${lowStock.length} articoli in esaurimento o da riordinare.`);
      }
    };
    checkAlerts();
  }, [stock]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setNotification(null);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const context = { stock, batches, suppliers, documents };
      const response = await getAIChatResponse(history, context);

      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Mi dispiace, ho avuto un problema nel processare la richiesta. Verifica la connessione o l'API Key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {notification && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-64 p-4 glass-card border-amber-500/30 flex gap-3 items-start shadow-2xl"
          >
            <AlertCircle className="text-amber-400 shrink-0" size={18} />
            <div>
              <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">AI Insight</p>
              <p className="text-xs text-slate-300 leading-tight">{notification}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen ? (
        <motion.button
          id="ai-chat-toggle"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-purple-600/40 relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Sparkles size={28} />
          {notification && <div className="absolute top-0 right-0 w-4 h-4 bg-amber-500 rounded-full border-4 border-slate-950" />}
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-[400px] h-[600px] glass-card shadow-2xl flex flex-col overflow-hidden border-purple-500/20"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-black text-white tracking-tight">ESSENZA AI</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyst Ready</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 mb-2">
                  <Bot size={32} />
                </div>
                <h4 className="text-lg font-bold text-white">Come posso aiutarti oggi?</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Posso analizzare il magazzino, suggerire formule o controllare lo stato delle macerazioni.
                </p>
                <div className="grid grid-cols-1 gap-2 w-full pt-4">
                  {[
                    "Analizza le scorte critiche",
                    "Suggerisci una formula Oud & Rosa",
                    "Quali sono le macerazioni in ritardo?"
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-xs text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 text-slate-300 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    m.role === 'user' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-400'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-lg shadow-purple-600/20'
                      : 'bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none'
                  }`}>
                    {m.text.split('\n').map((line, idx) => (
                      <p key={idx} className={idx > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-purple-400 flex items-center justify-center">
                    <RefreshCw size={16} className="animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-slate-950/50">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Chiedi all'AI..."
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-slate-600"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-600 mt-3 font-bold uppercase tracking-widest">
              Powered by ESSENZA Lab Intelligence
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
