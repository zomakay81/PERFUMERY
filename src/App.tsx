import { useState } from 'react';
import { Menu, X, LayoutDashboard, FlaskConical, Package, BookImage, Users, FileText } from 'lucide-react';
import { DashboardView, ProduzioneView, MagazzinoView, CataloghiView, FornitoriView, DocumentiView } from './components/views';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'produzione', label: 'Produzione', icon: FlaskConical },
    { id: 'magazzino', label: 'Magazzino', icon: Package },
    { id: 'cataloghi', label: 'Cataloghi', icon: BookImage },
    { id: 'fornitori', label: 'Fornitori', icon: Users },
    { id: 'documenti', label: 'Documenti', icon: FileText },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'produzione': return <ProduzioneView />;
      case 'magazzino': return <MagazzinoView />;
      case 'cataloghi': return <CataloghiView />;
      case 'fornitori': return <FornitoriView />;
      case 'documenti': return <DocumentiView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
            <FlaskConical className="text-purple-400" />
            ESSENZA
          </h1>
          <p className="text-xs text-slate-500 mt-1">ERP Profumeria</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-slate-900 text-white z-50 flex items-center justify-between p-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FlaskConical className="text-purple-400" size={24} />
          ESSENZA
        </h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-slate-900 z-40 p-4">
          <nav className="space-y-2">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-[60px] md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
