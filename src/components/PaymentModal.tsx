import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Wallet, Calendar } from 'lucide-react';
import { Document as AppDocument, useStore } from '../store/useStore';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: AppDocument | null;
}

export function PaymentModal({ isOpen, onClose, document: doc }: PaymentModalProps) {
  const { updateDocument, addTransaction } = useStore();

  const [amount, setAmount] = useState<number>(0);
  const [isTotal, setIsTotal] = useState(false);
  const [method, setMethod] = useState<'Bonifico' | 'Contanti' | 'Carta'>('Bonifico');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (doc) {
      const remaining = doc.amount - (doc.paidAmount || 0);
      setAmount(remaining);
      setIsTotal(true);
    }
  }, [doc, isOpen]);

  useEffect(() => {
    if (doc && isTotal) {
      setAmount(doc.amount - (doc.paidAmount || 0));
    }
  }, [isTotal, doc]);

  if (!doc) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      alert("L'importo deve essere superiore a zero.");
      return;
    }

    const newPaid = (doc.paidAmount || 0) + amount;
    const isFullyPaid = newPaid >= doc.amount;

    updateDocument(doc.id, {
      paidAmount: newPaid,
      status: isFullyPaid ? 'Pagato' : 'Pagamento Parziale'
    });

    addTransaction({
      id: '',
      type: 'Entrata',
      date: date,
      amount: amount,
      recipient: doc.recipient,
      category: `Incasso ${doc.type} n. ${doc.number}`,
      method: method,
      referenceId: doc.id.toString(),
      notes: `Pagamento per ${doc.number}`
    });

    onClose();
  };

  const remainingBalance = doc.amount - (doc.paidAmount || 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Wallet className="text-amber-400" size={24} />
                Registra Pagamento
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Documento</span>
                  <span className="text-xs font-bold text-white">{doc.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Residuo da Pagare</span>
                  <span className="text-lg font-black text-amber-400">€ {remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Importo Pagamento</label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isTotal}
                      onChange={(e) => setIsTotal(e.target.checked)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isTotal ? 'bg-amber-500 border-amber-500' : 'bg-slate-950/50 border-white/10 group-hover:border-white/20'}`}>
                      {isTotal && <Save size={10} className="text-white" />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Totale residuo</span>
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setIsTotal(false);
                    }}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl pl-8 pr-4 py-4 text-xl font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Metodo di Pagamento</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Bonifico', 'Contanti', 'Carta'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${
                        method === m
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-950/50 border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Data Pagamento</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-4 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Registra Pagamento
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
