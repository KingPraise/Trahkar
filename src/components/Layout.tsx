import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle,
  Plus,
  Menu,
  HeartPlus,
  Coins,
  User,
  Users
} from 'lucide-react';
import { Screen, AppSettings } from '../types';

interface LayoutProps {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
  children: React.ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewSaleClick: () => void;
  debtCount: number;
  settings: AppSettings;
}

export default function Layout({
  currentScreen,
  setScreen,
  children,
  searchQuery,
  setSearchQuery,
  onNewSaleClick,
  debtCount,
  settings
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as Screen, label: 'Inventory', icon: Package },
    { id: 'sales' as Screen, label: 'Sales', icon: Receipt },
    { id: 'reports' as Screen, label: 'Reports/P&L', icon: TrendingUp },
    { id: 'expenses' as Screen, label: 'Expenses', icon: Coins },
    { id: 'debts' as Screen, label: 'Debts', icon: AlertTriangle, badge: debtCount > 0 ? debtCount : undefined },
    { id: 'staff' as Screen, label: 'Staff Management', icon: Users },
    { id: 'notifications' as Screen, label: 'Alerts', icon: Bell },
    { id: 'profile' as Screen, label: 'Profile & Account', icon: User }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row font-sans">
      
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-border dark:border-outline-variant shadow-md z-40">
        <div className="p-6 flex flex-col gap-1 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-surface-container-high shrink-0 border border-primary/10">
              {settings.logoUrl ? (
                <img 
                  src={settings.logoUrl} 
                  alt="Pharmacy Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <HeartPlus className="text-primary w-6 h-6" />
              )}
            </div>
            <div>
              <h1 className="font-bold text-sm text-primary leading-tight line-clamp-1">{settings.pharmacyName}</h1>
              <p className="text-[10px] text-secondary leading-normal">{settings.adminSlogan}</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setScreen(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer duration-200 text-left transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                    : 'text-secondary hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-on-primary-container' : 'text-secondary'}`} />
                  <span className="text-body-md whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                    isActive ? 'bg-on-primary-container/20 text-on-primary-container' : 'bg-danger/15 text-danger'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-border/50">
          <button 
            onClick={onNewSaleClick}
            className="w-full bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            <Plus className="w-5 h-5" />
            <span>New Sale</span>
          </button>
          
          <div className="mt-4 pt-4 border-t border-dashed border-border/50 space-y-1">
            <button 
              onClick={() => setScreen('settings')}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-left text-sm cursor-pointer transition-all ${
                currentScreen === 'settings' 
                  ? 'bg-primary text-on-primary font-bold shadow-sm' 
                  : 'text-secondary hover:bg-surface-container-high'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={() => {
                if (confirm('Are you sure you want to reset all tracking state to factory defaults?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-danger hover:bg-error-container/20 rounded-xl text-left text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 bg-surface-container-lowest border-b border-border shadow-sm h-16">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-surface-container-high rounded-full text-secondary"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="font-bold text-lg text-primary md:text-xl capitalize">
              {currentScreen === 'reports' ? 'P&L Reports' : currentScreen === 'settings' ? 'System Settings' : currentScreen === 'expenses' ? 'Record Expense' : currentScreen === 'notifications' ? 'Notifications' : `${currentScreen} Tracker`}
            </h2>
          </div>

          {/* Search bar inside top bar (only context-appropriate screens, e.g. Inventory, Sales, Dashboard) */}
          {['dashboard', 'inventory', 'sales'].includes(currentScreen) && (
            <div className="hidden sm:block relative max-w-md w-full mx-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
              <input
                type="text"
                placeholder={
                  currentScreen === 'inventory' 
                    ? "Search drugs, generic names..." 
                    : currentScreen === 'sales'
                      ? "Search sales transactions..."
                      : "Search anything..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-border/40 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setScreen('notifications')}
              className="p-2 cursor-pointer hover:bg-surface-container-high transition-colors rounded-full relative"
            >
              <Bell className="w-5 h-5 text-on-surface-variant" />
              {debtCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white"></span>
              )}
            </button>
            
            <button 
              onClick={() => {
                alert(
                  "PharmaFlow Demo Guide\n\n" +
                  "• Dashboard: Quick overview of KPIs, activity, and actions.\n" +
                  "• Inventory: Standard stock checker with alerts. Adding a drug works here.\n" +
                  "• Sales: Direct drug dispatch & ledger calculator. Auto-reduces stock & logs profit.\n" +
                  "• Reports/P&L: Visual dashboard containing revenue vs expenses charts.\n" +
                  "• Debts: Outstanding balances with active reminder generation & WhatsApp redirection."
                );
              }}
              className="p-2 cursor-pointer hover:bg-surface-container-high transition-colors rounded-full"
            >
              <HelpCircle className="w-5 h-5 text-on-surface-variant" />
            </button>

            <div className="h-6 w-px bg-border my-auto"></div>

            <button 
              onClick={() => setScreen('profile')}
              className="flex items-center gap-2 hover:bg-surface-container-high p-1 px-2.5 rounded-full duration-200 cursor-pointer active:scale-95 border border-transparent hover:border-border/60"
            >
              <img
                src={settings.logoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAb8iq1aJViWmtMCyNKLl2dk7L0AyyMDa8qtg5GkjgsG6HPXkpRA1ZQ8Xm9y3NBpdndbt6ClKg_oIuXMj7F2Y-1uGBqH2Wb4MoYq0b3aljHGJ2wZerPZQ1u1_tpN-TLsvPitMwO4QmvItZLkoAeZTIq393nket77de4qoXHq4CnutHXqmGMB8YS9G89aKfstxMN7x2NwQbI5XwTwf89I0YtaSkOSHOyTbFi8RA07F2TSi8xbBIAcNdWP9mqeYXmFR5ZtvSQnUpiGG1A"}
                alt="Nigerian Pharmacist Profile"
                className="w-8 h-8 rounded-full border border-primary-container object-cover shadow-xs"
              />
              <span className="hidden lg:inline text-xs font-bold text-on-surface">
                {settings.pharmacistName || 'Dr. Adebayo Ogunwale'}
              </span>
            </button>
          </div>
        </header>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest border-b border-border shadow-lg p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setScreen(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-bold'
                      : 'text-secondary hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-body-md">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-danger/15 text-danger rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Floating background image or background styling if simple */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>

        {/* BottomNavBar (Mobile) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-border flex items-center justify-around z-50">
          <button 
            onClick={() => setScreen('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${currentScreen === 'dashboard' ? 'text-primary' : 'text-secondary opacity-70'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setScreen('inventory')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${currentScreen === 'inventory' ? 'text-primary' : 'text-secondary opacity-70'}`}
          >
            <Package className="w-5 h-5" />
            <span>Inventory</span>
          </button>

          <button 
            onClick={() => setScreen('staff')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${currentScreen === 'staff' ? 'text-primary' : 'text-secondary opacity-70'}`}
          >
            <Users className="w-5 h-5" />
            <span>Staff</span>
          </button>

          <button 
            onClick={() => setScreen('settings')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${currentScreen === 'settings' ? 'text-primary' : 'text-secondary opacity-70'}`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
          
          <button 
            onClick={() => setScreen('profile')}
            className={`flex flex-col items-center gap-1 text-[10px] uppercase font-bold tracking-wider ${currentScreen === 'profile' ? 'text-primary' : 'text-secondary opacity-70'}`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
