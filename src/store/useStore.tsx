import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- TYPES ---
export interface StockItem {
  sku: string;
  name: string;
  category: 'Materie Prime' | 'Packaging' | 'Prodotti Finiti' | 'Campioni';
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
  status: 'Nuovo' | 'In Lavorazione' | 'Spedito' | 'Consegnato' | 'Annullato';
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

  exportData: () => string;
  importData: (json: string) => void;
}

// --- INITIAL DATA ---
const initialData: AppData = {
  stock: [
    { sku: 'MP-ALC-01', name: 'Alcol Etilico 96°', category: 'Materie Prime', quantity: 250, committed: 0, unit: 'L', minStock: 50, price: 5, status: 'Ottimo' },
    { sku: 'MP-ESS-VNL', name: 'Essenza Vaniglia Madagascar', category: 'Materie Prime', quantity: 2.5, committed: 0, unit: 'L', minStock: 5, price: 450, status: 'In Esaurimento' },
    { sku: 'PKG-BTL-50', name: 'Flacone Vetro 50ml', category: 'Packaging', quantity: 1200, committed: 0, unit: 'pz', minStock: 200, price: 0.8, status: 'Ottimo' },
    { sku: 'PF-OUD-100', name: 'Oud & Bergamot 100ml', category: 'Prodotti Finiti', quantity: 45, committed: 10, unit: 'pz', minStock: 50, price: 120, status: 'Riordinare', imageUrl: 'https://picsum.photos/seed/perfume1/400/400' },
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
  const [stock, setStock] = useState<StockItem[]>(initialData.stock);
  const [batches, setBatches] = useState<Batch[]>(initialData.batches);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialData.suppliers);
  const [customers, setCustomers] = useState<Customer[]>(initialData.customers);
  const [orders, setOrders] = useState<Order[]>(initialData.orders);
  const [documents, setDocuments] = useState<Document[]>(initialData.documents);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('essenza_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AppData;
        if (parsed.stock) setStock(parsed.stock);
        if (parsed.batches) setBatches(parsed.batches);
        if (parsed.suppliers) setSuppliers(parsed.suppliers);
        if (parsed.customers) setCustomers(parsed.customers);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.documents) setDocuments(parsed.documents);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  useEffect(() => {
    const data: AppData = { stock, batches, suppliers, customers, orders, documents };
    localStorage.setItem('essenza_data', JSON.stringify(data));
  }, [stock, batches, suppliers, customers, orders, documents]);

  // HELPER FOR STATUS
  const getStockStatus = (qty: number, minStock: number): StockItem['status'] => {
    if (qty <= 0) return 'Riordinare';
    if (qty < minStock) return 'In Esaurimento';
    return 'Ottimo';
  };

  // ACTIONS
  const addStockItem = (item: StockItem) => setStock(prev => [...prev, { ...item, committed: item.committed || 0 }]);
  const updateStockItem = (sku: string, updates: Partial<StockItem>) => {
    setStock(prev => prev.map(item => {
      if (item.sku === sku) {
        const newItem = { ...item, ...updates };
        newItem.status = getStockStatus(newItem.quantity, newItem.minStock);
        return newItem;
      }
      return item;
    }));
  };
  const deleteStockItem = (sku: string) => setStock(prev => prev.filter(i => i.sku !== sku));
  const updateStockQuantity = (sku: string, qty: number) => {
    setStock(prev => prev.map(item => {
      if (item.sku === sku) {
        const newQty = item.quantity + qty;
        return { ...item, quantity: newQty, status: getStockStatus(newQty, item.minStock) };
      }
      return item;
    }));
  };

  const addBatch = (batch: Batch) => setBatches(prev => [...prev, batch]);
  const updateBatch = (id: string, updates: Partial<Batch>) => setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  const deleteBatch = (id: string) => setBatches(prev => prev.filter(b => b.id !== id));

  const addSupplier = (s: Supplier) => setSuppliers(prev => [...prev, { ...s, id: Date.now() }]);
  const updateSupplier = (id: number, updates: Partial<Supplier>) => setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSupplier = (id: number) => setSuppliers(prev => prev.filter(s => s.id !== id));

  const addCustomer = (c: Customer) => setCustomers(prev => [...prev, { ...c, id: Date.now() }]);
  const updateCustomer = (id: number, updates: Partial<Customer>) => setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteCustomer = (id: number) => setCustomers(prev => prev.filter(c => c.id !== id));

  const addOrder = (o: Order) => {
    setOrders(prev => [...prev, o]);
    // Commit stock
    o.items.forEach(item => {
      setStock(prev => prev.map(s => s.sku === item.sku ? { ...s, committed: (s.committed || 0) + item.quantity } : s));
    });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const oldOrder = orders.find(o => o.id === id);
    if (oldOrder && updates.status === 'Annullato' && oldOrder.status !== 'Annullato') {
      // Release committed stock
      oldOrder.items.forEach(item => {
        setStock(prev => prev.map(s => s.sku === item.sku ? { ...s, committed: Math.max(0, (s.committed || 0) - item.quantity) } : s));
      });
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };
  const deleteOrder = (id: string) => setOrders(prev => prev.filter(o => o.id !== id));

  const addDocument = (d: Document) => {
    const doc = { ...d, id: Date.now() };
    setDocuments(prev => [...prev, doc]);

    // Stock logic
    if (doc.direction === 'Entrata') {
      // Carico
      doc.items.forEach(item => {
        updateStockQuantity(item.sku, item.quantity);
      });
    } else if (doc.direction === 'Uscita') {
      // Scarico (only for Fattura and DDT)
      if (doc.type === 'Fattura' || doc.type === 'DDT') {
        doc.items.forEach(item => {
          updateStockQuantity(item.sku, -item.quantity);
          // If it came from an order, release committed
          if (doc.sourceOrderId) {
            setStock(prev => prev.map(s => s.sku === item.sku ? { ...s, committed: Math.max(0, (s.committed || 0) - item.quantity) } : s));
          }
        });

        // If it came from an order, mark order as completed/shipped
        if (doc.sourceOrderId) {
          updateOrder(doc.sourceOrderId, { status: doc.type === 'DDT' ? 'Spedito' : 'Consegnato' });
        }
      }
    }
  };
  const updateDocument = (id: number, updates: Partial<Document>) => setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  const deleteDocument = (id: number) => setDocuments(prev => prev.filter(d => d.id !== id));

  const exportData = () => JSON.stringify({ stock, batches, suppliers, customers, orders, documents }, null, 2);

  const importData = (json: string) => {
    try {
      const parsed = JSON.parse(json) as AppData;
      if (parsed.stock) setStock(parsed.stock);
      if (parsed.batches) setBatches(parsed.batches);
      if (parsed.suppliers) setSuppliers(parsed.suppliers);
      if (parsed.customers) setCustomers(parsed.customers);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.documents) setDocuments(parsed.documents);
    } catch (e) {
      alert('Errore nell\'importazione dei dati: JSON non valido.');
    }
  };

  return (
    <StoreContext.Provider value={{
      stock, batches, suppliers, customers, orders, documents,
      addStockItem, updateStockItem, deleteStockItem, updateStockQuantity,
      addBatch, updateBatch, deleteBatch,
      addSupplier, updateSupplier, deleteSupplier,
      addCustomer, updateCustomer, deleteCustomer,
      addOrder, updateOrder, deleteOrder,
      addDocument, updateDocument, deleteDocument,
      exportData, importData
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
