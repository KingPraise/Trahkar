import React from 'react';
import { 
  Search, 
  Download, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  CreditCard, 
  ShieldAlert,
  Printer,
  ChevronDown,
  X,
  UserCheck,
  Package,
  ArrowRightLeft
} from 'lucide-react';
import { DrugItem, Transaction } from '../types';

interface SalesViewProps {
  drugs: DrugItem[];
  transactions: Transaction[];
  onCompleteSale: (saleData: {
    drugId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    paymentMethod: 'cash' | 'transfer' | 'pos';
    grandTotal: number;
  }) => void;
  todaySalesAmount: number;
}

export default function SalesView({
  drugs,
  transactions,
  onCompleteSale,
  todaySalesAmount
}: SalesViewProps) {
  // Tabs: 'new-sale' | 'sales-history'
  const [activeTab, setActiveTab] = React.useState<'new-sale' | 'sales-history'>('new-sale');

  // New Sale Form States
  const [matchingDrugsOpen, setMatchingDrugsOpen] = React.useState(false);
  const [drugSearchText, setDrugSearchText] = React.useState('');
  const [selectedDrug, setSelectedDrug] = React.useState<DrugItem | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState<'cash' | 'transfer' | 'pos'>('cash');

  // Filter Transactions Search states
  const [historySearchQuery, setHistorySearchQuery] = React.useState('');

  // Drug match list
  const matchedDrugs = drugs.filter((d) => 
    d.name.toLowerCase().includes(drugSearchText.toLowerCase()) ||
    d.category.toLowerCase().includes(drugSearchText.toLowerCase())
  );

  const handleSelectDrug = (drug: DrugItem) => {
    setSelectedDrug(drug);
    setDrugSearchText(drug.name);
    setMatchingDrugsOpen(false);
    setQuantity(1);
  };

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setQuantity(val < 1 ? 1 : val);
  };

  const calculatedTotal = selectedDrug ? selectedDrug.unitPrice * quantity : 2500;

  const handleSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrug) {
      alert('Please select a valid drug from the matching pharmacy items list first.');
      return;
    }

    if (selectedDrug.quantity < quantity) {
      if (!confirm(`Warning: Only ${selectedDrug.quantity} items available in stock. Proceed with credit or dispatch order?`)) {
        return;
      }
    }

    onCompleteSale({
      drugId: selectedDrug.id,
      itemName: selectedDrug.name,
      quantity,
      unitPrice: selectedDrug.unitPrice,
      paymentMethod,
      grandTotal: calculatedTotal,
    });

    // Reset Form
    alert(`Success: Dispatched ${quantity} units of ${selectedDrug.name} successfully!\nTotal Value: ₦${calculatedTotal.toLocaleString()}`);
    setSelectedDrug(null);
    setDrugSearchText('');
    setQuantity(1);
    setPaymentMethod('cash');
  };

  const handlePrintOnly = () => {
    if (!selectedDrug) {
      alert('Please select a drug item to calculate and print a receipt.');
      return;
    }
    alert(
      `==================================\n` +
      `       FAVOUR PHARMACY REGISTERS  \n` +
      `==================================\n` +
      `Item: ${selectedDrug.name}\n` +
      `Qty: ${quantity} x ₦${selectedDrug.unitPrice.toLocaleString()}\n` +
      `Subtotal: ₦${calculatedTotal.toLocaleString()}\n` +
      `Tax (VAT): ₦0.00\n` +
      `----------------------------------\n` +
      `Total Due: ₦${calculatedTotal.toLocaleString()}\n` +
      `Payment Mode: ${paymentMethod.toUpperCase()}\n` +
      `==================================\n` +
      `   THANK YOU FOR YOUR PATRONAGE!  \n` +
      `==================================`
    );
  };

  const handleExportCSV = () => {
    const headers = 'Time,Item Details,Amount,Method,Date\n';
    const rows = transactions.map(t => 
      `"${t.time}","${t.itemName} x${t.quantity}","₦${t.amount}","${t.paymentMethod}","${t.date}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Favour_Pharmacy_Sales_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filter history list
  const filteredTransactions = transactions.filter((t) => 
    t.itemName.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
    t.paymentMethod.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Navigation Tabs */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('new-sale')}
          className={`relative px-8 py-3.5 text-headline-card font-bold transition-all text-sm cursor-pointer ${
            activeTab === 'new-sale'
              ? 'text-primary'
              : 'text-secondary opacity-70 hover:opacity-100 hover:text-primary'
          }`}
        >
          <span>New Sale</span>
          {activeTab === 'new-sale' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary rounded-t-full"></div>
          )}
        </button>

        <button 
          onClick={() => setActiveTab('sales-history')}
          className={`relative px-8 py-3.5 text-headline-card font-bold transition-all text-sm cursor-pointer ${
            activeTab === 'sales-history'
              ? 'text-primary'
              : 'text-secondary opacity-70 hover:opacity-100 hover:text-primary'
          }`}
        >
          <span>Sales History</span>
          {activeTab === 'sales-history' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* VIEW 1: RECORD NEW SALE */}
      {activeTab === 'new-sale' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Sale entry Form */}
          <div className="xl:col-span-2 bg-surface-container-lowest rounded-2xl shadow-sm p-6 border border-border">
            <h2 className="text-lg md:text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              Record New Transaction
            </h2>
            
            <form onSubmit={handleSaleSubmit} className="space-y-6">
              
              {/* Drug selection */}
              <div className="relative">
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Search Drug Name</label>
                <div className="relative flex items-center border border-border rounded-xl bg-surface-container-low px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search className="text-secondary w-5 h-5 mr-3" />
                  <input 
                    type="text"
                    value={drugSearchText}
                    onChange={(e) => {
                      setDrugSearchText(e.target.value);
                      setMatchingDrugsOpen(true);
                    }}
                    onFocus={() => setMatchingDrugsOpen(true)}
                    placeholder="Start typing drug name to match stock list..."
                    className="w-full py-3.5 bg-transparent border-none outline-none text-body-md text-on-surface"
                  />
                  {drugSearchText && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setDrugSearchText('');
                        setSelectedDrug(null);
                        setMatchingDrugsOpen(false);
                      }}
                      className="p-1 hover:bg-surface-container rounded-full"
                    >
                      <X className="w-4 h-4 text-secondary hover:text-on-surface" />
                    </button>
                  )}
                </div>

                {/* Dropdown matched Drugs */}
                {matchingDrugsOpen && drugSearchText && (
                  <div className="absolute left-0 right-0 mt-2 bg-surface-container-lowest border border-border rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-border/60">
                    {matchedDrugs.length === 0 ? (
                      <div className="px-4 py-3 text-secondary text-xs">No matching stock drugs found. Type another name.</div>
                    ) : (
                      matchedDrugs.map((drug) => (
                        <div 
                          key={drug.id}
                          onClick={() => handleSelectDrug(drug)}
                          className="px-4 py-3 hover:bg-surface-container-low cursor-pointer flex justify-between items-center transition-colors"
                        >
                          <div>
                            <p className="font-bold text-sm text-on-surface">{drug.name}</p>
                            <p className="text-[10px] text-secondary">{drug.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xs text-primary">₦{drug.unitPrice.toLocaleString()}</p>
                            <p className="text-[10px] text-muted">{drug.quantity} {drug.unitType} left</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Available level helper */}
                {selectedDrug && (
                  <div className="mt-2 text-xs text-success flex items-center gap-1.5 font-semibold bg-success/5 p-2 rounded-lg border border-success/10">
                    <CheckCircle className="w-4 h-4" />
                    <span>In Stock: {selectedDrug.quantity} {selectedDrug.unitType} available</span>
                  </div>
                )}
              </div>

              {/* Quantity and Selling Price inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={handleQtyChange}
                    min="1"
                    className="w-full px-4 py-3 border border-border rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-body-md font-bold text-on-surface"
                  />
                  {selectedDrug && quantity > selectedDrug.quantity && (
                    <span className="text-[10px] text-danger font-bold mt-1 block">Warning: exceeds active in-stock availability level.</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Unit Price (₦)</label>
                  <input 
                    type="text" 
                    readOnly
                    value={selectedDrug ? `₦${selectedDrug.unitPrice.toLocaleString()}` : '₦2,500'}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-surface-variant/30 text-body-md cursor-not-allowed font-semibold text-secondary"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  
                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`px-5 py-3 rounded-xl border flex items-center justify-center gap-2 text-sm transition-all font-semibold ${
                      paymentMethod === 'cash'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                        : 'border-border bg-surface-container-lowest hover:border-primary text-secondary'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Cash</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`px-5 py-3 rounded-xl border flex items-center justify-center gap-2 text-sm transition-all font-semibold ${
                      paymentMethod === 'transfer'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                        : 'border-border bg-surface-container-lowest hover:border-primary text-secondary'
                    }`}
                  >
                    <ArrowRightLeft className="w-5 h-5" />
                    <span>Transfer</span>
                  </button>

                  <button 
                    type="button"
                    onClick={() => setPaymentMethod('pos')}
                    className={`px-5 py-3 rounded-xl border flex items-center justify-center gap-2 text-sm transition-all font-semibold ${
                      paymentMethod === 'pos'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                        : 'border-border bg-surface-container-lowest hover:border-primary text-secondary'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>POS</span>
                  </button>

                </div>
              </div>

            </form>
          </div>

          {/* Checkout block summary */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-border p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-on-surface mb-6 pb-2 border-b border-border/60">Sale Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border border-dashed text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-bold text-on-surface">₦{calculatedTotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-border border-dashed text-sm">
                  <span className="text-secondary">Tax (VAT 0%)</span>
                  <span className="font-bold text-on-surface">₦0.00</span>
                </div>

                <div className="mt-8 pt-4">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Total Amount Due</p>
                  <p className="text-3xl md:text-4xl font-black text-primary">₦{calculatedTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button 
                onClick={handleSaleSubmit}
                className="w-full bg-primary hover:bg-primary-container text-on-primary py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Complete Sale</span>
              </button>
              
              <button 
                onClick={handlePrintOnly}
                className="w-full bg-transparent text-secondary border border-border py-3 rounded-xl font-semibold hover:bg-surface-container text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt Only</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: SALES HISTORY */}
      {activeTab === 'sales-history' && (
        <div className="space-y-6">
          
          {/* Sales metrics bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Sales (Today)</p>
                <p className="text-xl md:text-2xl font-black text-primary mt-1">₦{todaySalesAmount.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-1 text-success text-[10px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> 
                  <span>Synced in real-time</span>
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-2xl text-primary font-black text-lg">
                ₦
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Transactions Completed</p>
                <p className="text-xl md:text-2xl font-black text-on-surface mt-1">{transactions.length}</p>
                <p className="mt-2 text-[10px] text-secondary font-medium">Synced terminal count: 84 records today</p>
              </div>
              <div className="p-4 bg-surface-container text-secondary font-black text-lg">
                #
              </div>
            </div>
          </div>

          {/* Tables widget */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
              <div>
                <h3 className="font-bold text-lg text-on-surface">Today's Transactions ledger</h3>
                <p className="text-xs text-secondary mt-0.5 font-medium">Search and export registered pharmacy cash ledger details.</p>
              </div>

              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                  <input 
                    type="text" 
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search query..."
                    className="pl-9 pr-3 py-1.5 bg-surface-container-low border border-border rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary w-40"
                  />
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="bg-primary/10 text-primary hover:bg-primary/25 border border-primary/20 hover:border-transparent px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 font-bold" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-secondary text-[11px] font-black uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-low/40 transition-colors duration-100">
                      <td className="px-6 py-4 text-sm text-secondary font-medium">{tx.time}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-on-surface">{tx.itemName}</p>
                        <p className="text-[10px] text-secondary font-medium">{tx.quantity} packs / units</p>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-sm text-on-surface">₦{tx.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black rounded-full uppercase ${
                          tx.paymentMethod === 'cash'
                            ? 'bg-success/10 text-success'
                            : tx.paymentMethod === 'pos'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-on-secondary-container/10 text-on-secondary-container'
                        }`}>
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => alert(`Active syncer transaction receipt details:\nTxId: ${tx.id}\nItem: ${tx.itemName}\nQty: ${tx.quantity}\nTotal: ₦${tx.amount.toLocaleString()}`)}
                          className="material-symbols-outlined text-secondary hover:text-primary transition-colors cursor-pointer"
                        >
                          receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
