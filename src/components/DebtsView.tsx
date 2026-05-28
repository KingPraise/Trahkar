import React from 'react';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle, 
  Plus, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Clock, 
  Activity,
  User,
  X,
  Smartphone,
  CheckCircle2,
  Trash2,
  BellRing
} from 'lucide-react';
import { DebtRecord, AppSettings } from '../types';

interface DebtsViewProps {
  debts: DebtRecord[];
  onMarkPaid: (debtId: string) => void;
  onRecordDebt: (name: string, phone: string, amount: number) => void;
  onDeleteDebt: (debtId: string) => void;
  settings: AppSettings;
}

export default function DebtsView({
  debts,
  onMarkPaid,
  onRecordDebt,
  onDeleteDebt,
  settings
}: DebtsViewProps) {
  // Tabs: 'outstanding' | 'paid'
  const [activeTab, setActiveTab] = React.useState<'outstanding' | 'paid'>('outstanding');
  
  // Age filter: 'all' | 'over30' | '15-30' | '0-14'
  const [ageFilter, setAgeFilter] = React.useState<string>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [reminderDebt, setReminderDebt] = React.useState<DebtRecord | null>(null);
  const [confirmPaidDebt, setConfirmPaidDebt] = React.useState<DebtRecord | null>(null);

  // Form states
  const [customerName, setCustomerName] = React.useState('');
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [amountOwed, setAmountOwed] = React.useState('');

  const allOutstandingDebts = debts.filter((d) => d.status === 'Outstanding');
  
  // Filtered outstanding debts based on selected age category
  const outstandingDebts = allOutstandingDebts.filter((d) => {
    if (ageFilter === 'all') return true;
    if (ageFilter === 'over30') return d.daysOutstanding > 30;
    if (ageFilter === '15-30') return d.daysOutstanding >= 15 && d.daysOutstanding <= 30;
    if (ageFilter === '0-14') return d.daysOutstanding < 15;
    return true;
  });

  const paidDebts = debts.filter((d) => d.status === 'Paid');

  const totalOutstanding = allOutstandingDebts.reduce((sum, d) => sum + d.amountOwed, 0);

  // Aging segments (computed dynamically over all outstanding debts)
  const segments = React.useMemo(() => {
    let over30 = 0;
    let mid = 0;
    let young = 0;

    allOutstandingDebts.forEach((d) => {
      if (d.daysOutstanding > 30) over30 += d.amountOwed;
      else if (d.daysOutstanding >= 15) mid += d.amountOwed;
      else young += d.amountOwed;
    });

    const total = over30 + mid + young || 1;
    return {
      over30: { amount: over30, pct: Math.round((over30 / total) * 100) },
      mid: { amount: mid, pct: Math.round((mid / total) * 100) },
      young: { amount: young, pct: Math.round((young / total) * 100) },
    };
  }, [allOutstandingDebts]);

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !amountOwed) return;
    onRecordDebt(customerName, customerPhone || 'No Phone', Number(amountOwed));
    setCustomerName('');
    setCustomerPhone('');
    setAmountOwed('');
    setShowAddModal(false);
  };

  const currentMonthDateText = () => {
    return 'May 2026';
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // WhatsApp generator link
  const generateWhatsAppMessage = (debt: DebtRecord) => {
    let text = settings.whatsappMessageTemplate;
    text = text.replace(/{customerName}/g, debt.customerName);
    text = text.replace(/{amount}/g, debt.amountOwed.toLocaleString());
    text = text.replace(/{currency}/g, settings.currencySymbol);
    text = text.replace(/{dateRecorded}/g, debt.dateRecorded);
    text = text.replace(/{days}/g, String(debt.daysOutstanding));
    text = text.replace(/{pharmacyName}/g, settings.pharmacyName);
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${debt.phoneNumber.replace(/\s+/g, '')}?text=${encoded}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Summary Bar block banner */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Debt Overview Balance</p>
          <h3 className="text-2xl md:text-3xl font-black text-danger mt-1">Total Outstanding: {settings.currencySymbol}{totalOutstanding.toLocaleString()}</h3>
        </div>
        
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-container text-on-primary px-6 py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>New Sale on Credit</span>
          </button>
        </div>
      </section>

      {/* Tabs Row outstanding vs paid */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border gap-4 pb-2 sm:pb-0">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('outstanding')}
            className={`relative px-8 py-3.5 text-headline-card font-bold text-sm transition-all ${
              activeTab === 'outstanding'
                ? 'text-primary'
                : 'text-secondary opacity-70 hover:opacity-100 hover:text-primary'
            }`}
          >
            <span>Outstanding</span>
            {activeTab === 'outstanding' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary rounded-t-full"></div>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('paid')}
            className={`relative px-8 py-3.5 text-headline-card font-bold text-sm transition-all ${
              activeTab === 'paid'
                ? 'text-primary'
                : 'text-secondary opacity-70 hover:opacity-100 hover:text-primary'
            }`}
          >
            <span>Paid ({paidDebts.length})</span>
            {activeTab === 'paid' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary rounded-t-full"></div>
            )}
          </button>
        </div>

        {activeTab === 'outstanding' && (
          <div className="flex items-center gap-2 px-6 pb-2 sm:pb-0">
            <span className="text-secondary text-xs font-semibold">Age Category:</span>
            <select
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="bg-surface-container-low border border-border rounded-xl text-xs font-bold text-on-surface px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
            >
              <option value="all">All Outstanding</option>
              <option value="over30">Over 30 Days (Overdue)</option>
              <option value="15-30">15-30 Days</option>
              <option value="0-14">0-14 Days</option>
            </select>
          </div>
        )}
      </div>

      {/* Grid List cards */}
      {activeTab === 'outstanding' ? (
        outstandingDebts.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-border/80">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
            <h4 className="font-bold text-on-surface">
              {ageFilter === 'all' ? 'No Outstanding Debts!' : 'No Debts in this Category!'}
            </h4>
            <p className="text-secondary text-xs mt-1">
              {ageFilter === 'all' 
                ? 'All customer accounts are completely settled. Great job!' 
                : 'No outstanding balances match the selected age category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outstandingDebts.map((debt) => {
              const isOverdue = debt.daysOutstanding > 30;
              return (
                <div 
                  key={debt.id}
                  className="bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between hover:border-danger hover:shadow-md transition-all relative overflow-hidden group"
                >
                  {isOverdue && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-danger text-white text-[10px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[10px]" />
                        <span>OVERDUE</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-primary font-black text-sm">
                        {getInitials(debt.customerName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface leading-tight">{debt.customerName}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-muted font-medium mt-0.5">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{debt.phoneNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Amount Owed:</span>
                        <span className="font-black text-danger text-base">{settings.currencySymbol}{debt.amountOwed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Date Recorded:</span>
                        <span className="font-bold text-on-surface">{debt.dateRecorded}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-secondary">Days Outstanding:</span>
                        <span className={`font-black ${isOverdue ? 'text-danger' : 'text-warning'}`}>
                          {debt.daysOutstanding} Days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2 border-t border-border/40">
                    <button 
                      onClick={() => setReminderDebt(debt)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 rounded-xl font-bold text-xs transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Remind</span>
                    </button>
                    
                    <button 
                      onClick={() => setConfirmPaidDebt(debt)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-xs shadow-sm cursor-pointer active:scale-95 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark Paid</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        paidDebts.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 text-center rounded-2xl border border-border/80 text-muted text-xs">
            No previously settled debt logs in payment archive yet.
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-secondary text-xs font-semibold border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Settled Date</th>
                    <th className="px-6 py-3 text-right">Settled Amount</th>
                    <th className="px-6 py-3 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paidDebts.map((debt) => (
                    <tr key={debt.id} className="hover:bg-surface-container-low/40">
                      <td className="px-6 py-4 font-bold text-sm text-on-surface">{debt.customerName}</td>
                      <td className="px-6 py-4 text-xs text-secondary">{debt.phoneNumber}</td>
                      <td className="px-6 py-4 text-xs text-secondary">May 25, 2026</td>
                      <td className="px-6 py-4 text-right font-black text-sm text-success">{settings.currencySymbol}{debt.amountOwed.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => {
                            if (confirm('Delete this historical paid log line forever?')) {
                              onDeleteDebt(debt.id);
                            }
                          }}
                          className="text-danger hover:bg-error-container/20 p-1 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Aging Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Aging analysis bar */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-sm">
          <h4 className="font-bold text-base text-on-surface mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Debt Aging Analysis</span>
          </h4>
          
          <div className="space-y-5">
            {/* Split Progress Track */}
            <div className="w-full h-4 bg-surface-container rounded-full overflow-hidden flex shadow-inner">
              <div className="h-full bg-danger transition-all duration-300" style={{ width: `${segments.over30.pct}%` }}></div>
              <div className="h-full bg-warning transition-all duration-300" style={{ width: `${segments.mid.pct}%` }}></div>
              <div className="h-full bg-success transition-all duration-300" style={{ width: `${segments.young.pct}%` }}></div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs divide-x divide-border">
              <div>
                <p className="text-secondary">Over 30 Days</p>
                <p className="font-black text-danger mt-1">{segments.over30.pct}% (₦{(segments.over30.amount).toLocaleString()})</p>
              </div>
              <div>
                <p className="text-secondary pl-2">15-30 Days</p>
                <p className="font-black text-warning mt-1">{segments.mid.pct}% (₦{(segments.mid.amount).toLocaleString()})</p>
              </div>
              <div className="border-r border-transparent">
                <p className="text-secondary pl-2">0-14 Days</p>
                <p className="font-black text-success mt-1">{segments.young.pct}% (₦{(segments.young.amount).toLocaleString()})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent logs lists */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-sm">
          <h4 className="font-bold text-base text-on-surface mb-4">Recent Debt logs ledger</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-success/10 text-success rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-on-surface">Mr. Johnson Paid</p>
                  <p className="text-[10px] text-muted">2 hours ago</p>
                </div>
              </div>
              <span className="font-black text-xs text-success">{settings.currencySymbol}12,000</span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-danger/10 text-danger rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-on-surface">New Debt: Alhaji Musa</p>
                  <p className="text-[10px] text-muted">Yesterday</p>
                </div>
              </div>
              <span className="font-black text-xs text-danger">{settings.currencySymbol}5,400</span>
            </div>
            
            {paidDebts.slice(0, 1).map((pd) => (
              <div key={pd.id} className="flex items-center justify-between p-3.5 bg-surface-container-low rounded-xl border border-border/40 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-success/10 text-success rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-on-surface">{pd.customerName} Paid</p>
                    <p className="text-[10px] text-muted">Just now</p>
                  </div>
                </div>
                <span className="font-black text-xs text-success">{settings.currencySymbol}{pd.amountOwed.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </section>


      {/* MODAL 1: ADD NEW CREDIT SALE */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-linear-to-r from-warning/5 to-transparent">
              <h3 className="font-bold text-lg text-warning flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-warning animate-bounce" />
                Record Credit Account
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <form onSubmit={handleCreateDebt} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alhaji Musa Bello"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Mobile Phone Number</label>
                <input 
                  type="text" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 0803 123 4567"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1.5">Amount Owed ({settings.currencySymbol})</label>
                <input 
                  type="number" 
                  value={amountOwed}
                  onChange={(e) => setAmountOwed(e.target.value)}
                  placeholder="e.g. 64500"
                  className="w-full px-4 py-3 bg-surface-container-low border border-border rounded-xl text-body-md outline-none focus:ring-2 focus:ring-warning/20 focus:border-warning transition-all font-bold"
                  required
                  min="1"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-warning text-on-tertiary-fixed hover:brightness-110 font-bold rounded-xl transition-all shadow-md"
                >
                  Add Debt Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* COMPOSER INLINE MODAL: REMINDER VISUAL COMPOSE */}
      {reminderDebt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-lg w-full border border-border overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-[#25D366]/5">
              <h3 className="font-bold text-sm md:text-base text-[#25D366] flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5" />
                WhatsApp Balance Remind composer
              </h3>
              <button onClick={() => setReminderDebt(null)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex gap-4 items-center p-3 bg-surface-container rounded-xl text-sm border border-border/60">
                <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-on-surface">{reminderDebt.customerName}</p>
                  <p className="text-secondary text-xs">Recipient: {reminderDebt.phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Formatted Message Template</label>
                <div className="w-full bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono leading-relaxed select-all">
                  {(() => {
                    let text = settings.whatsappMessageTemplate;
                    text = text.replace(/{customerName}/g, reminderDebt.customerName);
                    text = text.replace(/{amount}/g, reminderDebt.amountOwed.toLocaleString());
                    text = text.replace(/{currency}/g, settings.currencySymbol);
                    text = text.replace(/{dateRecorded}/g, reminderDebt.dateRecorded);
                    text = text.replace(/{days}/g, String(reminderDebt.daysOutstanding));
                    text = text.replace(/{pharmacyName}/g, settings.pharmacyName);
                    return text;
                  })()}
                </div>
              </div>

              <div className="pt-2 flex gap-3 text-sm">
                <button 
                  onClick={() => setReminderDebt(null)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <a 
                  href={generateWhatsAppMessage(reminderDebt)}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  onClick={() => setReminderDebt(null)}
                  className="flex-1 py-3 bg-[#25D366] hover:brightness-105 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM PAID DEBT */}
      {confirmPaidDebt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-success/5">
              <h3 className="font-bold text-base text-success flex items-center gap-1.5">
                <CheckCircle className="w-5 h-5 text-success" />
                Confirm Debt Settlement
              </h3>
              <button onClick={() => setConfirmPaidDebt(null)} className="p-1 hover:bg-surface-container rounded-lg">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface leading-normal">
                Are you sure you want to mark the outstanding balance of <strong className="text-success text-base">{settings.currencySymbol}{confirmPaidDebt.amountOwed.toLocaleString()}</strong> for <strong>{confirmPaidDebt.customerName}</strong> as <strong>Paid</strong>?
              </p>
              
              <p className="text-secondary text-xs leading-relaxed bg-surface-container p-3 rounded-xl border border-border/40">
                This will move this ledger item to the historical paid logs and adjust current total debts outstanding.
              </p>

              <div className="pt-2 flex gap-3 text-sm">
                <button 
                  type="button"
                  onClick={() => setConfirmPaidDebt(null)}
                  className="flex-1 py-3 border border-border hover:bg-surface-container text-secondary rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    onMarkPaid(confirmPaidDebt.id);
                    setConfirmPaidDebt(null);
                  }}
                  className="flex-1 py-3 bg-success hover:brightness-105 text-white font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Yes, Mark Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
