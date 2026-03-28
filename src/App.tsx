import { useState } from 'react';
import { Menu, X, LayoutDashboard, FlaskConical, Package, BookImage, Users, FileText, Sparkles, ShoppingCart, Truck, Settings, History, Wallet } from 'lucide-react';
import { DashboardView, ProduzioneView, MagazzinoView, CataloghiView, FornitoriView, DocumentiView, ClientiView, OrdiniView, ImpostazioniView, MovimentiView, FinancialsView } from './components/views';
import { StoreProvider } from './store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { AIChat } from './components/ai/AIChat';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produzione', label: 'Produzione', icon: FlaskConical },
    { id: 'magazzino', label: 'Magazzino', icon: Package },
    { id: 'cataloghi', label: 'Cataloghi', icon: BookImage },
    { id: 'clienti', label: 'Clienti', icon: Users },
    { id: 'ordini', label: 'Ordini', icon: ShoppingCart },
    { id: 'fornitori', label: 'Fornitori', icon: Truck },
    { id: 'documenti', label: 'Documenti', icon: FileText },
    { id: 'movimenti', label: 'Movimenti', icon: History },
    { id: 'finanze', label: 'Finanze', icon: Wallet },
    { id: 'impostazioni', label: 'Impostazioni', icon: Settings },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView onNavigate={(view) => setCurrentView(view)} />;
      case 'produzione': return <ProduzioneView />;
      case 'magazzino': return <MagazzinoView />;
      case 'cataloghi': return <CataloghiView />;
      case 'clienti': return <ClientiView />;
      case 'ordini': return <OrdiniView />;
      case 'fornitori': return <FornitoriView />;
      case 'documenti': return <DocumentiView />;
      case 'movimenti': return <MovimentiView />;
      case 'finanze': return <FinancialsView />;
      case 'impostazioni': return <ImpostazioniView />;
      default: return <DashboardView />;
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex flex-col w-72 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5">
          <div className="p-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl shadow-lg shadow-purple-500/20">
                <FlaskConical className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                  ESSENZA
                </h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Lab Management Pro</p>
              </div>
            </motion.div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative ${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                      : 'hover:bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav"
                      className="absolute left-2 w-1 h-6 bg-purple-500 rounded-full"
                    />
                  )}
                  <Icon size={20} className={isActive ? 'text-purple-400' : 'group-hover:scale-110 transition-transform'} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>

          <div className="p-6 mt-auto">
             <div className="p-4 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Assistant</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  L'AI è pronta ad analizzare i tuoi dati di produzione.
                </p>
             </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 glass z-50 flex items-center justify-between p-4">
          <h1 className="text-xl font-bold flex items-center gap-2 text-white">
            <FlaskConical className="text-purple-400" size={24} />
            ESSENZA
          </h1>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="md:hidden fixed inset-0 bg-slate-950 z-40 p-6 pt-24"
            >
              <nav className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                        isActive ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      <Icon size={24} />
                      <span className="font-bold text-lg">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden pt-[72px] md:pt-0 relative">
          {/* Background Blobs */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
          
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
          <AIChat />
        </main>
      </div>
    </StoreProvider>
  );
}
