import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { StockItem, useStore } from '../store/useStore';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: StockItem;
}

export function StockModal({ isOpen, onClose, item }: StockModalProps) {
  const { addStockItem, updateStockItem } = useStore();
  const [formData, setFormData] = useState<Partial<StockItem>>(
    item || { sku: '', name: '', category: 'Materie Prime', quantity: 0, unit: 'L', minStock: 10, price: 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      updateStockItem(item.sku, formData);
    } else {
      addStockItem(formData as StockItem);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white">{item ? 'Modifica Articolo' : 'Nuovo Articolo'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">SKU / Codice</label>
                  <input
                    required
                    readOnly={!!item}
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                    className={`w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${item ? 'text-slate-500 cursor-not-allowed' : ''}`}
                    placeholder="ES: MP-ALC-01"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Categoria</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Materie Prime">Materie Prime</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Prodotti Finiti">Prodotti Finiti</option>
                    <option value="Campioni">Campioni</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nome / Descrizione</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Nome articolo..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Quantità</label>
                  <input
                    required
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Unità</label>
                  <input
                    required
                    type="text"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="L, ml, pz..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Scorta Min.</label>
                  <input
                    required
                    type="number"
                    value={formData.minStock}
                    onChange={e => setFormData({...formData, minStock: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Prezzo Unitario (€)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-[2] px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {item ? 'Salva Modifiche' : 'Aggiungi Articolo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
