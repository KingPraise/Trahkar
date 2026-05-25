import React from 'react';
import { 
  AlertTriangle, 
  Info, 
  Trash2, 
  ArrowLeft, 
  Loader2,
  Database,
  ArrowRight
} from 'lucide-react';
import { AppSettings } from '../types';

interface ClearCacheProps {
  transactionsCount: number;
  debtsCount: number;
  drugsCount: number;
  onClearAllData: () => void;
  onCancel: () => void;
  settings: AppSettings;
}

export default function ClearCacheView({
  transactionsCount,
  debtsCount,
  drugsCount,
  onClearAllData,
  onCancel,
  settings
}: ClearCacheProps) {
  const [confirmationText, setConfirmationText] = React.useState('');
  const [isClearing, setIsClearing] = React.useState(false);

  // Safety confirmation validation check
  const isConfirmed = confirmationText.trim().toUpperCase() === 'RESET';

  const handleClearAction = () => {
    if (!isConfirmed || isClearing) return;
    
    setIsClearing(true);

    // Dynamic delay to simulate robust database/cache wipe actions
    setTimeout(() => {
      onClearAllData();
      setIsClearing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8">
      {/* Focus Container */}
      <main className="w-full max-w-[600px] bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl shadow-xl border border-border dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header / Severe Warning Section */}
        <header className="bg-danger p-6 md:p-8 text-center text-white flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-white" style={{ fill: 'currentColor' }} />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight mb-2">Permanently Clear All Local Data?</h1>
          <p className="text-xs md:text-sm text-white/95 max-w-sm leading-relaxed">
            This is a high-stakes administrative action that cannot be undone in this local container.
          </p>
        </header>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* Metadata counts at Risk section */}
          <section>
            <h2 className="text-xs font-bold text-secondary dark:text-zinc-400 uppercase tracking-wider mb-3">
              Inventory &amp; Sales Ledger at Risk
            </h2>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-surface-container-low dark:bg-zinc-800 p-4 rounded-xl border border-border dark:border-zinc-700 flex flex-col items-center justify-center text-center">
                <span className="text-lg md:text-xl font-black text-danger tracking-tight">{transactionsCount}</span>
                <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Sales Records</span>
              </div>
              <div className="bg-surface-container-low dark:bg-zinc-800 p-4 rounded-xl border border-border dark:border-zinc-700 flex flex-col items-center justify-center text-center">
                <span className="text-lg md:text-xl font-black text-danger tracking-tight">{debtsCount}</span>
                <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Active Debts</span>
              </div>
              <div className="bg-surface-container-low dark:bg-zinc-800 p-4 rounded-xl border border-border dark:border-zinc-700 flex flex-col items-center justify-center text-center">
                <span className="text-lg md:text-xl font-black text-danger tracking-tight">{drugsCount}</span>
                <span className="text-[10px] text-muted uppercase tracking-wider mt-1">Inventory Items</span>
              </div>
            </div>
          </section>

          {/* Explanation Alert card */}
          <section className="bg-danger/5 border border-danger/20 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-danger shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant dark:text-zinc-300 leading-relaxed font-semibold">
              Clearing the local cache will immediately delete all offline sales history, active customer debt accounts, activities timeline logs, and registered operational expenditures. The system will revert entirely back to an <strong className="text-danger">empty factory template demo state</strong>.
            </p>
          </section>

          {/* Safety Check Confirmation fields */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label 
                className="block text-xs font-bold text-on-surface uppercase tracking-wider" 
                htmlFor="confirmation-input"
              >
                Safety Check Authorization
              </label>
              <p className="text-xs text-secondary mt-1">
                To authorize this clearance action, please type <span className="font-bold text-danger">RESET</span> in the box below:
              </p>
              
              <input 
                id="confirmation-input"
                type="text" 
                autoComplete="off"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type RESET to confirm"
                className="w-full px-4 py-3 rounded-xl border border-outline/50 bg-surface text-center font-black tracking-widest text-sm focus:border-danger focus:ring-2 focus:ring-danger/20 outline-none transition-all dark:bg-zinc-800 select-all"
                disabled={isClearing}
              />
            </div>

            {/* Form button triggers */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={handleClearAction}
                disabled={!isConfirmed || isClearing}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow ${
                  isConfirmed && !isClearing
                    ? 'bg-danger text-white hover:bg-danger/90 active:scale-[0.99] cursor-pointer'
                    : 'bg-muted/30 text-muted cursor-not-allowed opacity-50'
                }`}
              >
                {isClearing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Wiping Application Cache Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Clear Everything Permanently</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onCancel}
                disabled={isClearing}
                className="w-full py-3.5 px-6 bg-transparent hover:bg-surface-container-high border border-primary/35 text-primary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel &amp; Retain Data Records</span>
              </button>
            </div>
          </form>

        </div>

        {/* System footer status */}
        <footer className="bg-surface-container-low dark:bg-zinc-800/60 p-4 border-t border-border dark:border-zinc-800 flex justify-between items-center px-6 md:px-8 text-[11px] text-muted">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="font-medium">Active Database Cache: 14.2 MB</span>
          </div>
          <span className="italic font-medium">{settings.pharmacyName} v2.4.1</span>
        </footer>

      </main>
    </div>
  );
}
