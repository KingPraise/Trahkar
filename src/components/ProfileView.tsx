import React, { useRef } from 'react';
import { 
  ChevronRight, 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Lock, 
  Settings, 
  Save, 
  Globe, 
  Sliders, 
  CheckCircle2, 
  Info,
  Award,
  Verified
} from 'lucide-react';
import { AppSettings, Screen } from '../types';

interface ProfileViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (screen: Screen) => void;
}

const DEFAULT_PROFILE_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuC-yL4buIXAyosEj1aq6HB4gP5QV3nXFbXDrwI856jqnYWbHgJsMMhMnFTO3KUlsfOqD_Hv1M9bDf1I-PHgYxBShYJHhCYzOL3gEDPmV-I1l4isY7sN6x3IZiQf-pshDDeMGTRBc_yYBdgruL9CZJ9ErKBhcbFuPwceTu3K1-FOqxkEfz3qJHa3bHmWXxLp4gZoqjcOHaOs8TEj1O8U0SPopL4O0PnWHJFWz9C1fdCWaecQuGaIxtGnnhSD-U3WsLZ2um-9n_ctw8A2";

export default function ProfileView({
  settings,
  onUpdateSettings,
  onNavigate
}: ProfileViewProps) {
  const [formSettings, setFormSettings] = React.useState<AppSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = React.useState('');
  
  const imageInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFormSettings({ ...settings });
  }, [settings]);

  const handleChange = (key: keyof AppSettings, value: any) => {
    setFormSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      onUpdateSettings(formSettings);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 850);
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        // We will store the pharmacist profile image under settings as an extended property, OR mock store it.
        // Let's use custom property 'logoUrl' as the primary image or a fallback if they want to override, 
        // but let's persist it locally using an image key or custom Settings property if preferred!
        // To keep clean structure, we can store it inside a custom field on settings, say pharmacistImage.
        // Let's store inside 'logoUrl' or a dedicated custom field in localSettings.
        handleChange('logoUrl', uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match!');
      return;
    }
    setPasswordError('');
    setPasswordModalOpen(false);
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    // Trigger tiny toast
    alert("Password successfully rotated and updated!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-24">
      
      {/* Toast state notifications */}
      {saveSuccess && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-50 bg-success text-white border border-success/30 p-4 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce max-w-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Profile Saved Successfully!</p>
            <p className="opacity-90">All credential records and alerting toggles are now live.</p>
          </div>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <div className="flex items-center gap-2 text-secondary text-xs font-bold uppercase tracking-wider">
        <span className="cursor-pointer hover:text-primary transition-colors" onClick={() => onNavigate('settings')}>Settings</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-primary font-black">Profile &amp; Account</span>
      </div>

      {/* Profile Header Hero Panel */}
      <div className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          
          <div className="relative group shrink-0">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface shadow-xl bg-surface-container-low">
              <img 
                alt="Pharmacist portrait" 
                className="w-full h-full object-cover" 
                src={formSettings.logoUrl || DEFAULT_PROFILE_IMAGE} 
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={imageInputRef} 
              onChange={handleProfileImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          <div className="space-y-2 grow">
            <h2 className="text-xl md:text-2xl font-black text-on-surface">
              {formSettings.pharmacistName || 'Dr. Adebayo Ogunwale'}
            </h2>
            <p className="text-sm font-semibold text-secondary">
              {formSettings.specialty || 'Community Pharmacy'} / Owner
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-1.5">
              <span className="px-3.5 py-1 bg-success/15 text-success rounded-full text-xs font-bold flex items-center gap-1.5 border border-success/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                <span>Verified Account</span>
              </span>
              <span className="px-3.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border border-primary/10">
                <Award className="w-3.5 h-3.5 text-primary" />
                <span>License: {formSettings.pharmacyLicense || 'PCN/2023/4852'}</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Content for form panels */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns (Form groups) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL INFORMATION */}
          <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-container-low/30 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-wider text-on-surface">Personal Information</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="text" 
                    value={formSettings.pharmacistName || 'Dr. Adebayo Ogunwale'}
                    onChange={(e) => handleChange('pharmacistName', e.target.value)}
                    className="w-full border border-border bg-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="email" 
                    value={formSettings.emailAddress || 'a.ogunwale@citycentralpharma.ng'}
                    onChange={(e) => handleChange('emailAddress', e.target.value)}
                    className="w-full border border-border bg-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="tel" 
                    value={formSettings.phoneNumber || '+234 801 234 5678'}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="w-full border border-border bg-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Location / Territory</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
                  <input 
                    type="text" 
                    value={formSettings.physicalLocation || 'Ikeja, Lagos State'}
                    onChange={(e) => handleChange('physicalLocation', e.target.value)}
                    className="w-full border border-border bg-surface rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PROFESSIONAL CREDENTIALS */}
          <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden\">
            <div className="px-6 py-4 border-b border-border bg-surface-container-low/30 flex items-center gap-2\">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-wider text-on-surface">Professional Credentials</h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Pharmacy License Number</label>
                <input 
                  type="text" 
                  value={formSettings.pharmacyLicense || 'PCN/2023/4852'}
                  onChange={(e) => handleChange('pharmacyLicense', e.target.value)}
                  className="w-full border border-border bg-surface rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Specialty Sector</label>
                <select 
                  value={formSettings.specialty || 'Community Pharmacy'} 
                  onChange={(e) => handleChange('specialty', e.target.value)}
                  className="w-full border border-border bg-surface rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer font-bold"
                >
                  <option value="Community Pharmacy">Community Pharmacy</option>
                  <option value="Clinical Pharmacy">Clinical Pharmacy</option>
                  <option value="Industrial Pharmacy">Industrial Pharmacy</option>
                  <option value="Academic Pharmacy">Academic Pharmacy</option>
                </select>
              </div>
            </div>
          </section>

        </div>

        {/* Right Columns (Security & toggles) */}
        <div className="space-y-6">
          
          {/* ACCOUNT SECURITY */}
          <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden\">
            <div className="px-6 py-4 border-b border-border bg-surface-container-low/30 flex items-center gap-2\">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-wider text-on-surface">Account Security</h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted font-bold">Last password change: 3 months ago</p>
                <button 
                  type="button"
                  onClick={() => setPasswordModalOpen(true)}
                  className="w-full border border-primary text-primary hover:bg-primary/5 transition-all py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Lock className="w-4 h-4 shrink-0 animate-pulse" />
                  <span>Change Password</span>
                </button>
              </div>

              <hr className="border-border" />

              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Two-Factor Authentication</span>
                  <span className="text-[10px] text-muted">Protect account with SMS OTP verification</span>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={formSettings.twoFactorAuth !== false}
                    onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>

          {/* PREFERENCES & CHANNELS */}
          <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden\">
            <div className="px-6 py-4 border-b border-border bg-surface-container-low/30 flex items-center gap-2\">
              <Sliders className="w-5 h-5 text-primary" />
              <h3 className="font-black text-sm uppercase tracking-wider text-on-surface">Preferences</h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-secondary font-bold uppercase">Language</label>
                <select 
                  value={formSettings.language || 'English (Nigeria)'}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full border border-border bg-surface rounded-xl p-2.5 text-sm focus:ring-1 focus:ring-primary cursor-pointer font-semibold"
                >
                  <option value="English (Nigeria)">English (Nigeria)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                
                {/* Switch 1: Inventory alerts */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-on-surface">Inventory Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formSettings.inventoryAlerts !== false}
                      onChange={(e) => handleChange('inventoryAlerts', e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Switch 2: Sales Summary */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-on-surface">Sales Summaries</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formSettings.salesSummaries !== false}
                      onChange={(e) => handleChange('salesSummaries', e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Switch 3: Security notifications */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-on-surface">Security Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={formSettings.securityNotifications === true}
                      onChange={(e) => handleChange('securityNotifications', e.target.checked)}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-surface-container-high rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

              </div>

            </div>
          </section>

        </div>

      </form>

      {/* Persistent sticky footer save action bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-surface-container-lowest border-t border-border p-4 flex justify-end items-center gap-3 z-40 shadow-lg animate-in slide-in-from-bottom duration-300">
        <button 
          type="button" 
          onClick={() => onNavigate('settings')}
          className="px-6 py-2.5 text-secondary font-bold text-xs hover:bg-surface-container-high rounded-xl transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button 
          type="button" 
          onClick={() => handleSave()}
          disabled={isSaving}
          className="px-8 py-2.5 bg-primary text-white font-bold text-xs rounded-xl shadow-md hover:brightness-95 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 shrink-0" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Change password modal component */}
      {passwordModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <form onSubmit={handlePasswordSubmit} className="bg-surface-container-lowest w-full max-w-sm rounded-[20px] p-6 shadow-2xl border border-border space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="font-black text-base text-primary flex items-center gap-1.5">
              <Lock className="w-5 h-5 text-primary" />
              <span>Change Security Password</span>
            </h3>
            <p className="text-xs text-secondary">
              Update password token key for active billing and shelf logs access authentication.
            </p>

            {passwordError && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-xs p-2.5 rounded-xl font-bold">
                ⚠️ {passwordError}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-secondary">Current Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                  className="w-full border border-border bg-surface rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-secondary">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full border border-border bg-surface rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-secondary">Confirm New Password</label>
                <input 
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full border border-border bg-surface rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-1 focus:ring-primary text-on-surface"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                type="button"
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-secondary rounded-xl hover:bg-surface-container-low"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:brightness-95 cursor-pointer shadow-sm"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
