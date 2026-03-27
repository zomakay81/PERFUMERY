import React from 'react';
import { motion } from 'motion/react';
import { Activity, AlertTriangle, CheckCircle2, Clock, PackageSearch, TrendingUp, Plus, Search, Filter, Download, FileText, Package } from 'lucide-react';

// --- DASHBOARD ---
export function DashboardView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Panoramica</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Lotti in Macerazione</h3>
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Activity size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">12</p>
          <p className="text-sm text-emerald-600 flex items-center gap-1 mt-2">
            <TrendingUp size={16} /> +2 rispetto a ieri
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Allarmi Scorte</h3>
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">5</p>
          <p className="text-sm text-amber-600 flex items-center gap-1 mt-2">
            Materie prime sotto scorta minima
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 font-medium">Ordini da Evadere</h3>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><PackageSearch size={20} /></div>
          </div>
          <p className="text-3xl font-bold text-slate-800">28</p>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-2">
            <Clock size={16} /> 4 in ritardo
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Attività Recenti</h3>
        <div className="space-y-4">
          {[
            { id: 1, action: 'Completata macerazione Lotto #LT-2023-08', time: '2 ore fa', icon: CheckCircle2, color: 'text-emerald-500' },
            { id: 2, action: 'Creato Preventivo #PRV-092 per Cliente "Boutique Roma"', time: '4 ore fa', icon: FileText, color: 'text-blue-500' },
            { id: 3, action: 'Ingresso merci: 50L Alcol Etilico', time: 'Ieri', icon: Package, color: 'text-purple-500' },
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <item.icon className={item.color} size={20} />
              <div className="flex-1">
                <p className="text-slate-800 font-medium">{item.action}</p>
                <p className="text-sm text-slate-500">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// --- PRODUZIONE ---
export function ProduzioneView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Produzione & Lotti</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Nuovo Lotto
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="text" placeholder="Cerca lotto o fragranza..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">ID Lotto</th>
                <th className="p-4 font-medium">Fragranza</th>
                <th className="p-4 font-medium">Fase Attuale</th>
                <th className="p-4 font-medium">Data Inizio</th>
                <th className="p-4 font-medium">Scadenza Prevista</th>
                <th className="p-4 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 'LT-2023-10', name: 'Oud & Bergamot', phase: 'Macerazione', start: '10/10/2023', end: '10/11/2023', status: 'In Corso', statusColor: 'bg-blue-100 text-blue-700' },
                { id: 'LT-2023-11', name: 'Vanilla Noir', phase: 'Filtraggio', start: '15/09/2023', end: '15/10/2023', status: 'Completato', statusColor: 'bg-emerald-100 text-emerald-700' },
                { id: 'LT-2023-12', name: 'Citrus Bloom', phase: 'Miscelazione', start: '25/10/2023', end: '25/11/2023', status: 'In Corso', statusColor: 'bg-blue-100 text-blue-700' },
              ].map((lotto) => (
                <tr key={lotto.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{lotto.id}</td>
                  <td className="p-4 text-slate-600">{lotto.name}</td>
                  <td className="p-4 text-slate-600">{lotto.phase}</td>
                  <td className="p-4 text-slate-600">{lotto.start}</td>
                  <td className="p-4 text-slate-600">{lotto.end}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${lotto.statusColor}`}>
                      {lotto.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// --- MAGAZZINO ---
export function MagazzinoView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Magazzino & Giacenze</h2>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={20} /> Esporta
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} /> Carico/Scarico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['Materie Prime', 'Packaging', 'Prodotti Finiti', 'Campioni'].map((cat) => (
          <div key={cat} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-colors">
            <span className="font-medium text-slate-700">{cat}</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">Vedi</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">SKU / Codice</th>
                <th className="p-4 font-medium">Descrizione</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Giacenza</th>
                <th className="p-4 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { sku: 'MP-ALC-01', name: 'Alcol Etilico 96°', cat: 'Materie Prime', qty: '250 L', status: 'Ottimo', color: 'text-emerald-600' },
                { sku: 'MP-ESS-VNL', name: 'Essenza Vaniglia Madagascar', cat: 'Materie Prime', qty: '2.5 L', status: 'In Esaurimento', color: 'text-amber-600' },
                { sku: 'PKG-BTL-50', name: 'Flacone Vetro 50ml', cat: 'Packaging', qty: '1200 pz', status: 'Ottimo', color: 'text-emerald-600' },
                { sku: 'PF-OUD-100', name: 'Oud & Bergamot 100ml', cat: 'Prodotti Finiti', qty: '45 pz', status: 'Riordinare', color: 'text-red-600' },
              ].map((item) => (
                <tr key={item.sku} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{item.sku}</td>
                  <td className="p-4 text-slate-600">{item.name}</td>
                  <td className="p-4 text-slate-600">{item.cat}</td>
                  <td className="p-4 font-mono text-slate-700">{item.qty}</td>
                  <td className={`p-4 font-medium ${item.color}`}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// --- CATALOGHI ---
export function CataloghiView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Cataloghi Fotografici</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Nuovo Prodotto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { id: 1, name: 'Oud & Bergamot', desc: 'Eau de Parfum - 100ml', price: '€ 120,00', img: 'https://picsum.photos/seed/perfume1/400/400' },
          { id: 2, name: 'Vanilla Noir', desc: 'Extrait de Parfum - 50ml', price: '€ 145,00', img: 'https://picsum.photos/seed/perfume2/400/400' },
          { id: 3, name: 'Citrus Bloom', desc: 'Eau de Toilette - 100ml', price: '€ 85,00', img: 'https://picsum.photos/seed/perfume3/400/400' },
          { id: 4, name: 'Amber Wood', desc: 'Eau de Parfum - 100ml', price: '€ 130,00', img: 'https://picsum.photos/seed/perfume4/400/400' },
        ].map((prod) => (
          <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm">Modifica</button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800">{prod.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{prod.desc}</p>
              <p className="text-purple-600 font-bold mt-3">{prod.price}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// --- FORNITORI ---
export function FornitoriView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestione Fornitori</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Aggiungi Fornitore
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Ragione Sociale</th>
                <th className="p-4 font-medium">Categoria</th>
                <th className="p-4 font-medium">Contatto</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Valutazione</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 1, name: 'Aroma Chemicals SpA', cat: 'Materie Prime', contact: 'Mario Rossi', email: 'ordini@aromachem.it', rating: '⭐⭐⭐⭐⭐' },
                { id: 2, name: 'Glass & Bottles Srl', cat: 'Packaging', contact: 'Luigi Bianchi', email: 'sales@glassbottles.it', rating: '⭐⭐⭐⭐' },
                { id: 3, name: 'Print Label Co.', cat: 'Tipografia', contact: 'Anna Verdi', email: 'info@printlabel.com', rating: '⭐⭐⭐⭐⭐' },
              ].map((fornitore) => (
                <tr key={fornitore.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{fornitore.name}</td>
                  <td className="p-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded text-xs">{fornitore.cat}</span>
                  </td>
                  <td className="p-4 text-slate-600">{fornitore.contact}</td>
                  <td className="p-4 text-slate-600">{fornitore.email}</td>
                  <td className="p-4 text-slate-600">{fornitore.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

// --- DOCUMENTI ---
export function DocumentiView() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Documenti (Preventivi, DDT, Fatture)</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} /> Nuovo Documento
        </button>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        {['Tutti', 'Preventivi', 'DDT', 'Fatture'].map((tab, i) => (
          <button key={tab} className={`pb-3 px-2 text-sm font-medium transition-colors ${i === 0 ? 'border-b-2 border-purple-600 text-purple-600' : 'text-slate-500 hover:text-slate-800'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-100">
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Numero</th>
                <th className="p-4 font-medium">Data</th>
                <th className="p-4 font-medium">Intestatario</th>
                <th className="p-4 font-medium">Importo</th>
                <th className="p-4 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { id: 1, type: 'Fattura', num: 'FPA-2023/45', date: '26/10/2023', client: 'Profumeria Centrale', amount: '€ 1.250,00', status: 'Pagata', color: 'bg-emerald-100 text-emerald-700' },
                { id: 2, type: 'DDT', num: 'DDT-2023/89', date: '25/10/2023', client: 'Boutique Roma', amount: '-', status: 'Consegnato', color: 'bg-blue-100 text-blue-700' },
                { id: 3, type: 'Preventivo', num: 'PRV-2023/112', date: '24/10/2023', client: 'Hotel Excelsior', amount: '€ 3.400,00', status: 'In Attesa', color: 'bg-amber-100 text-amber-700' },
              ].map((doc) => (
                <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{doc.type}</td>
                  <td className="p-4 text-slate-600">{doc.num}</td>
                  <td className="p-4 text-slate-600">{doc.date}</td>
                  <td className="p-4 text-slate-600">{doc.client}</td>
                  <td className="p-4 font-medium text-slate-800">{doc.amount}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${doc.color}`}>
                      {doc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
