import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- TYPES ---
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: 1 | 2 | 3;
}

export interface StockItem {
  sku: string;
  name: string;
  category: string;
  subcategory?: string;
  deepcategory?: string;
  quantity: number;
  committed: number;
  unit: string;
  minStock: number;
  price: number;
  status: 'Ottimo' | 'In Esaurimento' | 'Riordinare';
  imageUrl?: string;
}

export interface Batch {
  id: string;
  name: string;
  phase: 'Miscelazione' | 'Macerazione' | 'Filtraggio' | 'Confezionamento' | 'Completato';
  startDate: string;
  endDate: string;
  status: 'In Corso' | 'Completato' | 'In Ritardo';
}

export interface Supplier {
  id: number;
  name: string;
  category: string;
  contact: string;
  email: string;
  rating: number;
}

export interface Customer {
  id: number;
  name: string;
  type: 'Privato' | 'Azienda' | 'Hotel' | 'Boutique';
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  customerId: number;
  customerName: string;
  date: string;
  status: 'Nuovo' | 'In Lavorazione' | 'Spedito' | 'Consegnato' | 'Annullato' | 'Fatturato';
  items: { sku: string; name: string; quantity: number; price: number }[];
  total: number;
}

export interface Document {
  id: number;
  type: 'Preventivo' | 'DDT' | 'Fattura' | 'Carico Libero' | 'Fattura Fornitore' | 'DDT Fornitore';
  direction: 'Entrata' | 'Uscita';
  number: string;
  date: string;
  recipient: string;
  amount: number;
  status: string;
  items: { sku: string; name: string; quantity: number; price: number }[];
  sourceOrderId?: string;
}

interface AppData {
  stock: StockItem[];
  batches: Batch[];
  suppliers: Supplier[];
  documents: Document[];
  customers: Customer[];
  orders: Order[];
  categories: Category[];
}

interface StoreContextType extends AppData {
  // Stock
  addStockItem: (item: StockItem) => void;
  updateStockItem: (sku: string, updates: Partial<StockItem>) => void;
  deleteStockItem: (sku: string) => void;
  updateStockQuantity: (sku: string, qty: number) => void;

  // Batches
  addBatch: (batch: Batch) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // Suppliers
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: number, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: number) => void;

  // Customers
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;

  // Orders
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;

  // Documents
  addDocument: (doc: Document) => void;
  updateDocument: (id: number, updates: Partial<Document>) => void;
  deleteDocument: (id: number) => void;

  // Categories
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Global Actions
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  resetApp: (absolute?: boolean) => void;
  exportData: () => string;
  importData: (json: string) => void;
}

