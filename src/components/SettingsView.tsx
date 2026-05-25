import React, { useRef } from 'react';
import { 
  Building,
  Mail,
  MapPin,
  Phone,
  Palette,
  Upload,
  Trash2,
  Database,
  FileSpreadsheet,
  Trash,
  Settings,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  Lock,
  History,
  CheckCircle2,
  Check,
  Save,
  Sliders,
  DollarSign,
  UserCheck,
  Download
} from 'lucide-react';
import { AppSettings, Screen, Transaction } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetDatabase: () => void;
  onImportBackup: (importedData: any) => boolean;
  onExportBackup: () => any;
  onNavigate: (screen: Screen) => void;
  transactions?: Transaction[];
}

const DEFAULT_LOGO = "https://lh3.googleusercontent.com/aida-public/AB6AXuBBAJMtdX0qlno-yQyodnge1VdHUpVoCd24T6e4xitamkNrwK1Z1Qwrv5iNWbjavGJnkWPuvwKt4hJTmRHXVXWVFZRpqQ49ddTi2h58LLha-wPAdrdlPmQtLTzFVfgV9CtMAQHFos-1sRDGjgC14EoTj6eWaL2RfpWjNUcIfeSUuKLwRwrDfXLxMk3rkqdI28R5cZnFi08reaYvrKVCZDNamWmVJnpRxjEEYHtR3Tb8uQ5g15UqqaNi1KdGkpAwJ6EgJjVZ4JshqqFP";

