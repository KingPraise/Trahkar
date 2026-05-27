import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Wallet, 
  Coins, 
  ShoppingCart, 
  Plus, 
  FileText,
  UserPlus,
  ArrowRight,
  Briefcase,
  Activity,
  X,
  PlusCircle,
  TrendingDown,
  LogOut
} from 'lucide-react';
import { ActivityLine, DrugItem, Screen } from '../types';

interface DashboardViewProps {
  todaySalesTotal: number;
  stockAlertsCount: number;
  outstandingDebtsTotal: number;
  monthlyProfitEstimate: number;
  activities: ActivityLine[];
  onNavigate: (screen: Screen) => void;
  onAddDrug: (drug: Partial<DrugItem>) => void;
  onAddDebt: (name: string, phone: string, amount: number) => void;
  onAddExpense: (name: string, amount: number) => void;
}

export default function DashboardView({
  todaySalesTotal,
  stockAlertsCount,
  outstandingDebtsTotal,
  monthlyProfitEstimate,
  activities,
  onNavigate,
  onAddDrug,
  onAddDebt,
  onAddExpense
}: DashboardViewProps) {
  // Modal states
  const [showExpenseModal, setShowExpenseModal] = React.useState(false);
  const [showDrugModal, setShowDrugModal] = React.useState(false);
  const [showDebtModal, setShowDebtModal] = React.useState(false);

  // Form states
  const [expenseName, setExpenseName] = React.useState('');
  const [expenseAmount, setExpenseAmount] = React.useState('');

  const [drugName, setDrugName] = React.useState('');
  const [drugCategory, setDrugCategory] = React.useState('');
  const [drugQty, setDrugQty] = React.useState('');
  const [drugPrice, setDrugPrice] = React.useState('');
  const [drugExpiry, setDrugExpiry] = React.useState('Dec 2026');
  const [drugUnit, setDrugUnit] = React.useState('tabs');

  const [debtName, setDebtName] = React.useState('');
  const [debtPhone, setDebtPhone] = React.useState('');
  const [debtAmount, setDebtAmount] = React.useState('');

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;
    onAddExpense(expenseName, Number(expenseAmount));
    setExpenseName('');
    setExpenseAmount('');
    setShowExpenseModal(false);
  };

  const handleDrugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName || !drugQty || !drugPrice) return;
    onAddDrug({
      name: drugName,
      category: drugCategory || 'General Medicine',
      quantity: Number(drugQty),
      unitPrice: Number(drugPrice),
      unitType: drugUnit,
      expiryDate: drugExpiry,
    });
    setDrugName('');
    setDrugCategory('');
    setDrugQty('');
    setDrugPrice('');
    setDrugUnit('tabs');
    setDrugExpiry('Dec 2026');
    setShowDrugModal(false);
  };

  const handleDebtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtName || !debtAmount) return;
    onAddDebt(debtName, debtPhone || 'No Phone', Number(debtAmount));
    setDebtName('');
    setDebtPhone('');
    setDebtAmount('');
    setShowDebtModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner with Log Out */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 px-6 py-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#191c1e] dark:text-white flex items-center gap-2">
            <span>Pharmacy Control Panel</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Real-time stats tracking for your medical inventory and transactions ledger.</p>
        </div>
        <button
          onClick={() => onNavigate('landing')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl text-xs font-extrabold transition-all border border-red-200/60 shadow-xs active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>Log Out to Homepage</span>
        </button>
      </div>

      {/* Metric summary grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Today's Sales */}
        <div 
          onClick={() => onNavigate('sales')}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </span>
            <span className="text-success text-xs font-bold bg-success/15 px-2 py-0.5 rounded-full flex items-center gap-1">+12%</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider">Today's Sales</p>
            <h2 className="text-xl md:text-2xl font-black text-on-surface mt-1">₦{todaySalesTotal.toLocaleString()}</h2>
          </div>
        </div>

        {/* Stock Alerts */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:border-danger/20 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="p-3 bg-danger/10 rounded-xl text-danger group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </span>
            <span className="px-2.5 py-0.5 bg-danger/15 text-danger text-[10px] uppercase font-black tracking-wider rounded-full">Urgent</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider">Stock Alerts</p>
            <h2 className="text-xl md:text-2xl font-black text-on-surface mt-1">{stockAlertsCount} Items</h2>
          </div>
        </div>

        {/* Outstanding Debts */}
        <div 
          onClick={() => onNavigate('debts')}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:border-warning/20 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="p-3 bg-warning/10 rounded-xl text-warning group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6" />
            </span>
            <span className="text-warning text-[10px] uppercase font-bold bg-warning/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider">Outstanding Debts</p>
            <h2 className="text-xl md:text-2xl font-black text-on-surface mt-1">₦{outstandingDebtsTotal.toLocaleString()}</h2>
          </div>
        </div>

        {/* Month Profit */}
        <div 
          onClick={() => onNavigate('reports')}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between hover:shadow-md hover:border-success/20 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="p-3 bg-success/10 rounded-xl text-success group-hover:scale-110 transition-transform">
              <Coins className="w-6 h-6" />
            </span>
            <span className="text-success text-xs font-bold bg-success/10 px-2.5 py-0.5 rounded-full">Estimated</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider">This Month's Profit</p>
            <h2 className="text-xl md:text-2xl font-black text-on-surface mt-1">₦{monthlyProfitEstimate.toLocaleString()}</h2>
          </div>
        </div>

      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h3 className="font-bold text-lg text-on-surface">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <button 
            onClick={() => onNavigate('sales')}
            className="group flex flex-col items-center justify-center p-6 bg-primary text-on-primary rounded-2xl hover:brightness-110 shadow-lg active:scale-95 transition-all text-center"
          >
            <ShoppingCart className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">+ Add Sale</span>
          </button>

          <button 
            onClick={() => setShowDrugModal(true)}
            className="group flex flex-col items-center justify-center p-6 bg-surface-container-lowest border-2 border-primary/25 text-primary rounded-2xl hover:bg-primary/5 active:scale-95 transition-all text-center"
          >
            <PlusCircle className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-primary" />
            <span className="font-semibold text-sm text-primary">+ Add Drug</span>
          </button>

          <button 
            onClick={() => setShowDebtModal(true)}
            className="group flex flex-col items-center justify-center p-6 bg-surface-container-lowest border-2 border-warning/20 text-warning rounded-2xl hover:bg-warning/5 active:scale-95 transition-all text-center"
          >
            <UserPlus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-warning" />
            <span className="font-semibold text-sm text-warning">+ Record Debt</span>
          </button>

          <button 
            onClick={() => onNavigate('expenses')}
            className="group flex flex-col items-center justify-center p-6 bg-surface-container-lowest border-2 border-danger/20 text-danger rounded-2xl hover:bg-danger/5 active:scale-95 transition-all text-center"
          >
            <FileText className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-danger" />
            <span className="font-semibold text-sm text-danger">+ Record Expense</span>
          </button>

        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-white dark:bg-zinc-900">
          <h3 className="font-bold text-lg text-on-surface">Recent Activity</h3>
          <button 
            onClick={() => onNavigate('sales')} 
            className="text-primary hover:underline text-sm font-semibold flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="divide-y divide-border">
          {activities.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted">No recent operations logged.</div>
          ) : (
            activities.map((act) => {
              // Icon matching
              let iconBg = 'bg-primary/10 text-primary';
              let iconShape = <ShoppingCart className="w-5 h-5" />;
              let badgeBg = 'bg-success/15 text-success';
              
              if (act.type === 'expense') {
                iconBg = 'bg-danger/10 text-danger';
                iconShape = <TrendingDown className="w-5 h-5" />;
                badgeBg = 'bg-danger/15 text-danger';
              } else if (act.type === 'debt') {
                iconBg = 'bg-warning/10 text-warning';
                iconShape = <AlertTriangle className="w-5 h-5" />;
                badgeBg = 'bg-warning/10 text-warning';
              }

              return (
                <div 
                  key={act.id} 
                  className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low transition-colors duration-150"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center font-bold`}>
                      {iconShape}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-on-surface">{act.title}</h4>
                      <p className="text-secondary text-xs">{act.subtitle} • {act.timeText}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-sm text-on-surface">₦{act.amount.toLocaleString()}</p>
                    <span className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-black rounded-full mt-1 ${badgeBg}`}>
                      {act.badgeText}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-8 border-t border-border/70 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-secondary">
        <p>© 2026 Favour Pharmacy & Stores. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support Portal</a>
        </div>
      </footer>


      {/* MODAL 1: RECORD EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-danger/5 to-transparent">
              <h3 className="font-bold text-lg text-danger flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Record Shop Expense
              </h3>
              <button onClick={() => setShowExpenseModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Expense Title / Description</label>
                <input 
                  type="text" 
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="e.g. Shop Electricity PHCN, Diesel generator"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Amount Spent (₦)</label>
                <input 
                  type="number" 
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-danger/20 focus:border-danger transition-all font-bold"
                  required
                  min="1"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-danger text-on-error hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 2: ADD NEW DRUG */}
      {showDrugModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-lg w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add New Drug to Inventory
              </h3>
              <button onClick={() => setShowDrugModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleDrugSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Drug Name / Dosage</label>
                  <input 
                    type="text" 
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg, Panadol Extra"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Category / Group</label>
                  <input 
                    type="text" 
                    value={drugCategory}
                    onChange={(e) => setDrugCategory(e.target.value)}
                    placeholder="e.g. Antibiotic, Analgesic"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Expiry Date</label>
                  <input 
                    type="text" 
                    value={drugExpiry}
                    onChange={(e) => setDrugExpiry(e.target.value)}
                    placeholder="e.g. Dec 2026, Aug 2025"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Initial Quantity</label>
                  <input 
                    type="number" 
                    value={drugQty}
                    onChange={(e) => setDrugQty(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Unit Type</label>
                  <select 
                    value={drugUnit}
                    onChange={(e) => setDrugUnit(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Unit Selling Price (₦)</label>
                  <input 
                    type="number" 
                    value={drugPrice}
                    onChange={(e) => setDrugPrice(e.target.value)}
                    placeholder="Selling price per unit of dispatch, e.g. 2500"
                    className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-primary"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowDrugModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-on-primary hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Add Drug Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL 3: RECORD DEBT */}
      {showDebtModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-gradient-to-r from-warning/5 to-transparent">
              <h3 className="font-bold text-lg text-warning flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Record Outstanding Debt
              </h3>
              <button onClick={() => setShowDebtModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleDebtSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Customer Full Name</label>
                <input 
                  type="text" 
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  placeholder="e.g. Mallam Ibrahim, Chief Okon"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Customer Phone Number</label>
                <input 
                  type="text" 
                  value={debtPhone}
                  onChange={(e) => setDebtPhone(e.target.value)}
                  placeholder="e.g. 0803 456 7890"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Amount Owed (₦)</label>
                <input 
                  type="number" 
                  value={debtAmount}
                  onChange={(e) => setDebtAmount(e.target.value)}
                  placeholder="Outstanding credit value, e.g. 5400"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all font-bold"
                  required
                  min="1"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowDebtModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-warning text-on-tertiary-fixed hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Record Debt account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
