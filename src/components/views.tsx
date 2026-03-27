import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity, AlertTriangle, CheckCircle2, Clock, PackageSearch,
  TrendingUp, Plus, Search, Filter, Download, FileText, Package,
  ArrowUpRight, ArrowRight, Beaker, ShoppingBag, Truck, FlaskConical, Edit2, Trash2, Star
} from 'lucide-react';
import { useStore, Supplier, Customer, Order, Batch, StockItem, Document as AppDocument } from '../store/useStore';
import { SupplierModal } from './SupplierModal';
import { CustomerModal } from './CustomerModal';
import { OrderModal } from './OrderModal';
import { BatchModal } from './BatchModal';
import { StockModal } from './StockModal';
import { StockInModal } from './StockInModal';
import { DocumentModal } from './DocumentModal';
import { exportCatalogToPDF } from '../utils/pdfExport';

// --- COMPONENTS ---
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-card p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <Card className="relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-8 -mr-4 -mt-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon size={80} />
    </div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest">{title}</h3>
      <div className={`p-2 rounded-xl bg-slate-800/50 ${color}`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-black text-white">{value}</p>
      {trend && (
        <span className={`text-xs font-bold flex items-center gap-0.5 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          <TrendingUp size={12} className={trend.startsWith('-') ? 'rotate-180' : ''} />
          {trend}
        </span>
      )}
    </div>
  </Card>
);

// --- DASHBOARD ---
export function DashboardView({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { stock, batches, orders, exportData, importData } = useStore();

  const lowStock = stock.filter(i => i.status !== 'Ottimo').length;
  const activeBatches = batches.filter(b => b.status === 'In Corso').length;
  const warehouseValue = stock.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const monthOrders = orders.length; // Simplified for this context

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `essenza_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        const json = re.target?.result as string;
        importData(json);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Dashboard Panoramica</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Bentornato nel tuo laboratorio, ecco la situazione attuale.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleImport}
            title="Importa Backup"
            className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl transition-colors text-slate-400"
          >
            <ArrowUpRight size={20} className="rotate-180" />
          </button>
          <button
            onClick={handleExport}
            title="Esporta Backup"
            className="p-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl transition-colors text-slate-400"
          >
            <Download size={20} />
          </button>
          <button
            onClick={() => onNavigate?.('produzione')}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
          >
            <Plus size={20} /> Nuovo Progetto
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Produzioni Attive" value={activeBatches} icon={Activity} color="text-purple-400" />
        <StatCard title="Allarmi Scorte" value={lowStock} icon={AlertTriangle} color="text-amber-400" />
        <StatCard title="Valore Magazzino" value={`€ ${(warehouseValue/1000).toFixed(1)}k`} icon={ShoppingBag} color="text-emerald-400" />
        <StatCard title="Ordini Totali" value={monthOrders} icon={Truck} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Beaker className="text-purple-400" size={20} />
              Produzioni in Corso
            </h3>
            <button
              onClick={() => onNavigate?.('produzione')}
              className="text-xs font-bold text-purple-400 hover:underline"
            >
              Vedi tutto
            </button>
          </div>
          <div className="space-y-4">
            {batches.filter(b => b.status === 'In Corso').map((batch) => (
              <div key={batch.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <FlaskConical size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{batch.name}</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{batch.id} • {batch.phase}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 mb-1.5">Consegna prevista</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-gradient-to-r from-purple-500 to-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-white">{batch.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Attività Recenti</h3>
          </div>
          <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
            {[
              { id: 1, action: 'Lotto #LT-2023-08 completato', time: '2 ore fa', icon: CheckCircle2, color: 'text-emerald-400' },
              { id: 2, action: 'Nuovo preventivo #PRV-092', time: '4 ore fa', icon: FileText, color: 'text-blue-400' },
              { id: 3, action: 'Carico: 50L Alcol Etilico', time: 'Ieri', icon: Package, color: 'text-purple-400' },
            ].map((item) => (
              <div key={item.id} className="flex gap-4 relative">
                <div className={`w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center -ml-0.5 z-10`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text', 'bg')}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-200">{item.action}</p>
                  <p className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

// --- PRODUZIONE ---
export function ProduzioneView() {
  const { batches, deleteBatch } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | undefined>(undefined);

  const handleEdit = (b: Batch) => {
    setEditingBatch(b);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingBatch(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo lotto?')) {
      deleteBatch(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Produzione & Lotti</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gestione avanzata delle fasi di laboratorio.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} /> Nuovo Lotto
        </button>
      </header>

      <Card className="!p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4 bg-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Cerca lotto o fragranza..." className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm" />
          </div>
          <button className="p-2.5 border border-white/5 rounded-xl text-slate-400 hover:bg-white/5">
            <Filter size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">ID Lotto</th>
                <th className="p-5">Fragranza</th>
                <th className="p-5">Fase</th>
                <th className="p-5">Data Inizio</th>
                <th className="p-5">Data Fine</th>
                <th className="p-5">Stato</th>
                <th className="p-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {batches.map((lotto) => (
                <tr key={lotto.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-mono text-purple-400 font-bold">{lotto.id}</td>
                  <td className="p-5 font-bold text-white">{lotto.name}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {lotto.phase}
                    </span>
                  </td>
                  <td className="p-5 text-slate-400">{lotto.startDate}</td>
                  <td className="p-5 text-slate-400">{lotto.endDate}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      lotto.status === 'Completato' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {lotto.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(lotto)}
                        title="Modifica"
                        className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lotto.id)}
                        title="Elimina"
                        className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        batch={editingBatch}
      />
    </motion.div>
  );
}

// --- MAGAZZINO ---
export function MagazzinoView() {
  const { stock, deleteStockItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(undefined);

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (sku: string) => {
    if (confirm('Sei sicuro di voler eliminare questo articolo dal magazzino?')) {
      deleteStockItem(sku);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Magazzino</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Monitoraggio giacenze in tempo reale.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsStockInModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <Plus size={20} /> Carico Rapido
          </button>
          <button className="px-4 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl text-slate-300 font-bold text-sm transition-colors flex items-center gap-2">
            <Download size={18} /> Esporta
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
          >
            <Plus size={20} /> Nuovo Articolo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {['Materie Prime', 'Packaging', 'Prodotti Finiti', 'Campioni'].map((cat) => (
          <div key={cat} className="glass-card p-4 flex items-center justify-between group cursor-pointer hover:bg-purple-600/10 hover:border-purple-500/30 transition-all">
            <span className="font-bold text-slate-300 group-hover:text-purple-400">{cat}</span>
            <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-purple-500/20">
              <ArrowUpRight size={14} className="text-slate-500 group-hover:text-purple-400" />
            </div>
          </div>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">SKU / Codice</th>
                <th className="p-5">Descrizione</th>
                <th className="p-5">Categoria</th>
                <th className="p-5">Giacenza</th>
                <th className="p-5">Impegnata</th>
                <th className="p-5">Stato</th>
                <th className="p-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {stock.map((item) => (
                <tr key={item.sku} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-mono text-slate-400 font-bold">{item.sku}</td>
                  <td className="p-5 font-bold text-white">{item.name}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-5 font-mono text-purple-400 font-bold">{item.quantity} {item.unit}</td>
                  <td className="p-5 font-mono text-rose-400/80 font-bold">{item.committed || 0} {item.unit}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      item.status === 'Ottimo' ? 'bg-emerald-500/10 text-emerald-400' :
                      item.status === 'In Esaurimento' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(item)}
                        title="Modifica"
                        className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.sku)}
                        title="Elimina"
                        className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <StockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
      />
      <StockInModal
        isOpen={isStockInModalOpen}
        onClose={() => setIsStockInModalOpen(false)}
      />
    </motion.div>
  );
}

// --- CATALOGHI ---
export function CataloghiView() {
  const { stock } = useStore();
  const prodotti = stock.filter(item => item.category === 'Prodotti Finiti');

  const handleExport = () => {
    exportCatalogToPDF(prodotti);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Catalogo Prodotti</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Pronto per l'esportazione ai clienti.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="px-6 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 rounded-xl text-slate-300 font-bold text-sm transition-colors flex items-center gap-2"
          >
            <Download size={20} /> Esporta PDF
          </button>
          <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95">
            <Plus size={20} /> Nuovo Prodotto
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {prodotti.map((prod) => (
          <motion.div
            key={prod.sku}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-purple-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative glass-card overflow-hidden h-full flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={prod.imageUrl || 'https://picsum.photos/seed/placeholder/400/400'}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {prod.sku}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-xl text-white tracking-tight">{prod.name}</h3>
                <p className="text-sm text-slate-400 font-medium mt-1 line-clamp-2">Fragranza esclusiva ESSENZA Laboratori.</p>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <p className="text-2xl font-black text-purple-400">€ {prod.price.toFixed(2)}</p>
                  <button className="p-3 bg-white/5 hover:bg-purple-500 text-slate-400 hover:text-white rounded-xl transition-all">
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- FORNITORI ---
export function FornitoriView() {
  const store = useStore();
  const suppliers = store.suppliers || [];
  const deleteSupplier = store.deleteSupplier;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>(undefined);

  const handleEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSupplier(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo fornitore?')) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Gestione Fornitori</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Anagrafica partner e fornitori qualificati.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} /> Aggiungi Fornitore
        </button>
      </header>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">Ragione Sociale</th>
                <th className="p-5">Categoria</th>
                <th className="p-5">Contatto</th>
                <th className="p-5">Email</th>
                <th className="p-5">Valutazione</th>
                <th className="p-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {suppliers.map((fornitore) => (
                <tr key={fornitore.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-bold text-white">{fornitore.name}</td>
                  <td className="p-5">
                    <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {fornitore.category}
                    </span>
                  </td>
                  <td className="p-5 text-slate-300 font-medium">{fornitore.contact}</td>
                  <td className="p-5 text-slate-400 font-mono">{fornitore.email}</td>
                  <td className="p-5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < fornitore.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"} />
                      ))}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(fornitore)}
                        title="Modifica"
                        className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(fornitore.id)}
                        title="Elimina"
                        className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
      />
    </div>
  );
}

// --- CLIENTI ---
export function ClientiView() {
  const store = useStore();
  const customers = store.customers || [];
  const deleteCustomer = store.deleteCustomer;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);

  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo cliente?')) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Anagrafica Clienti</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Gestione database clienti e partner commerciali.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} /> Nuovo Cliente
        </button>
      </header>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">Nome / Ragione Sociale</th>
                <th className="p-5">Tipo</th>
                <th className="p-5">Contatti</th>
                <th className="p-5">Indirizzo</th>
                <th className="p-5">Ordini</th>
                <th className="p-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {customers.map((cliente) => (
                <tr key={cliente.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-bold text-white">{cliente.name}</td>
                  <td className="p-5">
                    <span className="bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {cliente.type}
                    </span>
                  </td>
                  <td className="p-5">
                    <p className="text-slate-300 font-medium">{cliente.email}</p>
                    <p className="text-slate-500 text-xs font-mono">{cliente.phone}</p>
                  </td>
                  <td className="p-5 text-slate-400">{cliente.address}</td>
                  <td className="p-5 font-bold text-purple-400">{cliente.totalOrders}</td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleEdit(cliente)}
                        title="Modifica"
                        className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id)}
                        title="Elimina"
                        className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
      />
    </div>
  );
}

// --- ORDINI ---
export function OrdiniView() {
  const store = useStore();
  const orders = store.orders || [];
  const deleteOrder = store.deleteOrder;
  const addDocument = store.addDocument;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docInitialData, setDocInitialData] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);

  const handleEdit = (o: Order) => {
    setEditingOrder(o);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingOrder(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questo ordine?')) {
      deleteOrder(id);
    }
  };

  const handleConvertToDoc = (order: Order, type: 'Fattura' | 'DDT') => {
    setDocInitialData({
        type,
        direction: 'Uscita',
        number: `${type === 'Fattura' ? 'FPA' : 'DDT'}-${order.id.split('-').pop()}`,
        date: new Date().toISOString().split('T')[0],
        recipient: order.customerName,
        status: type === 'Fattura' ? 'Emessa' : 'Spedito',
        items: order.items,
        amount: order.total,
        sourceOrderId: order.id
    });
    setIsDocModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Gestione Ordini</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Tracciamento vendite e spedizioni.</p>
        </div>
        <button
          onClick={handleAdd}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} /> Nuovo Ordine
        </button>
      </header>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">ID Ordine</th>
                <th className="p-5">Cliente</th>
                <th className="p-5">Data</th>
                <th className="p-5">Importo</th>
                <th className="p-5">Stato</th>
                <th className="p-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((ordine) => (
                <tr key={ordine.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-mono text-purple-400 font-bold">{ordine.id}</td>
                  <td className="p-5 font-bold text-white">{ordine.customerName}</td>
                  <td className="p-5 text-slate-400">{ordine.date}</td>
                  <td className="p-5 font-black text-white">€ {ordine.total.toLocaleString()}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      ordine.status === 'Consegnato' ? 'bg-emerald-500/10 text-emerald-400' :
                      ordine.status === 'Annullato' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {ordine.status}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => handleConvertToDoc(ordine, 'Fattura')}
                        title="Converti in Fattura"
                        className="p-2 bg-slate-800/80 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-all border border-white/5 hover:border-emerald-500/30"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(ordine)}
                        title="Modifica"
                        className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(ordine.id)}
                        title="Elimina"
                        className="p-2 bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-all border border-white/5 hover:border-rose-500/30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={editingOrder}
      />
      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        initialData={docInitialData}
      />
    </div>
  );
}

// --- DOCUMENTI ---
export function DocumentiView() {
  const { documents, deleteDocument, addDocument, addOrder } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AppDocument | undefined>(undefined);
  const [filter, setFilter] = useState('Tutti');

  const filteredDocs = documents.filter(doc => filter === 'Tutti' || doc.type === filter);

  const handleEdit = (doc: AppDocument) => {
    setEditingDoc(doc);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDoc(undefined);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Sei sicuro di voler eliminare questo documento? Le giacenze non verranno ripristinate automaticamente.')) {
        deleteDocument(id);
    }
  };

  const handleConvert = (doc: AppDocument, targetType: 'Fattura' | 'Order') => {
    if (targetType === 'Fattura') {
        const newDoc = {
            ...doc,
            id: Date.now(),
            type: 'Fattura' as any,
            number: `FPA-${doc.number.split('-').pop()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Emessa'
        };
        addDocument(newDoc);
    } else if (targetType === 'Order') {
        const newOrder: Order = {
            id: `ORD-${Date.now().toString().slice(-4)}`,
            customerId: 0, // Should be linked properly
            customerName: doc.recipient,
            date: new Date().toISOString().split('T')[0],
            status: 'Nuovo',
            items: doc.items,
            total: doc.amount
        };
        addOrder(newOrder);
        // Update quote status to "In Ordine"
        updateDocument(doc.id, { status: 'In Ordine' });
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Documentazione</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Archivio fatture, DDT e preventivi.</p>
        </div>
        <button
            onClick={handleAdd}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
        >
          <Plus size={20} /> Nuovo Documento
        </button>
      </header>

      <div className="flex gap-4 border-b border-white/5 mb-6">
        {['Tutti', 'Preventivo', 'DDT', 'Fattura'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-2 text-xs font-black uppercase tracking-widest transition-all ${filter === tab ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {tab === 'Preventivo' ? 'Preventivi' : tab === 'Fattura' ? 'Fatture' : tab}
          </button>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                <th className="p-5">Tipo</th>
                <th className="p-5">Numero</th>
                <th className="p-5">Data</th>
                <th className="p-5">Intestatario</th>
                <th className="p-5">Importo</th>
                <th className="p-5 text-right">Stato</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${doc.direction === 'Entrata' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                        <span className="font-bold text-white">{doc.type}</span>
                    </div>
                  </td>
                  <td className="p-5 font-mono text-slate-400">{doc.number}</td>
                  <td className="p-5 text-slate-400">{doc.date}</td>
                  <td className="p-5 font-medium text-slate-200">{doc.recipient}</td>
                  <td className="p-5 font-bold text-white">
                    {typeof doc.amount === 'number' ? `€ ${doc.amount.toLocaleString()}` : doc.amount}
                  </td>
                  <td className="p-5 text-right flex items-center justify-end gap-3">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      doc.status === 'Pagata' || doc.status === 'Consegnato' || doc.status === 'In Ordine' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {doc.status}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {doc.status !== 'In Ordine' && (
                            <>
                                {doc.type === 'Preventivo' && (
                                    <button onClick={() => handleConvert(doc, 'Order')} title="Converti in Ordine" className="p-2 bg-slate-800 hover:bg-purple-500/20 text-purple-400 rounded-lg"><ArrowRight size={14}/></button>
                                )}
                                {(doc.type === 'Preventivo' || doc.type === 'DDT') && (
                                    <button onClick={() => handleConvert(doc, 'Fattura')} title="Converti in Fattura" className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 rounded-lg"><FileText size={14}/></button>
                                )}
                                <button onClick={() => handleEdit(doc)} className="p-2 bg-slate-800 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14}/></button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 size={14}/></button>
                            </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={editingDoc}
      />
    </div>
  );
}
