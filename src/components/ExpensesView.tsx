import React from 'react';
import { 
  Save, 
  X, 
  Trash2, 
  Wallet, 
  TrendingUp, 
  Receipt, 
  Layers, 
  Calendar, 
  Tag, 
  PlusCircle, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ExpenseItem, AppSettings } from '../types';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (name: string, amount: number, category: string, date: string, notes: string) => void;
  onDeleteExpense: (id: string) => void;
  settings: AppSettings;
}

const CATEGORIES = [
  'Rent',
  'Generator & Fuel',
  'Staff Salary',
  'Utilities',
  'Packaging',
  'Transport',
  'Government Fees',
  'Miscellaneous'
];

export default function ExpensesView({
  expenses,
  onAddExpense,
  onDeleteExpense,
  settings
}: ExpensesViewProps) {
  const [name, setName] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [date, setDate] = React.useState(() => {
    // Current local time: 2026-05-25 (formatted as YYYY-MM-DD for input)
    return '2026-05-25';
  });
  const [notes, setNotes] = React.useState('');
  
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // Daily Budget set to a standard 100,000 default or whatever fits nicely
  const DAILY_BUDGET_LIMIT = 100000;

  // Calculate today's expenses dynamically to subtract from Daily Budget
  const todayExpensesSum = React.useMemo(() => {
    return expenses
      .filter(exp => exp.date === '2026-05-25')
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const dailyBudgetLeft = React.useMemo(() => {
    const calculated = DAILY_BUDGET_LIMIT - todayExpensesSum;
    return calculated < 0 ? 0 : calculated;
  }, [todayExpensesSum]);

  const monthToDateTotal = React.useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter an expense name');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than zero');
      return;
    }
    if (!category) {
      setErrorMessage('Please pick an expense category');
      return;
    }
    if (!date) {
      setErrorMessage('Please enter a valid payment date');
      return;
    }

    onAddExpense(name.trim(), parsedAmount, category, date, notes.trim());
    
    // Clear Form fields
    setName('');
    setAmount('');
    setCategory('');
    setNotes('');
    setDate('2026-05-25');

    // Show banner check
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const handleClear = () => {
    setName('');
    setAmount('');
    setCategory('');
    setNotes('');
    setDate('2026-05-25');
    setErrorMessage('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top success alert Banner */}
      {showSuccess && (
        <div id="expense-success-toast" className="bg-success/15 border border-success/30 text-success px-4 py-3 rounded-xl flex items-center justify-between gap-2 text-xs font-bold animate-bounce shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Operational expense documented and integrated to Monthly profit/loss counts successfully!</span>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-success hover:opacity-85">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Alert & Validation warnings */}
      {errorMessage && (
        <div className="bg-danger/15 border border-danger/30 text-danger px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-bold shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Content Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Record Expense Form Sheet */}
        <div className="lg:col-span-7 bg-surface-container-lowest dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-xl font-headline-page font-extrabold flex items-center gap-2 text-primary">
              <PlusCircle className="w-6 h-6 text-primary" />
              <span>Log New Expenditure</span>
            </h3>
            <p className="text-xs text-secondary mt-1">
              Keep track of your pharmacy&apos;s operational costs accurately for profit &amp; loss compliance reports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field Row 1: Name and Amount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Expense Name</label>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fuel for generator"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs md:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Amount ({settings.currencySymbol})</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-secondary text-xs">{settings.currencySymbol}</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs md:text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                    required
                    min="1"
                    step="any"
                  />
                </div>
              </div>
            </div>

            {/* Field Row 2: Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Category</label>
                <div className="relative">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs md:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs md:text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Field Row 3: Notes area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Notes (Optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Provide additional details regarding this operational cost..."
                rows={4}
                className="w-full p-4 bg-surface-container-low dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs md:text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface resize-none"
              />
            </div>

            {/* Actions button strip */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border dark:border-zinc-800 mt-6">
              <button 
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-container text-on-primary py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.98] transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Expense Record</span>
              </button>
              
              <button 
                type="button"
                onClick={handleClear}
                className="flex-1 bg-surface-container dark:bg-zinc-800 border border-border dark:border-zinc-700 hover:bg-surface-container-high dark:hover:bg-zinc-700 text-secondary dark:text-zinc-300 py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all"
              >
                <X className="w-4 h-4" />
                <span>Clear Form</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Hand side: stats bento card decks and lists */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Stats Bento Cards Layout */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Budget Left Deck */}
            <div className="bg-surface-container-low dark:bg-zinc-900 border border-border dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Daily Budget Remaining</p>
                <p className="text-lg md:text-xl font-black text-on-surface">{settings.currencySymbol}{dailyBudgetLeft.toLocaleString()}</p>
                <p className="text-[10px] text-muted">Daily spending limit capped at ₦100,000</p>
              </div>
            </div>

            {/* Month-to-Date Expense Deck */}
            <div className="bg-danger/5 border border-danger/10 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center text-danger shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-danger uppercase tracking-wider">Month-To-Date Expenses</p>
                <p className="text-lg md:text-xl font-black text-danger">{settings.currencySymbol}{monthToDateTotal.toLocaleString()}</p>
                <p className="text-[10px] text-muted">Accumulated operational costs sum</p>
              </div>
            </div>

            {/* Total items registered ledger deck */}
            <div className="bg-surface-container-low dark:bg-zinc-900 border border-border dark:border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary shrink-0">
                <Receipt className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-wider">Transactions Count</p>
                <p className="text-lg md:text-xl font-black text-on-surface">{expenses.length} Records</p>
                <p className="text-[10px] text-muted">All logs saved inside client container</p>
              </div>
            </div>

          </div>

          {/* Dynamic Ledger table listing recent recorded elements */}
          <div className="bg-surface-container-lowest dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border dark:border-zinc-800 flex justify-between items-center bg-surface-container-low dark:bg-zinc-800">
              <h4 className="font-extrabold text-xs text-on-surface uppercase tracking-wider">Recent Expense Log Lines</h4>
              <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full">{expenses.length} items</span>
            </div>

            <div className="divide-y divide-border dark:divide-zinc-800 max-h-72 overflow-y-auto">
              {expenses.length === 0 ? (
                <p className="text-center py-12 text-secondary text-xs font-semibold">No recorded expenditures listed.</p>
              ) : (
                [...expenses].reverse().map((exp) => (
                  <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="space-y-1 pr-4 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-bold text-xs text-on-surface truncate max-w-45">{exp.name}</p>
                        {exp.category && (
                          <span className="text-[8px] font-black bg-secondary/15 text-secondary px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                            {exp.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted">
                        <span>{exp.date || 'May 25, 2026'}</span>
                        {exp.notes && <span className="truncate max-w-30" title={exp.notes}>• {exp.notes}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-black text-xs text-danger">{settings.currencySymbol}{exp.amount.toLocaleString()}</span>
                      <button 
                        onClick={() => {
                          if (confirm(`Do you want to permanently delete this expense record: "${exp.name}"?`)) {
                            onDeleteExpense(exp.id);
                          }
                        }}
                        className="text-muted hover:text-danger p-1 rounded hover:bg-danger/10 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
