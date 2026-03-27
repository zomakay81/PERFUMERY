import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2, Package } from 'lucide-react';
import { Document, useStore, StockItem, Supplier } from '../store/useStore';

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockInModal({ isOpen, onClose }: StockInModalProps) {
  const { addDocument, stock, addStockItem, suppliers } = useStore();

  const [formData, setFormData] = useState<Partial<Document>>({
    type: 'Carico Libero',
    direction: 'Entrata',
    number: `IN-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    recipient: 'Magazzino Centrale',
    status: 'Completato',
    items: [],
    amount: 0
  });

  const [showNewProduct, setShowNewProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<StockItem>>({
    sku: '',
    name: '',
    category: 'Materie Prime',
    quantity: 0,
    unit: 'L',
    minStock: 10,
    price: 0,
    status: 'Ottimo'
  });

  const handleAddItem = () => {
    const newItem = { sku: stock[0]?.sku || '', name: stock[0]?.name || '', quantity: 1, price: stock[0]?.price || 0 };
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
        // Add to current items
        const newItem = { sku: newProduct.sku, name: newProduct.name, quantity: 1, price: newProduct.price || 0 };
        const newItems = [...(formData.items || []), newItem];
        setFormData({ ...formData, items: newItems });
        setShowNewProduct(false);
        setNewProduct({ sku: '', name: '', category: 'Materie Prime', quantity: 0, unit: 'L', minStock: 10, price: 0, status: 'Ottimo' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items?.length === 0) {
        alert("Aggiungi almeno un articolo");
        return;
    }
    addDocument(formData as Document);
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
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Package className="text-emerald-400" size={24} />
                Carico Magazzino
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tipo Carico</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="Carico Libero">Carico Libero</option>
                    <option value="Ordine Fornitore">Ordine Fornitore</option>
                    <option value="Fattura Fornitore">Fattura Fornitore</option>
                    <option value="DDT Fornitore">DDT Fornitore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Provenienza / Fornitore</label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={e => setFormData({...formData, recipient: e.target.value})}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Nome fornitore o causale..."
                  list="suppliers-list"
                />
                <datalist id="suppliers-list">
                    {suppliers.map(s => <option key={s.id} value={s.name} />)}
                </datalist>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Articoli da Caricare</label>
                  <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowNewProduct(true)}
                        className="text-[10px] font-black text-emerald-400 flex items-center gap-1 hover:underline"
                      >
                        <Plus size={12} /> NUOVO PRODOTTO
                      </button>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="text-[10px] font-black text-purple-400 flex items-center gap-1 hover:underline"
                      >
                        <Plus size={12} /> AGGIUNGI RIGA
                      </button>
                  </div>
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
                                    {stock.map(p => <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>)}
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
                  className="flex-[2] px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Conferma Carico
                </button>
              </div>
            </form>

            {/* Modal Interno per Nuovo Prodotto */}
            <AnimatePresence>
                {showNewProduct && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 z-20 bg-slate-900 p-8 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-black text-white">Anagrafica Rapida Prodotto</h4>
                            <button onClick={() => setShowNewProduct(false)} className="p-2 text-slate-400"><X size={20}/></button>
                        </div>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">SKU / Codice</label>
                                    <input required type="text" placeholder="SKU" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Nome</label>
                                    <input required type="text" placeholder="Nome" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Categoria</label>
                                <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none">
                                    <option value="Materie Prime">Materie Prime</option>
                                    <option value="Packaging">Packaging</option>
                                    <option value="Prodotti Finiti">Prodotti Finiti</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Unità</label>
                                    <input type="text" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Prezzo Base (€)</label>
                                    <input type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm" />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl mt-4 transition-all">
                                Crea e Aggiungi al Carico
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
