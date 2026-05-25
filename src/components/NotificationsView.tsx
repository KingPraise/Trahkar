import React from 'react';
import { 
  AlertTriangle, 
  Trash2, 
  PlusCircle, 
  Clock, 
  Calendar, 
  AlertCircle, 
  Bell, 
  ArrowUp, 
  ChevronRight, 
  Send, 
  PhoneCall, 
  Hourglass, 
  TrendingDown, 
  FileSpreadsheet, 
  User, 
  CheckCircle2,
  Package,
  Sparkles,
  Info
} from 'lucide-react';
import { DrugItem, DebtRecord, AppSettings, Screen } from '../types';

interface NotificationsViewProps {
  drugs: DrugItem[];
  debts: DebtRecord[];
  onRestockDrug: (id: string, newQty: number) => void;
  onDeleteDrug: (id: string) => void;
  onUpdateDrugPrice?: (id: string, newPrice: number) => void;
  onNavigate: (screen: Screen) => void;
  settings: AppSettings;
}

export default function NotificationsView({
  drugs,
  debts,
  onRestockDrug,
  onDeleteDrug,
  onUpdateDrugPrice,
  onNavigate,
  settings
}: NotificationsViewProps) {
  const [localDismissed, setLocalDismissed] = React.useState<string[]>([]);
  const [reorderAmountModal, setReorderAmountModal] = React.useState<{ id: string, name: string } | null>(null);
  const [customReorderQty, setCustomReorderQty] = React.useState('50');
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Dynamic values
  const outstandingDebts = debts.filter(d => d.status === 'Outstanding');
  const totalOutstandingAmount = outstandingDebts.reduce((sum, d) => sum + d.amountOwed, 0);
  
  // Highlight the highest debtor, or default if none
  const highlightDebtors = outstandingDebts.length > 0
    ? outstandingDebts.sort((a, b) => b.amountOwed - a.amountOwed)[0]
    : {
        id: 'mock-deb',
        customerName: 'Mr. Adebayo Ogunwale',
        phoneNumber: '07019876543',
        amountOwed: 4500,
        dateRecorded: 'May 10, 2026',
        daysOutstanding: 15,
        status: 'Outstanding' as const,
        ageCategory: '15-30 Days' as const
      };

  // Compile real notifications
  // 1. Expired Items
  const expiredDrugs = drugs.filter(d => {
    if (localDismissed.includes(`exp-${d.id}`)) return false;
    // Real check: Let's assume Nov 2023 / Oct 2024 dates are expired or check status
    return d.status === 'EXPIRING SOON' || d.expiryDate.includes('2023') || d.expiryDate.includes('2024');
  });

  // 2. Out of stock items
  const outOfStockDrugs = drugs.filter(d => {
    if (localDismissed.includes(`oos-${d.id}`)) return false;
    return d.status === 'OUT OF STOCK' || d.quantity === 0;
  });

  // 3. Low stock items
  const lowStockDrugs = drugs.filter(d => {
    if (localDismissed.includes(`low-${d.id}`)) return false;
    return d.status === 'LOW STOCK' && d.quantity > 0;
  });

  // Expiring soon (that aren't completely expired yet, e.g. expirations on 2025)
  const expiringSoonDrugs = drugs.filter(d => {
    if (localDismissed.includes(`expsoon-${d.id}`)) return false;
    return d.expiryDate.includes('2025') && d.status !== 'OUT OF STOCK';
  });

  // Totals
  const urgentCount = expiredDrugs.length + outOfStockDrugs.length;

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const handleRemoveFromShelf = (drug: DrugItem) => {
    onDeleteDrug(drug.id);
    setLocalDismissed(prev => [...prev, `exp-${drug.id}`, `expsoon-${drug.id}`]);
    showToast(`Removed "${drug.name}" from active shelf inventory.`);
  };

  const handleOpenReorderModal = (drugId: string, name: string) => {
    setReorderAmountModal({ id: drugId, name });
  };

  const handleConfirmReorder = () => {
    if (!reorderAmountModal) return;
    const qty = parseInt(customReorderQty) || 50;
    onRestockDrug(reorderAmountModal.id, qty);
    setLocalDismissed(prev => prev.filter(item => !item.endsWith(reorderAmountModal.id)));
    showToast(`Successfully ordered and restocked ${qty} units of "${reorderAmountModal.name}"!`);
    setReorderAmountModal(null);
  };

  const handleMarkForSale = (drug: DrugItem) => {
    if (onUpdateDrugPrice) {
      const discountedPrice = Math.round(drug.unitPrice * 0.7); // 30% discount
      onUpdateDrugPrice(drug.id, discountedPrice);
      showToast(`Discount applied to "${drug.name}". Price marked down to ${settings.currencySymbol}${discountedPrice.toLocaleString()} for promo clearance.`);
    } else {
      showToast(`"${drug.name}" marked for promotional clearance discount.`);
    }
    // Also add to dismissed so it refreshes or shows badge
    setLocalDismissed(prev => [...prev, `expsoon-${drug.id}`]);
  };

  const handleSendReminder = (debt: any) => {
    let text = settings.whatsappMessageTemplate;
    text = text.replace(/{customerName}/g, debt.customerName);
    text = text.replace(/{amount}/g, debt.amountOwed.toLocaleString());
    text = text.replace(/{currency}/g, settings.currencySymbol);
    text = text.replace(/{dateRecorded}/g, debt.dateRecorded || 'May 2026');
    text = text.replace(/{days}/g, String(debt.daysOutstanding || 15));
    text = text.replace(/{pharmacyName}/g, settings.pharmacyName);
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${debt.phoneNumber.replace(/\s+/g, '')}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    showToast(`WhatsApp reminder prepared for ${debt.customerName}`);
  };

  const handleExportDebtorsCSV = () => {
    if (outstandingDebts.length === 0) {
      showToast("No active debtor records found to generate CSV.");
      return;
    }
    const headers = ['Customer Name', 'Phone Number', 'Amount Owed', 'Days Outstanding', 'Date Recorded'];
    const csvRows = [headers.join(',')];
    
    outstandingDebts.forEach(d => {
      const row = [
        `"${d.customerName.replace(/"/g, '""')}"`,
        `"${d.phoneNumber}"`,
        d.amountOwed,
        d.daysOutstanding,
        d.dateRecorded
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const exportName = `${settings.pharmacyName.toLowerCase().replace(/\s+/g, '-')}-overdue-debtors-${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", exportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Debtors report compiled and downloaded as CSV.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Toast notification banner */}
      {successToast && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 bg-primary text-on-primary border border-primary-fixed-dim p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce max-w-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Screen Title Block Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-primary flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications &amp; Intelligent Alerts
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Real-time checking on product degradation, low levels, outstanding collections, and supplier logistics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 text-xs font-bold text-secondary bg-surface-container-low hover:bg-surface-container-high rounded-xl border border-border/80 transition-all cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* SECTION 1: CRITICAL ALERTS */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-danger" />
            <h3 className="font-bold text-lg md:text-xl text-danger tracking-tight">Critical Alerts</h3>
            {urgentCount > 0 && (
              <span className="bg-danger text-white px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
                {urgentCount} Urgent
              </span>
            )}
          </div>
          {urgentCount === 0 && (
            <span className="text-xs text-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> All critical drugs resolved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Expired products card */}
          {expiredDrugs.map((drug) => (
            <div 
              key={`exp-${drug.id}`}
              className="bg-surface-container-lowest border-l-4 border-danger p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group\"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="font-bold text-base text-on-surface">{drug.name}</span>
                  <span className="text-danger text-xs font-bold flex items-center gap-1 mt-1 font-mono">
                    <Hourglass className="w-3.5 h-3.5 shrink-0" />
                    Expired/Expiring: {drug.expiryDate}
                  </span>
                </div>
                <span className="bg-danger/10 text-danger border border-danger/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Disposed Required
                </span>
              </div>
              
              <div className="flex items-center justify-between border-t border-dashed border-border/80 pt-3 mt-3">
                <span className="text-[11px] text-muted font-medium">Category: {drug.category}</span>
                <button 
                  onClick={() => handleRemoveFromShelf(drug)}
                  className="px-3.5 py-1.5 text-danger font-bold text-xs border border-danger rounded-xl hover:bg-danger/5 transition-colors cursor-pointer"
                >
                  Remove from Shelf
                </button>
              </div>
            </div>
          ))}

          {/* Out of Stock drugs */}
          {outOfStockDrugs.map((drug) => (
            <div 
              key={`oos-${drug.id}`}
              className="bg-surface-container-lowest border-l-4 border-danger p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="font-bold text-base text-on-surface">{drug.name}</span>
                  <span className="text-danger text-xs font-bold flex items-center gap-1 mt-1 font-mono">
                    <Package className="w-3.5 h-3.5 shrink-0" />
                    0 units remaining in inventory
                  </span>
                </div>
                <span className="bg-danger/10 text-danger border border-danger/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-border/80 pt-3 mt-3">
                <span className="text-[11px] text-muted font-medium">Price: {settings.currencySymbol}{drug.unitPrice} / {drug.unitType}</span>
                <button 
                  onClick={() => handleOpenReorderModal(drug.id, drug.name)}
                  className="bg-primary text-on-primary px-4 py-1.5 rounded-xl text-xs font-black hover:brightness-95 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  Reorder Now
                </button>
              </div>
            </div>
          ))}

          {/* Placeholder Expired default to match screenshot perfectly if nothing else */}
          {expiredDrugs.length === 0 && outOfStockDrugs.length === 0 && (
            <div className="col-span-full bg-surface-container-low/40 p-8 rounded-2xl border border-dashed border-border text-center text-secondary">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-bold text-sm">No urgent critical alerts left.</p>
              <p className="text-xs text-muted">All outdated compounds and vacant shelves are currently cleared.</p>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 2: ACTION REQUIRED */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-bold text-lg md:text-xl text-on-surface tracking-tight">Action Required</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Low Stock Items */}
          {lowStockDrugs.slice(0, 3).map((drug) => (
            <div 
              key={`low-${drug.id}`}
              className="bg-surface-container-lowest border-t-2 border-warning p-5 rounded-2xl shadow-sm hover:shadow-md transition-all\"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-on-surface line-clamp-1">{drug.name}</span>
                  <span className="text-warning font-mono text-xs font-bold mt-1 inline-flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {drug.quantity} {drug.unitType} left
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
                <span className="text-muted">Threshold: {settings.lowStockThreshold} units</span>
                <button 
                  onClick={() => handleOpenReorderModal(drug.id, drug.name)}
                  className="text-primary font-black hover:underline cursor-pointer"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}

          {/* Expiring Soon Items (expiring in 2025) */}
          {expiringSoonDrugs.slice(0, 2).map((drug) => (
            <div 
              key={`expsoon-${drug.id}`}
              className="bg-surface-container-lowest border-t-2 border-warning p-5 rounded-2xl shadow-sm hover:shadow-md transition-all\"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-on-surface line-clamp-1">{drug.name}</span>
                  <span className="text-warning font-mono text-xs font-bold mt-1 inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Expires {drug.expiryDate}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
                <span className="text-muted">In stock: {drug.quantity} {drug.unitType}</span>
                <button 
                  onClick={() => handleMarkForSale(drug)}
                  className="text-primary font-black hover:underline cursor-pointer"
                >
                  Mark for Sale
                </button>
              </div>
            </div>
          ))}

          {/* Static Supplier Reminder overdue */}
            <div className="bg-surface-container-lowest border-t-2 border-warning p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-sm text-on-surface">Supplier: Emzor Pharma</span>
                <span className="text-warning font-mono text-xs font-bold mt-1 inline-flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Delivery overdue by 2 days
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted">Order Code: #9821</span>
              <button 
                onClick={() => showToast("Contacting Emzor Pharma customer helpline at +234 1 234 5678")}
                className="text-primary font-black hover:underline cursor-pointer"
              >
                Contact Supplier
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: FINANCIAL REMINDERS (BENTO STYLE) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <TrendingDown className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg md:text-xl text-on-surface tracking-tight">Financial Reminders</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Debt Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row gap-6 justify-between items-stretch">
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="font-bold text-sm md:text-base text-secondary">Total Outstanding Credit</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl md:text-3xl font-black text-primary">
                  {settings.currencySymbol}{totalOutstandingAmount.toLocaleString()}
                </span>
                <span className="text-danger text-xs font-bold flex items-center gap-0.5">
                  <ArrowUp className="w-3.5 h-3.5" />
                  12% this month
                </span>
              </div>
              <p className="text-xs text-muted mt-2 leading-relaxed max-w-md">
                {outstandingDebts.length} debtor accounts currently have unsettled balances. Daily collections follow-ups maintain high liquid pharmacy solvency.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-center shrink-0">
              <button 
                onClick={() => onNavigate('debts')}
                className="bg-primary hover:brightness-95 text-on-primary py-2.5 px-6 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer text-center whitespace-nowrap"
              >
                View Debt Ledger
              </button>
              <button 
                onClick={handleExportDebtorsCSV}
                className="text-secondary border border-border bg-surface-container-low hover:bg-surface-container-high py-2.5 px-6 rounded-xl font-bold text-xs transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-secondary" />
                <span>Generate Debt Report</span>
              </button>
            </div>
          </div>

          {/* Individual Debt Alert */}
          <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-md flex flex-col justify-between border border-primary/20">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <span className="font-black text-base text-white tracking-tight line-clamp-1">
                    {highlightDebtors.customerName}
                  </span>
                  <span className="text-blue-200 text-[10px] font-bold mt-0.5 uppercase tracking-wider">
                    Largest outstanding
                  </span>
                </div>
                <User className="w-5 h-5 text-white/80 shrink-0" />
              </div>

              <div className="bg-white/10 rounded-xl p-3.5 mb-4 border border-white/5">
                <p className="text-[11px] text-blue-100 font-medium">Recorded Owed Amount</p>
                <p className="font-extrabold text-2xl text-white mt-0.5">
                  {settings.currencySymbol}{highlightDebtors.amountOwed.toLocaleString()}
                </p>
                <p className="text-red-200 text-xs font-bold mt-1">
                  {highlightDebtors.daysOutstanding} days overdue
                </p>
              </div>
            </div>

            <button 
              onClick={() => handleSendReminder(highlightDebtors)}
              className="w-full bg-white text-primary py-2.5 rounded-xl font-black text-xs hover:bg-surface-bright active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4 text-primary shrink-0" />
              <span>Send WhatsApp Reminder</span>
            </button>
          </div>

        </div>
      </section>

      {/* FLOAT ACTION STICKY EXPLAINER */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-border text-xs flex items-center gap-2 text-secondary">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>Alert lists trigger warning thresholds configured in the <strong>Settings tab</strong>. Standard reorder and mark-for-sale parameters are local.</span>
      </div>

      {/* RESTOCK MODAL */}
      {reorderAmountModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface-container-lowest dark:bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-border dark:border-zinc-800 space-y-4">
            <h3 className="font-black text-base text-primary">Restock Medicine Supply</h3>
            <p className="text-xs text-secondary">
              Input new stocking amount for <strong>{reorderAmountModal.name}</strong>.
            </p>
            <input 
              type="number"
              value={customReorderQty}
              onChange={(e) => setCustomReorderQty(e.target.value)}
              className="w-full border border-border dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
              placeholder="Quantity..."
              min="1"
            />
            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setReorderAmountModal(null)}
                className="px-4 py-2 text-xs font-semibold text-secondary rounded-xl hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmReorder}
                className="px-5 py-2 bg-primary text-on-primary text-xs font-bold rounded-xl hover:brightness-95"
              >
                Stock Replenish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
