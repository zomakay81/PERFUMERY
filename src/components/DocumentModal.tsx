import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2, FileText, ArrowRight } from 'lucide-react';
import { Document, useStore, StockItem, Customer, Order } from '../store/useStore';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: Document;
  initialData?: Partial<Document>;
}

export function DocumentModal({ isOpen, onClose, document, initialData }: DocumentModalProps) {
  const { addDocument, updateDocument, stock, addStockItem, customers, orders } = useStore();

  const [formData, setFormData] = useState<Partial<Document>>(
    document || initialData || {
      type: 'Preventivo',
      direction: 'Uscita',
      number: `DOC-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      recipient: '',
      status: 'In Attesa',
      items: [],
      amount: 0
    }
  );

  const [showNewProduct, setShowNewProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<StockItem>>({
    sku: '', name: '', category: 'Prodotti Finiti', quantity: 0, unit: 'pz', minStock: 5, price: 0, status: 'Ottimo'
  });

  useEffect(() => {
    if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleAddItem = () => {
    const defaultProd = stock.find(s => s.category === 'Prodotti Finiti') || stock[0];
    const newItem = { sku: defaultProd?.sku || '', name: defaultProd?.name || '', quantity: 1, price: defaultProd?.price || 0 };
    const newItems = [...(formData.items || []), newItem];
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, amount: newTotal });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = (formData.items || []).filter((_, i) => i !== index);
    const newTotal = newItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setFormData({ ...formData, items: newItems, amount: newTotal });
  };

  const updateItem = (index: number, updates: any) => {
    const newItems = (formData.items || []).map((item, i) => {
      if (i === index) {
        const updated = { ...item, ...updates };
        if (updates.sku) {
            const product = stock.find(p => p.sku === updates.sku);
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
    setFormData({ ...formData, items: newItems, amount: newTotal });
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.sku && newProduct.name) {
        addStockItem(newProduct as StockItem);
        const newItem = { sku: newProduct.sku, name: newProduct.name, quantity: 1, price: newProduct.price || 0 };
        const newItems = [...(formData.items || []), newItem];
        setFormData({ ...formData, items: newItems, amount: (formData.amount || 0) + (newProduct.price || 0) });
        setShowNewProduct(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (document) {
      updateDocument(document.id, formData);
    } else {
      addDocument(formData as Document);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-xl z-10">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <FileText className="text-purple-400" size={24} />
                {document ? 'Modifica' : 'Nuovo'} {formData.type}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tipo Documento</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Preventivo">Preventivo</option>
                    <option value="DDT">DDT</option>
                    <option value="Fattura">Fattura</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Numero</label>
                  <input type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Data</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Destinatario / Cliente</label>
                <input
                  type="text" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Nome cliente..." list="customers-list"
                />
                <datalist id="customers-list">{customers.map(c => <option key={c.id} value={c.name} />)}</datalist>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Righe Documento</label>
                  <div className="flex gap-4">
                      <button type="button" onClick={() => setShowNewProduct(true)} className="text-[10px] font-black text-emerald-400 flex items-center gap-1 hover:underline"><Plus size={12} /> NUOVO PRODOTTO</button>
                      <button type="button" onClick={handleAddItem} className="text-[10px] font-black text-purple-400 flex items-center gap-1 hover:underline"><Plus size={12} /> AGGIUNGI RIGA</button>
                  </div>
                </div>

                <div className="space-y-2">
                    {formData.items?.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-end bg-white/5 p-3 rounded-xl border border-white/5">
                            <div className="flex-1">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Prodotto</label>
                                <select value={item.sku} onChange={e => updateItem(idx, { sku: e.target.value })} className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs focus:outline-none">
                                    {stock.map(p => <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>)}
                                </select>
                            </div>
                            <div className="w-16">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Qtà</label>
                                <input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, { quantity: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs" />
                            </div>
                            <div className="w-24">
                                <label className="block text-[8px] font-black text-slate-600 uppercase mb-1">Prezzo (€)</label>
                                <input type="number" step="0.01" value={item.price} onChange={e => updateItem(idx, { price: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-white/5 rounded-lg px-2 py-1.5 text-xs" />
                            </div>
                            <button type="button" onClick={() => handleRemoveItem(idx)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex items-center justify-between">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Totale</p>
                        <p className="text-3xl font-black text-white">€ {formData.amount?.toLocaleString()}</p>
                    </div>
                    {formData.paidAmount ? (
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Pagato</p>
                            <p className="text-xl font-black text-emerald-400">€ {formData.paidAmount?.toLocaleString()}</p>
                        </div>
                    ) : null}
                    {(formData.amount || 0) - (formData.paidAmount || 0) > 0 && formData.paidAmount ? (
                        <div>
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Residuo</p>
                            <p className="text-xl font-black text-rose-400">€ {((formData.amount || 0) - (formData.paidAmount || 0)).toLocaleString()}</p>
                        </div>
                    ) : null}
                </div>
                <div className="flex gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">Annulla</button>
                    <button type="submit" className="px-8 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"><Save size={18} /> Salva Documento</button>
                </div>
              </div>
            </form>

            {/* Sub-modal for New Product */}
            <AnimatePresence>
                {showNewProduct && (
                    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="absolute inset-0 z-20 bg-slate-900/95 backdrop-blur-md p-8 flex flex-col items-center justify-center">
                        <div className="w-full max-w-md bg-slate-800 p-6 rounded-3xl border border-white/10">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-black text-white">Nuovo Prodotto Rapido</h4>
                                <button onClick={() => setShowNewProduct(false)} className="p-2 text-slate-400"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <input required type="text" placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                                <input required type="text" placeholder="Nome Prodotto" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm">
                                    <option value="Prodotti Finiti">Prodotti Finiti</option>
                                    <option value="Campioni">Campioni</option>
                                    <option value="Packaging">Packaging</option>
                                </select>
                                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">Crea e Aggiungi</button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