export default function SettingsView({
  settings,
  onUpdateSettings,
  onResetDatabase,
  onImportBackup,
  onExportBackup,
  onNavigate,
  transactions = []
}: SettingsViewProps) {
  const [formSettings, setFormSettings] = React.useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [importStatus, setImportStatus] = React.useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupImportInputRef = useRef<HTMLInputElement>(null);

  // Sync state if settings prop updates externally
  React.useEffect(() => {
    setFormSettings({ ...settings });
  }, [settings]);

  // Handle local state updates
  const handleChange = (key: keyof AppSettings, value: any) => {
    setFormSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Submit and update changes in main context
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateSettings(formSettings);
    setSaveSuccess(true);
    
    // Apply dynamic classes on standard dark/light bodies
    if (formSettings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    setTimeout(() => {
      setSaveSuccess(false);
    }, 4500);
  };

  // Export all application data as standard client-side JSON download
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(onExportBackup(), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${settings.pharmacyName.toLowerCase().replace(/\s+/g, '-')}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Export Sales Ledger as CSV structure
  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      alert("No sales transaction records available to export as CSV.");
      return;
    }
    const headers = ['Transaction ID', 'Date', 'Time', 'Item Name', 'Quantity', 'Unit Price', 'Amount', 'Payment Method'];
    const csvRows = [headers.join(',')];
    
    transactions.forEach(tx => {
      const row = [
        tx.id,
        tx.date,
        tx.time,
        `"${(tx.itemName || '').replace(/"/g, '""')}"`,
        tx.quantity,
        tx.unitPrice,
        tx.amount,
        tx.paymentMethod
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const exportName = `${settings.pharmacyName.toLowerCase().replace(/\s+/g, '-')}-sales-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("href", url);
    link.setAttribute("download", exportName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File Upload base64 read for Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        handleChange('logoUrl', uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Restore fallback database JSON file upload changes
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          const success = onImportBackup(parsed);
          if (success) {
            setImportStatus({
              type: 'success',
              text: 'Database successfully imported from JSON backup!'
            });
            setTimeout(() => setImportStatus(null), 5000);
          } else {
            setImportStatus({
              type: 'error',
              text: 'Failed to restore. Invalid data format in the backup file.'
            });
          }
        } catch (err) {
          setImportStatus({
            type: 'error',
            text: 'Parsing error. Ensure you uploaded a valid Favour Pharmacy JSON file.'
          });
        }
      };
    }
  };

  const placeholderReplacements = [
    { tag: '{customerName}', description: 'Customer Name' },
    { tag: '{amount}', description: 'Amount Owed' },
    { tag: '{currency}', description: 'Currency (₦)' },
    { tag: '{dateRecorded}', description: 'Date of Debt' },
    { tag: '{days}', description: 'Days Age' },
    { tag: '{pharmacyName}', description: 'Pharmacy Name' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Header Controls bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border dark:border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-black text-primary flex items-center gap-2">
            Settings &amp; Profile
          </h3>
          <p className="text-xs text-secondary dark:text-zinc-400 mt-0.5">
            Configure contact parameters, inventory limits, automated sharing templates, and storage metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setFormSettings({ ...settings })}
            className="px-4 py-2 border border-border dark:border-zinc-800 text-secondary dark:text-zinc-300 bg-surface-container-lowest dark:bg-zinc-900 rounded-xl text-xs font-bold hover:bg-surface-container-low transition-all cursor-pointer"
          >
            Discard
          </button>
          <button 
            type="button" 
            onClick={() => handleSave()}
            className="px-5 py-2.5 bg-primary text-white text-xs font-black rounded-xl hover:brightness-95 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-success/10 border border-success/30 text-success p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold animate-sine-tension shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          <div>
            <p className="font-bold">Settings Updated Successfully!</p>
            <p className="text-[11px] text-success/80">All physical and virtual parameters have been synchronized into localStorage.</p>
          </div>
        </div>
      )}

      {importStatus && (
        <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold border ${
          importStatus.type === 'success' 
            ? 'bg-success/15 border-success/30 text-success' 
            : 'bg-danger/15 border-danger/30 text-danger'
        }`}>
          <div className="shrink-0 mt-0.5 font-bold">⚠️</div>
          <span>{importStatus.text}</span>
        </div>
      )}

      {/* Pharmacist Profile Redirect Banner */}
      <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-primary/35 bg-surface-container-low">
            <img 
              src={settings.logoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAb8iq1aJViWmtMCyNKLl2dk7L0AyyMDa8qtg5GkjgsG6HPXkpRA1ZQ8Xm9y3NBpdndbt6ClKg_oIuXMj7F2Y-1uGBqH2Wb4MoYq0b3aljHGJ2wZerPZQ1u1_tpN-TLsvPitMwO4QmvItZLkoAeZTIq393nket77de4qoXHq4CnutHXqmGMB8YS9G89aKfstxMN7x2NwQbI5XwTwf89I0YtaSkOSHOyTbFi8RA07F2TSi8xbBIAcNdWP9mqeYXmFR5ZtvSQnUpiGG1A"} 
              alt="Pharmacist headshot" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="font-black text-sm text-on-surface">Dr. Adebayo Ogunwale (Pharmacist Credentials)</h4>
            <p className="text-xs text-secondary dark:text-zinc-400">Chief Pharmacist &amp; Owner Profile, verified PCN licenses, SMS 2FA, and language preferences.</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => onNavigate('profile')}
          className="bg-primary hover:brightness-95 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer hover:shadow-md active:scale-95"
        >
          Manage Account &amp; Profile
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Profile & Brand */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Pharmacy Profile Card */}
          <section className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-border dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 dark:border-zinc-800 pb-3">
              <Building className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">Pharmacy Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Pharmacy Name</label>
                <input 
                  type="text" 
                  value={formSettings.pharmacyName}
                  onChange={(e) => handleChange('pharmacyName', e.target.value)}
                  className="border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  value={formSettings.emailAddress || 'contact@favourpharma.com'}
                  onChange={(e) => handleChange('emailAddress', e.target.value)}
                  className="border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Physical Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="text" 
                    value={formSettings.physicalLocation || '12 Ring Road, Ibadan'}
                    onChange={(e) => handleChange('physicalLocation', e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Phone Number</label>
                <input 
                  type="tel" 
                  value={formSettings.phoneNumber || '+234 802 123 4567'}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Business Registration Number (Optional)</label>
                <input 
                  type="text" 
                  value={formSettings.businessRegNo || ''}
                  placeholder="RC-000000"
                  onChange={(e) => handleChange('businessRegNo', e.target.value)}
                  className="border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Active Professional Username</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formSettings.adminUsername}
                    onChange={(e) => handleChange('adminUsername', e.target.value)}
                    className="w-full border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Brand Identity Card */}
          <section className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-border dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 dark:border-zinc-800 pb-3">
              <Palette className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">Brand Identity</h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="relative group cursor-pointer border-2 border-dashed border-outline-variant dark:border-zinc-700 hover:border-primary dark:hover:border-primary rounded-2xl overflow-hidden transition-all w-28 h-28 shrink-0 flex items-center justify-center bg-surface dark:bg-zinc-800"
              >
                <img 
                  alt="Pharmacy Brand Logo"
                  src={formSettings.logoUrl || DEFAULT_LOGO} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                  <Upload className="w-4 h-4" />
                  <span>Update</span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left space-y-1.5">
                <h3 className="text-sm font-bold text-on-surface">Pharmacy Digital Logo</h3>
                <p className="text-xs text-on-surface-variant dark:text-zinc-400 leading-relaxed">
                  Upload your brand logo (PNG, JPG). This image file is used across receipts, debts reminder timelines, and header consoles.
                </p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1.5">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New</span>
                  </button>
                  {formSettings.logoUrl && formSettings.logoUrl !== DEFAULT_LOGO && (
                    <button 
                      type="button" 
                      onClick={() => handleChange('logoUrl', DEFAULT_LOGO)}
                      className="border border-danger/20 hover:bg-danger/5 text-danger font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Reset Logo
                    </button>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            </div>
          </section>

          {/* WhatsApp Reminder Template Card */}
          <section className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-border dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 dark:border-zinc-800 pb-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">WhatsApp Automated Reminders</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold uppercase tracking-wide">Message Template Script</label>
                <textarea 
                  value={formSettings.whatsappMessageTemplate}
                  onChange={(e) => handleChange('whatsappMessageTemplate', e.target.value)}
                  rows={4}
                  className="w-full p-4 bg-surface dark:bg-zinc-800 border border-border dark:border-zinc-700 rounded-xl text-xs font-mono leading-relaxed outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter custom template..."
                  required
                />
              </div>

              <div className="p-4 bg-surface dark:bg-zinc-800 rounded-xl border border-border dark:border-zinc-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span>Available Replacement Tokens (Case Sensitive):</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {placeholderReplacements.map((tk) => (
                    <div key={tk.tag} className="p-2 bg-surface-container-lowest dark:bg-zinc-900 rounded-lg border border-border/50 dark:border-zinc-800/80 flex flex-col text-left">
                      <code className="text-primary font-bold text-[10px] sm:text-xs select-all text-center sm:text-left">{tk.tag}</code>
                      <span className="text-[9px] text-muted tracking-tight mt-0.5">{tk.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Inventory, Data, Backup */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* System Operations Card */}
          <section className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-border dark:border-zinc-800 space-y-6">
            <div className="flex items-center gap-2 border-b border-border/50 dark:border-zinc-800 pb-3">
              <Sliders className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">System Operations</h2>
            </div>

            {/* Inventory control settings */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-primary tracking-wider uppercase">Inventory Control</h3>
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface">Global Reorder Level</p>
                  <p className="text-[11px] text-on-surface-variant dark:text-zinc-400">Default warning flag trigger threshold</p>
                </div>
                <input 
                  type="number" 
                  value={formSettings.lowStockThreshold}
                  min="0"
                  onChange={(e) => handleChange('lowStockThreshold', Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-3 py-2 text-right font-black text-primary text-sm focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold">Preferred Unit of Measure</label>
                <select 
                  value={formSettings.preferredUnitOfMeasure || 'Capsules'}
                  onChange={(e) => handleChange('preferredUnitOfMeasure', e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                >
                  <option value="Capsules">Capsules</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Syrup (ml)">Syrup (ml)</option>
                  <option value="Sachets">Sachets</option>
                  <option value="Cartons">Cartons</option>
                  <option value="Sachets / Pieces">Sachets / Pieces</option>
                  <option value="Boxes / Cartons">Boxes / Cartons</option>
                  <option value="Bottles (Liquid)">Bottles (Liquid)</option>
                  <option value="Injections / Ampoules">Injections / Ampoules</option>
                </select>
              </div>
            </div>

            <hr className="border-border dark:border-zinc-800" />

            {/* Sales Settings */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-primary tracking-wider uppercase">Sales &amp; Receipts</h3>
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-on-surface">Auto WhatsApp sharing</p>
                  <p className="text-[11px] text-on-surface-variant dark:text-zinc-400">Generate sharing links automatically on checkout</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formSettings.whatsappSharing !== false} 
                    onChange={(e) => handleChange('whatsappSharing', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container-high dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold">Default Currency Symbol</label>
                <select 
                  value={formSettings.currencySymbol}
                  onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  className="w-full border border-outline-variant dark:border-zinc-700 bg-surface dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                >
                  <option value="₦">Nigerian Naira (₦)</option>
                  <option value="$">US Dollar ($)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="€">Euro (€)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant dark:text-zinc-400 font-bold">Console Appearance (Theme)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleChange('themeMode', 'light')}
                    className={`py-2.5 px-3 border text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                      formSettings.themeMode === 'light'
                        ? 'bg-primary/10 text-primary border-primary/25 font-black'
                        : 'border-border dark:border-zinc-800 text-secondary dark:text-zinc-300 hover:bg-surface-container-low dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    ☀️ Light Theme
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('themeMode', 'dark')}
                    className={`py-2.5 px-3 border text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                      formSettings.themeMode === 'dark'
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-700 font-black'
                        : 'border-border dark:border-zinc-800 text-secondary dark:text-zinc-300 hover:bg-surface-container-low dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    🌙 Dark Theme
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Backup & CSV Data Management Card */}
          <section className="bg-surface-container-lowest dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-border dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 dark:border-zinc-800 pb-3">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-black text-on-surface uppercase tracking-wider">Data Management</h2>
            </div>

            <div className="bg-surface-container-low dark:bg-zinc-800 p-4 rounded-xl border border-border/40 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Local Database Status</p>
                  <p className="text-[10px] text-on-surface-variant dark:text-zinc-400">Offline persistence active</p>
                </div>
              </div>
              <span className="text-[10px] bg-success/15 text-success px-3 py-1 rounded-full font-black uppercase tracking-wider">Healthy</span>
            </div>

            {/* Backups Export/Import row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button 
                type="button"
                onClick={handleExportJSON}
                className="flex flex-col items-center justify-center p-4 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-800/40 rounded-xl transition-all text-center gap-1.5 cursor-pointer"
              >
                <Download className="w-5 h-5 text-primary shrink-0" />
                <span className="text-[11px] font-bold">Export JSON</span>
              </button>

              <label 
                className="flex flex-col items-center justify-center p-4 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-800/40 rounded-xl transition-all text-center gap-1.5 cursor-pointer text-on-surface"
              >
                <Upload className="w-5 h-5 text-success shrink-0" />
                <span className="text-[11px] font-bold">Import JSON</span>
                <input 
                  type="file" 
                  ref={backupImportInputRef}
                  accept=".json" 
                  onChange={handleImportFileChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <hr className="border-border dark:border-zinc-800" />

            {/* Client-side CSV generation */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={handleExportCSV}
                className="flex flex-col items-center justify-center py-4 px-3 border border-outline-variant dark:border-zinc-800 hover:bg-surface-container-high dark:hover:bg-zinc-800/40 rounded-xl transition-all text-center gap-1.5 group cursor-pointer"
              >
                <FileSpreadsheet className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                <span className="text-[11px] font-bold">Export Sales CSV</span>
              </button>

              <button 
                type="button" 
                onClick={() => onNavigate('clearcache')}
                className="flex flex-col items-center justify-center py-4 px-3 border border-danger/20 hover:bg-danger/5 rounded-xl transition-all text-center gap-1.5 group cursor-pointer text-danger"
              >
                <Trash className="w-5 h-5 text-danger" />
                <span className="text-[11px] font-bold">Clear Cache</span>
              </button>
            </div>

            <div className="text-center pt-2 border-t border-border/80 dark:border-zinc-800/80">
              <button 
                type="button" 
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>View Dashboard Activity Log</span>
              </button>
            </div>

          </section>

        </div>

      </form>

    </div>
  );
}