// --- INITIAL DATA ---
const initialData: AppData = {
  categories: [
    { id: 'cat-1', name: 'Materie Prime', level: 1 },
    { id: 'cat-2', name: 'Packaging', level: 1 },
    { id: 'cat-3', name: 'Prodotti Finiti', level: 1 },
    { id: 'cat-4', name: 'Campioni', level: 1 },
    { id: 'sub-1', name: 'Essenza', parentId: 'cat-1', level: 2 },
    { id: 'deep-1', name: 'Profumi', parentId: 'sub-1', level: 3 },
  ],
  stock: [
    { sku: 'MP-ALC-01', name: 'Alcol Etilico 96°', category: 'Materie Prime', quantity: 250, committed: 0, unit: 'L', minStock: 50, price: 5, status: 'Ottimo' },
    { sku: 'MP-ESS-VNL', name: 'Essenza Vaniglia Madagascar', category: 'Materie Prime', subcategory: 'Essenza', quantity: 2.5, committed: 0, unit: 'L', minStock: 5, price: 450, status: 'In Esaurimento' },
    { sku: 'PKG-BTL-50', name: 'Flacone Vetro 50ml', category: 'Packaging', quantity: 1200, committed: 0, unit: 'pz', minStock: 200, price: 0.8, status: 'Ottimo' },
    { sku: 'PF-OUD-100', name: 'Oud & Bergamot 100ml', category: 'Prodotti Finiti', subcategory: 'Essenza', deepcategory: 'Profumi', quantity: 45, committed: 10, unit: 'pz', minStock: 50, price: 120, status: 'Riordinare', imageUrl: 'https://picsum.photos/seed/perfume1/400/400' },
    { sku: 'PF-VNL-50', name: 'Vanilla Noir 50ml', category: 'Prodotti Finiti', quantity: 20, committed: 0, unit: 'pz', minStock: 10, price: 145, status: 'Ottimo', imageUrl: 'https://picsum.photos/seed/perfume2/400/400' },
    { sku: 'PF-CTR-100', name: 'Citrus Bloom 100ml', category: 'Prodotti Finiti', quantity: 80, committed: 40, unit: 'pz', minStock: 30, price: 85, status: 'Ottimo', imageUrl: 'https://picsum.photos/seed/perfume3/400/400' },
    { sku: 'PF-AMB-100', name: 'Amber Wood 100ml', category: 'Prodotti Finiti', quantity: 15, committed: 0, unit: 'pz', minStock: 20, price: 130, status: 'Riordinare', imageUrl: 'https://picsum.photos/seed/perfume4/400/400' },
  ],
  batches: [
    { id: 'LT-2023-10', name: 'Oud & Bergamot', phase: 'Macerazione', startDate: '2023-10-10', endDate: '2023-11-10', status: 'In Corso' },
    { id: 'LT-2023-11', name: 'Vanilla Noir', phase: 'Completato', startDate: '2023-09-15', endDate: '2023-10-15', status: 'Completato' },
    { id: 'LT-2023-12', name: 'Citrus Bloom', phase: 'Miscelazione', startDate: '2023-10-25', endDate: '2023-11-25', status: 'In Corso' },
  ],
  suppliers: [
    { id: 1, name: 'Aroma Chemicals SpA', category: 'Materie Prime', contact: 'Mario Rossi', email: 'ordini@aromachem.it', rating: 5 },
    { id: 2, name: 'Glass & Bottles Srl', category: 'Packaging', contact: 'Luigi Bianchi', email: 'sales@glassbottles.it', rating: 4 },
    { id: 3, name: 'Print Label Co.', category: 'Tipografia', contact: 'Anna Verdi', email: 'info@printlabel.com', rating: 5 },
  ],
  customers: [
    { id: 1, name: 'Profumeria Centrale', type: 'Boutique', email: 'info@profucentrale.it', phone: '06 1234567', address: 'Via del Corso 12, Roma', totalOrders: 12 },
    { id: 2, name: 'Hotel Excelsior', type: 'Hotel', email: 'procurement@excelsior.com', phone: '02 9876543', address: 'Piazza della Repubblica 4, Milano', totalOrders: 5 },
    { id: 3, name: 'Marco Bianchi', type: 'Privato', email: 'marco.b@gmail.com', phone: '333 1122334', address: 'Via Roma 5, Firenze', totalOrders: 2 },
  ],
  orders: [
    {
      id: 'ORD-2023-001',
      customerId: 1,
      customerName: 'Profumeria Centrale',
      date: '2023-10-26',
      status: 'In Lavorazione',
      items: [{ sku: 'PF-OUD-100', name: 'Oud & Bergamot 100ml', quantity: 10, price: 120 }],
      total: 1200
    },
    {
      id: 'ORD-2023-002',
      customerId: 2,
      customerName: 'Hotel Excelsior',
      date: '2023-10-24',
      status: 'Nuovo',
      items: [{ sku: 'PF-CTR-100', name: 'Citrus Bloom 100ml', quantity: 40, price: 85 }],
      total: 3400
    },
  ],
  documents: [
    { id: 1, type: 'Fattura', direction: 'Uscita', number: 'FPA-2023/45', date: '2023-10-26', recipient: 'Profumeria Centrale', amount: 1250, status: 'Pagata', items: [{ sku: 'PF-OUD-100', name: 'Oud & Bergamot 100ml', quantity: 10, price: 120 }] },
    { id: 2, type: 'DDT', direction: 'Uscita', number: 'DDT-2023/89', date: '2023-10-25', recipient: 'Boutique Roma', amount: 0, status: 'Consegnato', items: [] },
    { id: 3, type: 'Preventivo', direction: 'Uscita', number: 'PRV-2023/112', date: '2023-10-24', recipient: 'Hotel Excelsior', amount: 3400, status: 'In Attesa', items: [{ sku: 'PF-CTR-100', name: 'Citrus Bloom 100ml', quantity: 40, price: 85 }] },
  ],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [history, setHistory] = useState<AppData[]>([]);
  const [redoStack, setRedoStack] = useState<AppData[]>([]);

  // Deconstruct for easy access
  const { stock, batches, suppliers, customers, orders, documents, categories } = data;

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('essenza_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        setData(parsed);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('essenza_data', JSON.stringify(data));
  }, [data]);

  // UNDO / REDO logic
  const pushToHistory = (newData: AppData) => {
    setHistory(prev => [...prev, data]);
    setRedoStack([]);
    setData(newData);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, data]);
    setHistory(prev => prev.slice(0, -1));
    setData(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, data]);
    setRedoStack(prev => prev.slice(0, -1));
    setData(next);
  };

  const resetApp = (absolute = false) => {
    if (absolute) {
      pushToHistory({
        stock: [],
        batches: [],
        suppliers: [],
        customers: [],
        orders: [],
        documents: [],
        categories: []
      });
    } else {
      pushToHistory(initialData);
    }
  };

  // HELPER FOR STATUS
  const getStockStatus = (qty: number, minStock: number): StockItem['status'] => {
    if (qty <= 0) return 'Riordinare';
    if (qty < minStock) return 'In Esaurimento';
    return 'Ottimo';
  };

  // ACTIONS
  const addStockItem = (item: StockItem) => {
    pushToHistory({ ...data, stock: [...stock, { ...item, committed: item.committed || 0 }] });
  };

  const updateStockItem = (sku: string, updates: Partial<StockItem>) => {
    const newStock = stock.map(item => {
      if (item.sku === sku) {
        const newItem = { ...item, ...updates };
        newItem.status = getStockStatus(newItem.quantity, newItem.minStock);
        return newItem;
      }
      return item;
    });
    pushToHistory({ ...data, stock: newStock });
  };

  const deleteStockItem = (sku: string) => {
    pushToHistory({ ...data, stock: stock.filter(i => i.sku !== sku) });
  };

  const updateStockQuantity = (sku: string, qty: number) => {
    const newStock = stock.map(item => {
      if (item.sku === sku) {
        const newQty = item.quantity + qty;
        return { ...item, quantity: newQty, status: getStockStatus(newQty, item.minStock) };
      }
      return item;
    });
    pushToHistory({ ...data, stock: newStock });
  };

  const addBatch = (batch: Batch) => pushToHistory({ ...data, batches: [...batches, batch] });
  const updateBatch = (id: string, updates: Partial<Batch>) => {
    pushToHistory({ ...data, batches: batches.map(b => b.id === id ? { ...b, ...updates } : b) });
  };
  const deleteBatch = (id: string) => pushToHistory({ ...data, batches: batches.filter(b => b.id !== id) });

  const addSupplier = (s: Supplier) => pushToHistory({ ...data, suppliers: [...suppliers, { ...s, id: Date.now() }] });
  const updateSupplier = (id: number, updates: Partial<Supplier>) => {
    pushToHistory({ ...data, suppliers: suppliers.map(s => s.id === id ? { ...s, ...updates } : s) });
  };
  const deleteSupplier = (id: number) => pushToHistory({ ...data, suppliers: suppliers.filter(s => s.id !== id) });

  const addCustomer = (c: Customer) => pushToHistory({ ...data, customers: [...customers, { ...c, id: Date.now() }] });
  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    pushToHistory({ ...data, customers: customers.map(c => c.id === id ? { ...c, ...updates } : c) });
  };
  const deleteCustomer = (id: number) => pushToHistory({ ...data, customers: customers.filter(c => c.id !== id) });

  const addOrder = (o: Order) => {
    let newStock = [...stock];
    o.items.forEach(item => {
      newStock = newStock.map(s => s.sku === item.sku ? { ...s, committed: (s.committed || 0) + item.quantity } : s);
    });
    pushToHistory({ ...data, orders: [...orders, o], stock: newStock });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const oldOrder = orders.find(o => o.id === id);
    let newStock = [...stock];
    if (oldOrder && updates.status === 'Annullato' && oldOrder.status !== 'Annullato') {
      oldOrder.items.forEach(item => {
        newStock = newStock.map(s => s.sku === item.sku ? { ...s, committed: Math.max(0, (s.committed || 0) - item.quantity) } : s);
      });
    }
    pushToHistory({ ...data, orders: orders.map(o => o.id === id ? { ...o, ...updates } : o), stock: newStock });
  };

  const deleteOrder = (id: string) => pushToHistory({ ...data, orders: orders.filter(o => o.id !== id) });

  const addDocument = (d: Document) => {
    const doc = { ...d, id: Date.now() };
    let newStock = [...stock];
    let newOrders = [...orders];

    if (doc.direction === 'Entrata') {
      doc.items.forEach(item => {
        newStock = newStock.map(s => s.sku === item.sku ? { ...s, quantity: s.quantity + item.quantity, status: getStockStatus(s.quantity + item.quantity, s.minStock) } : s);
      });
    } else if (doc.direction === 'Uscita') {
      if (doc.type === 'Fattura' || doc.type === 'DDT') {
        doc.items.forEach(item => {
          newStock = newStock.map(s => {
            if (s.sku === item.sku) {
                const nq = s.quantity - item.quantity;
                let nc = s.committed;
                if (doc.sourceOrderId) nc = Math.max(0, (s.committed || 0) - item.quantity);
                return { ...s, quantity: nq, committed: nc, status: getStockStatus(nq, s.minStock) };
            }
            return s;
          });
        });

        if (doc.sourceOrderId) {
          newOrders = newOrders.map(o => o.id === doc.sourceOrderId ? { ...o, status: doc.type === 'DDT' ? 'Spedito' : 'Fatturato' } : o);
        }
      }
    }
    pushToHistory({ ...data, documents: [...documents, doc], stock: newStock, orders: newOrders });
  };

  const updateDocument = (id: number, updates: Partial<Document>) => {
    pushToHistory({ ...data, documents: documents.map(d => d.id === id ? { ...d, ...updates } : d) });
  };

  const deleteDocument = (id: number) => pushToHistory({ ...data, documents: documents.filter(d => d.id !== id) });

  const addCategory = (cat: Category) => pushToHistory({ ...data, categories: [...categories, { ...cat, id: `cat-${Date.now()}` }] });
  const updateCategory = (id: string, updates: Partial<Category>) => {
    pushToHistory({ ...data, categories: categories.map(c => c.id === id ? { ...c, ...updates } : c) });
  };
  const deleteCategory = (id: string) => {
    // Also delete children? Let's assume yes for cleanliness
    const toDelete = new Set([id]);
    let prevSize = 0;
    while (toDelete.size > prevSize) {
        prevSize = toDelete.size;
        categories.forEach(c => {
            if (c.parentId && toDelete.has(c.parentId)) toDelete.add(c.id);
        });
    }
    pushToHistory({ ...data, categories: categories.filter(c => !toDelete.has(c.id)) });
  };

  const exportData = () => JSON.stringify(data, null, 2);

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json) as AppData;
      pushToHistory(parsed);
    } catch (e) {
      alert('Errore nell\'importazione dei dati: JSON non valido.');
    }
  };

  return (
    <StoreContext.Provider value={{
      ...data,
      addStockItem, updateStockItem, deleteStockItem, updateStockQuantity,
      addBatch, updateBatch, deleteBatch,
      addSupplier, updateSupplier, deleteSupplier,
      addCustomer, updateCustomer, deleteCustomer,
      addOrder, updateOrder, deleteOrder,
      addDocument, updateDocument, deleteDocument,
      addCategory, updateCategory, deleteCategory,
      undo, redo, canUndo: history.length > 0, canRedo: redoStack.length > 0,
      resetApp, exportData, importData
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
