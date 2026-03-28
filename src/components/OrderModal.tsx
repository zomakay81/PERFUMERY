import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Order, useStore, Customer, StockItem } from '../store/useStore';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
}

export function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
  const { addOrder, updateOrder, customers, stock } = useStore();
  const finishedProducts = stock.filter(s => s.category === 'Prodotti Finiti');
  
  const [formData, setFormData] = useState<Partial<Order>>(
    order || { 
      id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`,
      customerId: customers.length > 0 ? customers[0].id : 0,
      customerName: customers.length > 0 ? customers[0].name : '',
      date: new Date().toISOString().split('T')[0],
      status: 'Nuovo',
      items: [],
      total: 0
    }
  );

  const handleAddItem = () => {
    const newItem = { sku: finishedProducts[0]?.sku || '', name: finishedProducts[0]?.name || '', quantity: 1, price: finishedProducts[0]?.price || 0 };
    const newItems = [...(formData.items || []), newItem];
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = (formData.items || []).filter((_, i) => i !== index);
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const updateItem = (index: number, updates: any) => {
    const newItems = (formData.items || []).map((item, i) => {
      if (i === index) {
        const updated = { ...item, ...updates };
        if (updates.sku) {
            const product = finishedProducts.find(p => p.sku === updates.sku);
            if (product) {
                updated.name = product.name;
                updated.price = product.price;
            }
        }
        return updated;
      }
      return item;
    });
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, total: newTotal });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === Number(formData.customerId));
    const finalData = { ...formData, customerName: customer?.name } as Order;
    
    if (order) {
      updateOrder(order.id, finalData);
    } else {
      addOrder(finalData);
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
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black text-white">{order ? 'Modifica Ordine' : 'Nuovo Ordine'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">ID Ordine</label>
                  <input 
                    readOnly
                    type="text" 
                    value={formData.id}
                    className="w-full bg-slate-950/30 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Data</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Cliente</label>
                  <select 
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: Number(e.target.value)})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Stato</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Nuovo">Nuovo</option>
                    <option value="In Lavorazione">In Lavorazione</option>
                    <option value="Spedito">Spedito</option>
                    <option value="Consegnato">Consegnato</option>
                    <option value="Annullato">Annullato</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Articoli</label>
                  <button 
                    type="button"
                    onClick={handleAddItem}
                    className="text-[10px] font-black text-purple-400 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12} /> AGGIUNGI RIGA
                  </button>
                </div>
                
                <div className="space-y-2">
                    {formData.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex-1">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Prodotto</label>
                                <select 
                                    value={item.sku}
                                    onChange={e => updateItem(idx, { sku: e.target.value })}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                                >
                                    {finishedProducts.map(p => <option key={p.sku} value={p.sku}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="w-20">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Qtà</label>
                                <input 
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateItem(idx, { quantity: Number(e.target.value) })}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Prezzo</label>
                                <input 
                                    type="number"
                                    value={item.price}
                                    onChange={e => updateItem(idx, { price: Number(e.target.value) })}
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs focus:outline-none"
                                />
                            </div>
                            <button 
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Totale Ordine</p>
                    <p className="text-3xl font-black text-white">€ {formData.total?.toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                    >
                        Annulla
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                    >
                        <Save size={18} /> {order ? 'Salva Modifiche' : 'Conferma Ordine'}
                    </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
