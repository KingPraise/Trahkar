import React from 'react';
import { 
  Plus, 
  Search, 
  Pill, 
  AlertTriangle,
  Clock, 
  PlusCircle, 
  FileText,
  X,
  HeartPulse,
  Heart,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DrugItem } from '../types';

interface InventoryViewProps {
  drugs: DrugItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddDrug: (drug: Partial<DrugItem>) => void;
  onRestockDrug: (id: string, newQty: number) => void;
}

type FilterChip = 'ALL' | 'LOW STOCK' | 'EXPIRING SOON' | 'OUT OF STOCK';

export default function InventoryView({
  drugs,
  searchQuery,
  setSearchQuery,
  onAddDrug,
  onRestockDrug
}: InventoryViewProps) {
  const [selectedFilter, setSelectedFilter] = React.useState<FilterChip>('ALL');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [restockItem, setRestockItem] = React.useState<DrugItem | null>(null);
  const [restockQty, setRestockQty] = React.useState('');

  // Form states for new drug
  const [newName, setNewName] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');
  const [newQty, setNewQty] = React.useState('');
  const [newPrice, setNewPrice] = React.useState('');
  const [newUnit, setNewUnit] = React.useState('tabs');
  const [newExpiry, setNewExpiry] = React.useState('Dec 2026');

  // Filter items
  const filteredDrugs = drugs.filter((drug) => {
    // 1. Search Query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      drug.name.toLowerCase().includes(query) || 
      drug.category.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // 2. Chip Filter
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'LOW STOCK') return drug.status === 'LOW STOCK';
    if (selectedFilter === 'EXPIRING SOON') return drug.status === 'EXPIRING SOON';
    if (selectedFilter === 'OUT OF STOCK') return drug.status === 'OUT OF STOCK';

    return true;
  });

  const handleCreateDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newQty || !newPrice) return;
    onAddDrug({
      name: newName,
      category: newCategory || 'General Medicine',
      quantity: Number(newQty),
      unitPrice: Number(newPrice),
      unitType: newUnit,
      expiryDate: newExpiry,
    });
    // Reset Form
    setNewName('');
    setNewCategory('');
    setNewQty('');
    setNewPrice('');
    setNewUnit('tabs');
    setNewExpiry('Dec 2026');
    setShowAddModal(false);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockItem || !restockQty) return;
    onRestockDrug(restockItem.id, Number(restockQty));
    setRestockItem(null);
    setRestockQty('');
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'IN STOCK':
        return 'bg-success/10 text-success border border-success/20';
      case 'LOW STOCK':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'EXPIRING SOON':
        return 'bg-warning/10 text-warning border border-warning/20';
      case 'OUT OF STOCK':
        return 'bg-danger/10 text-danger border border-danger/20';
      default:
        return 'bg-secondary/10 text-secondary border border-secondary/20';
    }
  };

  const getDrugIcon = (category: string, status: string) => {
    const isError = status === 'OUT OF STOCK';
    const isWarning = status === 'LOW STOCK' || status === 'EXPIRING SOON';
    
    let colorClass = 'text-primary bg-primary/10';
    if (isError) colorClass = 'text-danger bg-danger/10';
    else if (isWarning) colorClass = 'text-warning bg-warning/10';

    if (category.toLowerCase().includes('antibiotic')) {
      return (
        <div className={`p-2.5 rounded-lg ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
          <Pill className="w-5 h-5" />
        </div>
      );
    }
    if (category.toLowerCase().includes('immune') || category.toLowerCase().includes('vital')) {
      return (
        <div className={`p-2.5 rounded-lg ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
          <Heart className="w-5 h-5" />
        </div>
      );
    }
    if (status === 'OUT OF STOCK') {
      return (
        <div className={`p-2.5 rounded-lg ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
          <AlertCircle className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className={`p-2.5 rounded-lg ${colorClass} group-hover:scale-110 transition-transform duration-200`}>
        <ShieldCheck className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      
      {/* Mobile Search block */}
      <div className="md:hidden relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <Search className="w-5 h-5" />
        </span>
        <input 
          type="text" 
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-border rounded-xl text-body-md shadow-sm outline-none focus:ring-2 focus:ring-primary/25"
        />
      </div>

      {/* Filter Chips row */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {(['ALL', 'LOW STOCK', 'EXPIRING SOON', 'OUT OF STOCK'] as FilterChip[]).map((chip) => {
          const count = drugs.filter((d) => {
            if (chip === 'ALL') return true;
            return d.status === chip;
          }).length;

          const isActive = selectedFilter === chip;
          let activeStyles = 'bg-primary text-on-primary shadow-md font-bold';
          let inactiveStyles = 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest';
          
          if (!isActive && chip === 'LOW STOCK') inactiveStyles = 'bg-surface-container-high text-on-surface-variant hover:bg-warning/10 hover:text-warning hover:border-warning/20 border border-transparent';
          if (!isActive && chip === 'EXPIRING SOON') inactiveStyles = 'bg-surface-container-high text-on-surface-variant hover:bg-warning/10 hover:text-warning hover:border-warning/20 border border-transparent';
          if (!isActive && chip === 'OUT OF STOCK') inactiveStyles = 'bg-surface-container-high text-on-surface-variant hover:bg-danger/10 hover:text-danger hover:border-danger/20 border border-transparent';

          return (
            <button
              key={chip}
              onClick={() => setSelectedFilter(chip)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive ? activeStyles : inactiveStyles
              }`}
            >
              <span>{chip}</span>
              <span className={`px-1.5 py-px text-[10px] rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-secondary'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Bento Grid - Inventory List */}
      {filteredDrugs.length === 0 ? (
        <div className="bg-surface-container-lowest p-12 border border-border rounded-2xl shadow-sm text-center">
          <p className="text-secondary mb-3">No inventory items match current filter query.</p>
          <button 
            onClick={() => { setSelectedFilter('ALL'); setSearchQuery(''); }}
            className="text-primary hover:underline text-sm font-bold"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrugs.map((drug) => (
            <div 
              key={drug.id}
              onClick={() => {
                setRestockItem(drug);
                setRestockQty(String(drug.quantity));
              }}
              className={`bg-surface-container-lowest border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${
                drug.status === 'OUT OF STOCK'
                  ? 'border-danger/25 hover:border-danger'
                  : drug.status === 'LOW STOCK' || drug.status === 'EXPIRING SOON'
                    ? 'border-warning/30 hover:border-warning'
                    : 'border-border hover:border-primary/20'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {getDrugIcon(drug.category, drug.status)}
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase leading-snug ${getStatusBadgeStyles(drug.status)}`}>
                    {drug.status}
                  </span>
                </div>
                
                <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors duration-150 mb-1 leading-snug">
                  {drug.name}
                </h3>
                <p className="text-xs text-secondary/80 mb-4 font-medium">{drug.category}</p>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-border/40">
                <div>
                  <p className="text-[10px] text-muted uppercase font-bold tracking-tight">Quantity</p>
                  <p className={`font-black text-lg ${
                    drug.status === 'OUT OF STOCK' 
                      ? 'text-danger' 
                      : drug.status === 'LOW STOCK' 
                        ? 'text-warning' 
                        : 'text-on-surface'
                  }`}>
                    {drug.quantity.toLocaleString()} <span className="text-xs font-normal text-secondary">{drug.unitType}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted uppercase font-bold tracking-tight">Expiry</p>
                  <p className={`text-xs font-semibold ${
                    drug.status === 'EXPIRING SOON' ? 'text-danger font-bold' : 'text-on-surface'
                  }`}>
                    {drug.expiryDate}
                  </p>
                </div>
              </div>

              <div className="mt-2 text-[10px] text-primary hover:underline font-bold text-right pt-1 group-hover:visible sm:invisible">
                Click to update stock details →
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button for mobile/desktop to add drug quickly */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-200" />
      </button>


      {/* MODAL 1: ADD NEW DRUG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-lg w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-linear-to-r from-primary/5 to-transparent">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <PlusCircle className="w-5 h-5 font-bold text-primary" />
                Add New Drug Line
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleCreateDrug} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Drug Name / Dosage</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Paracetamol Extra 500mg, Augmentin 625mg"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Category / Group</label>
                  <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. Analgesic, Antibiotic, Antiviral"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Initial Quantity</label>
                  <input 
                    type="number" 
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Unit Type</label>
                  <select 
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25"
                  >
                    <option value="tabs">tabs (Tablets)</option>
                    <option value="capsules">capsules</option>
                    <option value="packs">packs</option>
                    <option value="sachets">sachets</option>
                    <option value="vials">vials</option>
                    <option value="bottles">bottles</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Selling unit Price (₦)</label>
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Amount in Naira per unit"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/25 font-bold text-primary"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Add Drug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 2: RESTOCK / UPDATE DRUG */}
      {restockItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-linear-to-r from-success/5 to-transparent">
              <div>
                <h3 className="font-bold text-lg text-primary">Restock Stock Item</h3>
                <p className="text-xs text-secondary">{restockItem.name}</p>
              </div>
              <button onClick={() => setRestockItem(null)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Current Stock Balance</label>
                <div className="px-4 py-3 bg-surface-container text-body-md rounded-xl font-bold text-secondary">
                  {restockItem.quantity} {restockItem.unitType}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">New Total Stock count</label>
                <input 
                  type="number" 
                  value={restockQty}
                  onChange={(e) => setRestockQty(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-success/25 font-bold"
                  required
                  min="0"
                />
                <span className="text-[10px] text-muted mt-1 block">Specify the absolute overall stock count level after replenishment.</span>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setRestockItem(null)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-success text-white hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Update Inventory Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
