import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity, AlertTriangle, CheckCircle2, Clock, PackageSearch,
  TrendingUp, Plus, Search, Filter, Download, FileText, Package,
  ArrowUpRight, ArrowRight, Beaker, ShoppingBag, Truck, FlaskConical, Edit2, Trash2, Star,
  ChevronRight, Settings, Undo2, Redo2, Layers, Copy, Wallet, CreditCard, History, Calendar
} from 'lucide-react';
import { useStore, Supplier, Customer, Order, Batch, StockItem, Document as AppDocument, Category, Transaction } from '../store/useStore';
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

const FilterBar = ({ value, onChange, placeholder = "Cerca...", filters, currentFilter, onFilterChange }: any) => (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
                type="text" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            />
        </div>
        {filters && (
            <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                {filters.map((f: string) => (
                    <button
                        key={f} onClick={() => onFilterChange(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${currentFilter === f ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800/50 text-slate-500 hover:text-slate-300'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        )}
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
  const { stock, deleteStockItem, categories } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tutti');

  const categoriesList = ['Tutti', ...categories.filter(c => c.level === 1).map(c => c.name)];

  const filteredStock = stock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Tutti' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

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

      <FilterBar
        value={search} onChange={setSearch}
        filters={categoriesList} currentFilter={filter} onFilterChange={setFilter}
        placeholder="Cerca per nome o SKU..."
      />

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
              {filteredStock.map((item) => (
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
  const { stock, categories } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Prodotti Finiti');

  const categoriesList = categories.filter(c => c.level === 1).map(c => c.name);

  const prodotti = stock.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    exportCatalogToPDF(prodotti);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
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

      <FilterBar
        value={search} onChange={setSearch}
        filters={categoriesList} currentFilter={filter} onFilterChange={setFilter}
        placeholder="Cerca nel catalogo..."
      />

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
                  src={prod.images?.[0] || 'https://picsum.photos/seed/placeholder/400/400'}
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docInitialData, setDocInitialData] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<Order | undefined>(undefined);
  const [hoveredOrder, setHoveredOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tutti');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'Tutti' || o.status === filter;
    return matchesSearch && matchesFilter;
  });

  const groupedOrders = filteredOrders.reduce((acc: any, o) => {
    const month = o.date.slice(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = [];
    acc[month].push(o);
    return acc;
  }, {});

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

  const [showDuplicateOrderDialog, setShowDuplicateOrderDialog] = useState<Order | null>(null);

  const handleDuplicateOrder = (o: Order, mode: 'same' | 'new') => {
    const newOrder: Order = {
        ...o,
        id: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: mode === 'same' ? o.customerName : '',
        customerId: mode === 'same' ? o.customerId : 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Nuovo'
    };
    store.addOrder(newOrder);
    setEditingOrder(newOrder);
    setIsModalOpen(true);
    setShowDuplicateOrderDialog(null);
  };

  const handleConvertToDoc = (order: Order, type: 'Fattura' | 'DDT') => {
    if (order.status === 'Fatturato' || order.status === 'Spedito' || order.status === 'Consegnato') {
        alert(`Ordine già convertito o processato (Stato: ${order.status})`);
        return;
    }
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

      <FilterBar
        value={search} onChange={setSearch}
        filters={['Tutti', 'Nuovo', 'In Lavorazione', 'Spedito', 'Consegnato', 'Annullato']}
        currentFilter={filter} onFilterChange={setFilter}
        placeholder="Cerca cliente o ID ordine..."
      />

      <div className="space-y-8">
        {Object.entries(groupedOrders).sort((a:any, b:any) => b[0].localeCompare(a[0])).map(([month, monthOrders]: any) => (
          <div key={month} className="space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> {new Date(month).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </h3>
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
                    <tbody className="text-sm relative">
                    {monthOrders.map((ordine: any) => (
                        <tr
                            key={ordine.id}
                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                            onMouseEnter={() => setHoveredOrder(ordine)}
                            onMouseLeave={() => setHoveredOrder(null)}
                        >
                        <td className="p-5 font-mono text-purple-400 font-bold">{ordine.id}</td>
                        <td className="p-5 font-bold text-white">{ordine.customerName}</td>
                        <td className="p-5 text-slate-400">{ordine.date}</td>
                        <td className="p-5 font-black text-white">€ {ordine.total.toLocaleString()}</td>
                        <td className="p-5">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            ordine.status === 'Consegnato' || ordine.status === 'Fatturato' ? 'bg-emerald-500/10 text-emerald-400' :
                            ordine.status === 'Annullato' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                            {ordine.status}
                            </span>
                        </td>
                        <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      {ordine.status !== 'Fatturato' && ordine.status !== 'Consegnato' && ordine.status !== 'Annullato' && (
                        <>
                            <button
                                onClick={() => handleConvertToDoc(ordine, 'Fattura')}
                                title="Converti in Fattura"
                                className="p-2 bg-slate-800/80 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-all border border-white/5 hover:border-emerald-500/30"
                            >
                                <FileText size={16} />
                            </button>
                            {ordine.status !== 'Spedito' && (
                                <button
                                    onClick={() => handleConvertToDoc(ordine, 'DDT')}
                                    title="Converti in DDT"
                                    className="p-2 bg-slate-800/80 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 rounded-lg transition-all border border-white/5 hover:border-blue-500/30"
                                >
                                    <Package size={16} />
                                </button>
                            )}
                        </>
                      )}
                      <button
                        onClick={() => setShowDuplicateOrderDialog(ordine)}
                        title="Duplica"
                        className="p-2 bg-slate-800/80 hover:bg-purple-500/20 text-slate-400 hover:text-purple-400 rounded-lg transition-all border border-white/5 hover:border-purple-500/30"
                      >
                        <Copy size={16} />
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
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hoveredOrder && (
            <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                className="fixed bottom-20 left-[300px] w-80 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl p-6 z-[100] pointer-events-none"
            >
                <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShoppingBag size={14} /> Anteprima Prodotti {hoveredOrder.id}
                </h4>
                <div className="space-y-3">
                    {hoveredOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-xs font-bold text-white">{item.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{item.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-purple-400">x{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Totale Ordine</span>
                    <span className="text-sm font-black text-white">€ {hoveredOrder.total.toLocaleString()}</span>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
          {showDuplicateOrderDialog && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                      <Copy className="mx-auto text-purple-400 mb-4" size={40} />
                      <h3 className="text-xl font-black text-white mb-2">Duplica Ordine</h3>
                      <p className="text-slate-400 text-sm mb-8">Vuoi mantenere lo stesso cliente o assegnarne uno nuovo?</p>
                      <div className="grid gap-3">
                          <button onClick={() => handleDuplicateOrder(showDuplicateOrderDialog, 'same')} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all flex items-center justify-center gap-2">OK (Stesso Cliente)</button>
                          <button onClick={() => handleDuplicateOrder(showDuplicateOrderDialog, 'new')} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2">NUOVO CLIENTE</button>
                          <button onClick={() => setShowDuplicateOrderDialog(null)} className="w-full py-3 text-slate-500 font-bold hover:text-white transition-all">Annulla</button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

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

// --- CATEGORIZZAZIONE ---
function CategorizzazioneSection() {
    const { categories, addCategory, updateCategory, deleteCategory } = useStore();
    const [newCatName, setNewCatName] = useState('');
    const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined);
    const [level, setLevel] = useState<1 | 2 | 3>(1);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleUpdate = (id: string) => {
      if (!editValue) return;
      updateCategory(id, { name: editValue });
      setEditingId(null);
    };

    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCatName) return;
      addCategory({ id: '', name: newCatName, parentId: selectedParentId, level });
      setNewCatName('');
    };

    const level1 = categories.filter(c => c.level === 1);
    const getChildren = (parentId: string) => categories.filter(c => c.parentId === parentId);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold text-white mb-6">Aggiungi Categoria</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Livello</label>
                <select
                  value={level}
                  onChange={e => {
                      const l = Number(e.target.value) as 1|2|3;
                      setLevel(l);
                      setSelectedParentId(undefined);
                  }}
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm"
                >
                  <option value={1}>1. Categoria</option>
                  <option value={2}>2. Sottocategoria</option>
                  <option value={3}>3. Fondo</option>
                </select>
              </div>

              {level > 1 && (
                  <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Genitore (Livello {level - 1})</label>
                      <select
                          required
                          value={selectedParentId || ''}
                          onChange={e => setSelectedParentId(e.target.value)}
                          className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm"
                      >
                          <option value="">Seleziona...</option>
                          {categories.filter(c => c.level === level - 1).map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                      </select>
                  </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-1.5">Nome</label>
                <input
                  type="text" required value={newCatName} onChange={e => setNewCatName(e.target.value)}
                  placeholder="Es. Materie Prime..."
                  className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20">Aggiungi</button>
            </form>
          </div>

          <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-white mb-6">Struttura Attuale</h3>
              <div className="space-y-4">
                  {level1.map(c1 => (
                      <div key={c1.id} className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                              {editingId === c1.id ? (
                                  <input autoFocus className="bg-transparent border-b border-purple-500 outline-none text-white font-bold" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleUpdate(c1.id)} onKeyDown={e => e.key === 'Enter' && handleUpdate(c1.id)} />
                              ) : (
                                  <span className="font-bold text-white flex items-center gap-2" onDoubleClick={() => { setEditingId(c1.id); setEditValue(c1.name); }}><Layers size={16} className="text-purple-400" /> {c1.name}</span>
                              )}
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                  <button onClick={() => { setEditingId(c1.id); setEditValue(c1.name); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit2 size={14} /></button>
                                  <button onClick={() => deleteCategory(c1.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={14} /></button>
                              </div>
                          </div>
                          <div className="ml-8 space-y-2">
                              {getChildren(c1.id).map(c2 => (
                                  <div key={c2.id} className="space-y-2">
                                      <div className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/5 group">
                                          {editingId === c2.id ? (
                                              <input autoFocus className="bg-transparent border-b border-blue-500 outline-none text-white font-semibold" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleUpdate(c2.id)} onKeyDown={e => e.key === 'Enter' && handleUpdate(c2.id)} />
                                          ) : (
                                              <span className="text-sm font-semibold text-slate-300 flex items-center gap-2" onDoubleClick={() => { setEditingId(c2.id); setEditValue(c2.name); }}><ChevronRight size={14} className="text-blue-400" /> {c2.name}</span>
                                          )}
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                              <button onClick={() => { setEditingId(c2.id); setEditValue(c2.name); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit2 size={14} /></button>
                                              <button onClick={() => deleteCategory(c2.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={14} /></button>
                                          </div>
                                      </div>
                                      <div className="ml-8 space-y-2">
                                          {getChildren(c2.id).map(c3 => (
                                              <div key={c3.id} className="flex items-center justify-between p-2 bg-white/[0.01] rounded-lg border border-white/[0.02] group">
                                                  {editingId === c3.id ? (
                                                      <input autoFocus className="bg-transparent border-b border-emerald-500 outline-none text-slate-300 text-xs" value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={() => handleUpdate(c3.id)} onKeyDown={e => e.key === 'Enter' && handleUpdate(c3.id)} />
                                                  ) : (
                                                      <span className="text-xs text-slate-400 flex items-center gap-2" onDoubleClick={() => { setEditingId(c3.id); setEditValue(c3.name); }}><ChevronRight size={12} className="text-emerald-400" /> {c3.name}</span>
                                                  )}
                                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                      <button onClick={() => { setEditingId(c3.id); setEditValue(c3.name); }} className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg"><Edit2 size={12} /></button>
                                                      <button onClick={() => deleteCategory(c3.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 size={12} /></button>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </div>
    );
  }

// --- FINANCIALS (Incassi & Pagamenti) ---
export function FinancialsView() {
    const { transactions, addTransaction, deleteTransaction } = useStore();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Transaction>>({
        type: 'Entrata', date: new Date().toISOString().split('T')[0], method: 'Bonifico', category: 'Vendita'
    });

    const totalIncome = transactions.filter(t => t.type === 'Entrata').reduce((acc, t) => acc + t.amount, 0);
    const totalOutcome = transactions.filter(t => t.type === 'Uscita').reduce((acc, t) => acc + t.amount, 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addTransaction(formData as Transaction);
        setShowForm(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Finanze</h2>
                    <p className="text-slate-400 text-sm font-medium mt-1">Gestione flussi di cassa, incassi e pagamenti.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                    <Plus size={20} /> Nuova Operazione
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Totale Incassi" value={`€ ${totalIncome.toLocaleString()}`} icon={ArrowUpRight} color="text-emerald-400" />
                <StatCard title="Totale Pagamenti" value={`€ ${totalOutcome.toLocaleString()}`} icon={ArrowRight} color="text-rose-400" />
                <StatCard title="Bilancio Netto" value={`€ ${(totalIncome - totalOutcome).toLocaleString()}`} icon={Wallet} color="text-blue-400" />
            </div>

            <Card className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="p-5">Data</th>
                                <th className="p-5">Tipo</th>
                                <th className="p-5">Beneficiario/Cliente</th>
                                <th className="p-5">Categoria</th>
                                <th className="p-5">Metodo</th>
                                <th className="p-5">Importo</th>
                                <th className="p-5 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 text-slate-400 font-mono">{tx.date}</td>
                                    <td className="p-5">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${tx.type === 'Entrata' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {tx.type === 'Entrata' ? 'Incasso' : 'Pagamento'}
                                        </span>
                                    </td>
                                    <td className="p-5 font-bold text-white">{tx.recipient}</td>
                                    <td className="p-5 text-slate-400">{tx.category}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <CreditCard size={14} />
                                            {tx.method}
                                        </div>
                                    </td>
                                    <td className={`p-5 font-black ${tx.type === 'Entrata' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.type === 'Entrata' ? '+' : '-'} € {tx.amount.toLocaleString()}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button onClick={() => deleteTransaction(tx.id)} className="p-2 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-8">
                            <h3 className="text-xl font-black text-white mb-6">Nuova Transazione</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => setFormData({...formData, type: 'Entrata'})} className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'Entrata' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Incasso</button>
                                    <button type="button" onClick={() => setFormData({...formData, type: 'Uscita'})} className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'Uscita' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Pagamento</button>
                                </div>
                                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white" />
                                <input type="text" required placeholder="Beneficiario / Cliente" value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" required placeholder="Importo €" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white" />
                                    <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value as any})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white">
                                        <option value="Bonifico">Bonifico</option>
                                        <option value="Contanti">Contanti</option>
                                        <option value="Carta">Carta</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Categoria (es. Affitto, Vendita...)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-white" />
                                <button type="submit" className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl shadow-lg transition-all">Registra Operazione</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// --- MOVIMENTI (Archivio Carichi/Scarichi) ---
export function MovimentiView() {
    const { documents } = useStore();
    const movimenti = documents.filter(d => ['Carico Libero', 'Fattura Fornitore', 'DDT Fornitore', 'Fattura', 'DDT'].includes(d.type));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-white tracking-tight">Storico Movimenti</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">Archivio completo di tutti i carichi e scarichi di magazzino.</p>
            </header>

            <Card className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                <th className="p-5">Data</th>
                                <th className="p-5">Tipo</th>
                                <th className="p-5">Documento</th>
                                <th className="p-5">Dettagli Articoli</th>
                                <th className="p-5 text-right">Verso</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {movimenti.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((m) => (
                                <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="p-5 text-slate-400 font-mono">{m.date}</td>
                                    <td className="p-5 font-bold text-white">{m.type}</td>
                                    <td className="p-5 text-slate-300 font-mono">{m.number}</td>
                                    <td className="p-5">
                                        <div className="flex flex-wrap gap-1">
                                            {m.items.map((it, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-slate-400 border border-white/5">{it.sku} ({it.quantity})</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${m.direction === 'Entrata' ? 'text-emerald-400 bg-emerald-400/10' : 'text-blue-400 bg-blue-400/10'}`}>
                                            {m.direction}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
}

// --- IMPOSTAZIONI ---
export function ImpostazioniView() {
    const { resetApp, undo, redo, canUndo, canRedo } = useStore();
    const [activeTab, setActiveTab] = useState<'generali' | 'categorie'>('generali');

    const handleReset = (absolute: boolean) => {
        if (confirm(`Sei sicuro di voler resettare l'app? ${absolute ? 'TUTTI i dati verranno cancellati (vuoto assoluto).' : 'L\'app tornerà ai dati iniziali.'}`)) {
            resetApp(absolute);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <header>
                <h2 className="text-3xl font-black text-white tracking-tight">Impostazioni Sistema</h2>
                <div className="flex gap-6 mt-6 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('generali')}
                        className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'generali' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Generali & Backup
                    </button>
                    <button
                        onClick={() => setActiveTab('categorie')}
                        className={`pb-3 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'categorie' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Gerarchia Categorie
                    </button>
                </div>
            </header>

            {activeTab === 'generali' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Undo2 size={20} className="text-purple-400" /> Cronologia Azioni</h3>
                        <div className="flex gap-4">
                            <button
                                disabled={!canUndo} onClick={undo}
                                className={`flex-1 py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${canUndo ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'opacity-30 cursor-not-allowed border-white/5 text-slate-500'}`}
                            >
                                <Undo2 size={24} />
                                <span className="text-xs font-black uppercase">Annulla Ultima</span>
                            </button>
                            <button
                                disabled={!canRedo} onClick={redo}
                                className={`flex-1 py-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${canRedo ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'opacity-30 cursor-not-allowed border-white/5 text-slate-500'}`}
                            >
                                <Redo2 size={24} />
                                <span className="text-xs font-black uppercase">Ripristina</span>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-4 text-center font-bold uppercase tracking-widest italic">Vengono tracciate solo le macro operazioni (salvataggi, eliminazioni)</p>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-bold text-rose-400 mb-6 flex items-center gap-2"><AlertTriangle size={20} /> Zona Pericolo</h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleReset(false)}
                                className="w-full py-4 rounded-2xl bg-slate-800/50 border border-white/5 hover:bg-slate-700/50 text-slate-300 font-bold transition-all text-left px-6 flex justify-between items-center"
                            >
                                <span>Ripristina Dati Iniziali (Demo)</span>
                                <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => handleReset(true)}
                                className="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-500 font-bold transition-all text-left px-6 flex justify-between items-center"
                            >
                                <span>RESET TOTALE (Vuoto Assoluto)</span>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </Card>
                </div>
            ) : (
                <Card>
                    <CategorizzazioneSection />
                </Card>
            )}
        </motion.div>
    );
}

// --- DOCUMENTI ---
export function DocumentiView() {
  const { documents, deleteDocument, addDocument, addOrder, updateDocument, convertQuoteToOrder, addTransaction } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<AppDocument | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tutti');

  const filteredDocs = documents.filter(doc => {
      const matchesSearch = doc.recipient.toLowerCase().includes(search.toLowerCase()) || doc.number.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'Tutti' || doc.type === filter;
      return matchesSearch && matchesFilter;
  });

  const groupedDocs = filteredDocs.reduce((acc: any, d) => {
      const month = d.date.slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(d);
      return acc;
  }, {});

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

  const [showDuplicateDocDialog, setShowDuplicateDocDialog] = useState<AppDocument | null>(null);

  const handleDuplicateDoc = (doc: AppDocument, mode: 'same' | 'new') => {
    const newDoc: AppDocument = {
        ...doc,
        id: Date.now(),
        number: `${doc.type.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
        recipient: mode === 'same' ? doc.recipient : '',
        paidAmount: 0,
        date: new Date().toISOString().split('T')[0],
        status: doc.type === 'Preventivo' ? 'In Attesa' : 'Bozza'
    };
    addDocument(newDoc);
    setEditingDoc(newDoc);
    setIsModalOpen(true);
    setShowDuplicateDocDialog(null);
  };

  const handleRecordPayment = (doc: AppDocument) => {
    const remaining = doc.amount - (doc.paidAmount || 0);
    const amountStr = prompt(`Registra incasso per ${doc.number} (Residuo: € ${remaining})`, remaining.toString());
    if (amountStr === null) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
        alert("Importo non valido");
        return;
    }

    const newPaid = (doc.paidAmount || 0) + amount;
    const isFullyPaid = newPaid >= doc.amount;

    updateDocument(doc.id, {
        paidAmount: newPaid,
        status: isFullyPaid ? (doc.type === 'Fattura' ? 'Pagata' : 'Confermato (Pagato)') : 'Pagamento Parziale'
    });

    addTransaction({
        id: '',
        type: 'Entrata',
        date: new Date().toISOString().split('T')[0],
        amount: amount,
        recipient: doc.recipient,
        category: `Incasso ${doc.type}`,
        method: 'Bonifico',
        referenceId: doc.id.toString(),
        notes: `Pagamento per ${doc.number}`
    });
  };

  const handleConvert = (doc: AppDocument, targetType: 'Fattura' | 'Order') => {
    if (doc.status === 'Convertito' || doc.status === 'In Ordine') {
        alert("Documento già convertito!");
        return;
    }
    if (targetType === 'Fattura') {
        const newDoc = {
            ...doc,
            id: Date.now(),
            type: 'Fattura' as any,
            number: `FPA-${doc.number.split('-').pop()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Emessa',
            notes: `Da ${doc.type} ${doc.number}`
        };
        addDocument(newDoc);
        updateDocument(doc.id, { status: 'Convertito' });
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

      <FilterBar
        value={search} onChange={setSearch}
        filters={['Tutti', 'Preventivo', 'DDT', 'Fattura']}
        currentFilter={filter} onFilterChange={setFilter}
        placeholder="Cerca numero documento o destinatario..."
      />

      <div className="space-y-8">
        {Object.entries(groupedDocs).sort((a:any, b:any) => b[0].localeCompare(a[0])).map(([month, monthDocs]: any) => (
          <div key={month} className="space-y-4">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> {new Date(month).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
            </h3>
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
                    {monthDocs.map((doc: any) => (
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
                        <td className="p-5">
                            <p className="font-bold text-white">{typeof doc.amount === 'number' ? `€ ${doc.amount.toLocaleString()}` : doc.amount}</p>
                            {doc.paidAmount > 0 && <p className="text-[10px] text-emerald-400 font-bold">Pagato: € {doc.paidAmount.toLocaleString()}</p>}
                        </td>
                        <td className="p-5 text-right flex items-center justify-end gap-3">
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      doc.status === 'Pagata' || doc.status === 'Consegnato' || doc.status === 'In Ordine' || doc.status === 'Convertito' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {doc.status}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {doc.status !== 'In Ordine' && doc.status !== 'Convertito' && (
                            <>
                                {doc.type === 'Preventivo' && (
                                    <button onClick={() => convertQuoteToOrder(doc)} title="Converti in Ordine" className="p-2 bg-slate-800 hover:bg-purple-500/20 text-purple-400 rounded-lg"><ArrowRight size={14}/></button>
                                )}
                                {(doc.type === 'Preventivo' || doc.type === 'DDT') && (
                                    <button onClick={() => handleConvert(doc, 'Fattura')} title="Converti in Fattura" className="p-2 bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 rounded-lg"><FileText size={14}/></button>
                                )}
                                {(doc.type === 'Preventivo' || doc.type === 'Fattura') && doc.status !== 'Convertito' && (
                                    <button
                                        type="button"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRecordPayment(doc); }}
                                        title="Registra Pagamento"
                                        className="relative p-2 bg-slate-800 hover:bg-amber-500/20 text-amber-400 rounded-lg z-20"
                                    >
                                        <Wallet size={14}/>
                                    </button>
                                )}
                                <button onClick={() => setShowDuplicateDocDialog(doc)} title="Duplica" className="p-2 bg-slate-800 hover:bg-purple-500/20 text-purple-400 rounded-lg"><Copy size={14}/></button>
                                <button onClick={() => handleEdit(doc)} className="p-2 bg-slate-800 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14}/></button>
                                <button onClick={() => handleDelete(doc.id)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-lg"><Trash2 size={14}/></button>
                            </>
                        )}
                        {(doc.status === 'In Ordine' || doc.status === 'Convertito') && (
                             <button onClick={() => setShowDuplicateDocDialog(doc)} title="Duplica" className="p-2 bg-slate-800 hover:bg-purple-500/20 text-purple-400 rounded-lg"><Copy size={14}/></button>
                        )}
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </Card>
          </div>
        ))}
      </div>
      <AnimatePresence>
          {showDuplicateDocDialog && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
                      <Copy className="mx-auto text-purple-400 mb-4" size={40} />
                      <h3 className="text-xl font-black text-white mb-2">Duplica {showDuplicateDocDialog.type}</h3>
                      <p className="text-slate-400 text-sm mb-8">Vuoi mantenere lo stesso destinatario o assegnarne uno nuovo?</p>
                      <div className="grid gap-3">
                          <button onClick={() => handleDuplicateDoc(showDuplicateDocDialog, 'same')} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all">OK (Stesso Destinatario)</button>
                          <button onClick={() => handleDuplicateDoc(showDuplicateDocDialog, 'new')} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all">NUOVO CLIENTE</button>
                          <button onClick={() => setShowDuplicateDocDialog(null)} className="w-full py-3 text-slate-500 font-bold hover:text-white transition-all">Annulla</button>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <DocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        document={editingDoc}
      />
    </div>
  );
}
