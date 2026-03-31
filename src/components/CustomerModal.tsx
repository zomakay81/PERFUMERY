import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save } from 'lucide-react';
import { Customer, useStore } from '../store/useStore';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
}

export function CustomerModal({ isOpen, onClose, customer }: CustomerModalProps) {
  const { addCustomer, updateCustomer } = useStore();
  const [formData, setFormData] = useState<Partial<Customer>>(
    customer || { name: '', type: 'Privato', email: '', phone: '', address: '', zip: '', city: '', vat: '', sdiCode: '', totalOrders: 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer) {
      updateCustomer(customer.id, formData);
    } else {
      addCustomer(formData as Customer);
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
              <h3 className="text-xl font-black text-white">{customer ? 'Modifica Cliente' : 'Nuovo Cliente'}</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ragione Sociale / Nome</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Nome cliente..."
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Tipo Cliente</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <option value="Privato">Privato</option>
                    <option value="Azienda">Azienda</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Boutique">Boutique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="email@esempio.it"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Telefono</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="+39 ..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Indirizzo</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Via e n. civico"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">CAP</label>
                  <input 
                    type="text" 
                    value={formData.zip}
                    onChange={e => setFormData({...formData, zip: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Es. 00100"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Città</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Città"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Partita IVA</label>
                  <input 
                    type="text" 
                    value={formData.vat}
                    onChange={e => setFormData({...formData, vat: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="IT01234567890"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Codice SDI</label>
                  <input 
                    type="text" 
                    value={formData.sdiCode}
                    onChange={e => setFormData({...formData, sdiCode: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Codice Destinatario"
                  />
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
                  className="flex-[2] px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {customer ? 'Salva Modifiche' : 'Crea Cliente'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
