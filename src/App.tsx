import React from 'react';
import { Screen, DrugItem, DebtRecord, Transaction, ActivityLine, ExpenseItem, AppSettings } from './types';
import { 
  INITIAL_DRUGS, 
  INITIAL_DEBTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_ACTIVITIES, 
  INITIAL_EXPENSES 
} from './data';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import InventoryView from './components/InventoryView';
import SalesView from './components/SalesView';
import ReportsView from './components/ReportsView';
import DebtsView from './components/DebtsView';
import SettingsView from './components/SettingsView';
import ExpensesView from './components/ExpensesView';
import ClearCacheView from './components/ClearCacheView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import StaffView from './components/StaffView';
import LandingView from './components/LandingView';
import SignupView from './components/SignupView';
import SignupSuccessView from './components/SignupSuccessView';

// Local storage keys
const KEY_DRUGS = 'favour_drugs_4';
const KEY_DEBTS = 'favour_debts_4';
const KEY_TXS = 'favour_transactions_4';
const KEY_ACTS = 'favour_activities_4';
const KEY_EXPS = 'favour_expenses_4';
const KEY_SETTINGS = 'favour_settings_4';

export default function App() {
  const [currentScreen, setScreen] = React.useState<Screen>('landing');
  const [searchQuery, setSearchQuery] = React.useState('');

  // Loaded states with localStorage synchronization fallbacks
  const [drugs, setDrugs] = React.useState<DrugItem[]>(() => {
    const saved = localStorage.getItem(KEY_DRUGS);
    return saved ? JSON.parse(saved) : INITIAL_DRUGS;
  });

  const [debts, setDebts] = React.useState<DebtRecord[]>(() => {
    const saved = localStorage.getItem(KEY_DEBTS);
    return saved ? JSON.parse(saved) : INITIAL_DEBTS;
  });

  const [transactions, setTransactions] = React.useState<Transaction[]>(() => {
    const saved = localStorage.getItem(KEY_TXS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activities, setActivities] = React.useState<ActivityLine[]>(() => {
    const saved = localStorage.getItem(KEY_ACTS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [expenses, setExpenses] = React.useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(KEY_EXPS);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [settings, setSettings] = React.useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      pharmacyName: 'Favour Pharmacy & Stores',
      adminSlogan: 'Admin Console',
      adminUsername: 'kingpraise15',
      lowStockThreshold: 20,
      currencySymbol: '₦',
      defaultPaymentMethod: 'cash',
      whatsappMessageTemplate: 'Hello *{customerName}*, this is a friendly reminder from *{pharmacyName}* regarding your outstanding balance of *{currency}{amount}* recorded on *{dateRecorded}* ({days} Days ago). Kindly make arrangements for cash or bank transfer payment. Thank you!',
      themeMode: 'light',
      emailAddress: 'a.ogunwale@citycentralpharma.ng',
      physicalLocation: 'Ikeja, Lagos State',
      phoneNumber: '+234 801 234 5678',
      logoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBAJMtdX0qlno-yQyodnge1VdHUpVoCd24T6e4xitamkNrwK1Z1Qwrv5iNWbjavGJnkWPuvwKt4hJTmRHXVXWVFZRpqQ49ddTi2h58LLha-wPAdrdlPmQtLTzFVfgV9CtMAQHFos-1sRDGjgC14EoTj6eWaL2RfpWjNUcIfeSUuKLwRwrDfXLxMk3rkqdI28R5cZnFi08reaYvrKVCZDNamWmVJnpRxjEEYHtR3Tb8uQ5g15UqqaNi1KdGkpAwJ6EgJjVZ4JshqqFP',
      preferredUnitOfMeasure: 'Sachets / Pieces',
      whatsappSharing: true,
      businessRegNo: '',
      pharmacistName: 'Dr. Adebayo Ogunwale',
      pharmacyLicense: 'PCN/2023/4852',
      specialty: 'Community Pharmacy',
      language: 'English (Nigeria)',
      twoFactorAuth: true,
      inventoryAlerts: true,
      salesSummaries: true,
      securityNotifications: false
    };
    const saved = localStorage.getItem(KEY_SETTINGS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSettings, ...parsed };
      } catch (e) {
        // fallback
      }
    }
    return defaultSettings;
  });

  // Sync to localStorage on state changes
  React.useEffect(() => {
    localStorage.setItem(KEY_DRUGS, JSON.stringify(drugs));
  }, [drugs]);

  React.useEffect(() => {
    localStorage.setItem(KEY_DEBTS, JSON.stringify(debts));
  }, [debts]);

  React.useEffect(() => {
    localStorage.setItem(KEY_TXS, JSON.stringify(transactions));
  }, [transactions]);

  React.useEffect(() => {
    localStorage.setItem(KEY_ACTS, JSON.stringify(activities));
  }, [activities]);

  React.useEffect(() => {
    localStorage.setItem(KEY_EXPS, JSON.stringify(expenses));
  }, [expenses]);

  React.useEffect(() => {
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
    // Apply theme mode class to documentElement
    if (settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Recalculated parameters
  const outstandingDebtsTotal = React.useMemo(() => {
    return debts
      .filter((d) => d.status === 'Outstanding')
      .reduce((sum, d) => sum + d.amountOwed, 0);
  }, [debts]);

  const stockAlertsCount = React.useMemo(() => {
    return drugs.filter((d) => d.status === 'LOW STOCK' || d.status === 'EXPIRING SOON' || d.status === 'OUT OF STOCK').length;
  }, [drugs]);

  const todaySalesTotal = React.useMemo(() => {
    // Starts with the default ₦47,500 base from the dashboard design screen & sums newly completed sales
    const base = 47500;
    const newSalesSum = transactions
      .filter(t => t.itemName !== 'Base Ledger') // filter or just sum everything made in runtime
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Calculate difference over default INITIAL_TRANSACTIONS count to only sum new ones
    const newTxs = transactions.filter(t => !INITIAL_TRANSACTIONS.some(it => it.id === t.id));
    const addedAmount = newTxs.reduce((sum, t) => sum + t.amount, 0);

    return base + addedAmount;
  }, [transactions]);

  const totalRevenueFinance = React.useMemo(() => {
    // Starts with premium ₦4,250,000 revenue & adds runtime profits
    const base = 4250000;
    const newTxs = transactions.filter(t => !INITIAL_TRANSACTIONS.some(it => it.id === t.id));
    const addedSum = newTxs.reduce((sum, t) => sum + t.amount, 0);
    return base + addedSum;
  }, [transactions]);

  const totalExpensesFinance = React.useMemo(() => {
    // Starts with ₦1,850,000 base from the P&L reports & adds custom logged ones
    const base = 1850000;
    const newExps = expenses.filter(e => !INITIAL_EXPENSES.some(ie => ie.id === e.id));
    const addedSum = newExps.reduce((sum, e) => sum + e.amount, 0);
    return base + addedSum;
  }, [expenses]);

  const monthlyProfitEstimate = React.useMemo(() => {
    // ₦312,000 base + added elements
    const base = 312000;
    const newTxs = transactions.filter(t => !INITIAL_TRANSACTIONS.some(it => it.id === t.id));
    const addedRevenue = newTxs.reduce((sum, t) => sum + t.amount, 0);

    const newExps = expenses.filter(e => !INITIAL_EXPENSES.some(ie => ie.id === e.id));
    const addedExpenses = newExps.reduce((sum, e) => sum + e.amount, 0);

    return base + addedRevenue - addedExpenses;
  }, [transactions, expenses]);


  // Handler 1: Process Complete Sale Order
  const handleCompleteSale = (sale: {
    drugId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    paymentMethod: 'cash' | 'transfer' | 'pos';
    grandTotal: number;
  }) => {
    // 1. Deduct quantity level from selected Drug
    setDrugs((prevDrugs) => 
      prevDrugs.map((d) => {
        if (d.id === sale.drugId) {
          const updatedQty = Math.max(0, d.quantity - sale.quantity);
          const updatedStatus = 
            updatedQty === 0 
              ? 'OUT OF STOCK' 
              : updatedQty < settings.lowStockThreshold 
                ? 'LOW STOCK' 
                : 'IN STOCK';
          return {
            ...d,
            quantity: updatedQty,
            status: updatedStatus
          };
        }
        return d;
      })
    );

    // 2. Add Transaction to list
    const timestamp = new Date();
    const formattedTime = timestamp.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      time: formattedTime,
      date: 'May 25, 2026',
      itemName: sale.itemName,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      amount: sale.grandTotal,
      paymentMethod: sale.paymentMethod
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 3. Add to Activities feed
    const newAct: ActivityLine = {
      id: `act-${Date.now()}`,
      type: 'sale',
      title: `Sale: ${sale.itemName} (${sale.quantity}x)`,
      subtitle: `Processed by Admin`,
      timeText: 'Just now',
      badgeText: 'Paid',
      amount: sale.grandTotal
    };
    setActivities((prev) => [newAct, ...prev]);
  };


  // Handler 2: Adding a custom Drug to listing
  const handleAddNewDrug = (partialDrug: Partial<DrugItem>) => {
    const qty = partialDrug.quantity || 0;
    const statusVal: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' = 
      qty === 0 
        ? 'OUT OF STOCK' 
        : qty < settings.lowStockThreshold 
          ? 'LOW STOCK' 
          : 'IN STOCK';

    const newDrug: DrugItem = {
      id: `drug-${Date.now()}`,
      name: partialDrug.name || 'Generic Medicine',
      category: partialDrug.category || 'General Medicine',
      quantity: qty,
      unitType: partialDrug.unitType || 'tabs',
      unitPrice: partialDrug.unitPrice || 1000,
      expiryDate: partialDrug.expiryDate || 'Dec 2026',
      status: statusVal
    };

    setDrugs((prev) => [newDrug, ...prev]);

    // Add activity operation logged details
    const newAct: ActivityLine = {
      id: `act-${Date.now()}`,
      type: 'sale',
      title: `Stocked: ${newDrug.name}`,
      subtitle: `Inventory Replenished`,
      timeText: 'Just now',
      badgeText: 'Paid',
      amount: newDrug.quantity * newDrug.unitPrice
    };
    setActivities((prev) => [newAct, ...prev]);
  };


  // Handler 3: Update existing Stock item level
  const handleRestockDrug = (id: string, newQty: number) => {
    setDrugs((prev) => 
      prev.map((d) => {
        if (d.id === id) {
          const statusVal: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' = 
            newQty === 0 
              ? 'OUT OF STOCK' 
              : newQty < settings.lowStockThreshold 
                ? 'LOW STOCK' 
                : 'IN STOCK';
          return {
            ...d,
            quantity: newQty,
            status: statusVal
          };
        }
        return d;
      })
    );
  };

  const handleDeleteDrug = (id: string) => {
    setDrugs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateDrugPrice = (id: string, newPrice: number) => {
    setDrugs((prev) => 
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            unitPrice: newPrice
          };
        }
        return d;
      })
    );
  };


  // Handler 4: Create Outstanding Debt log
  const handleRecordDebt = (name: string, phone: string, amount: number) => {
    const newDebt: DebtRecord = {
      id: `debt-${Date.now()}`,
      customerName: name,
      phoneNumber: phone,
      amountOwed: amount,
      dateRecorded: 'May 25, 2026',
      daysOutstanding: 1, // just recorded today
      status: 'Outstanding',
      ageCategory: '0-14 Days'
    };

    setDebts((prev) => [newDebt, ...prev]);

    // Add activity logging tracking
    const newAct: ActivityLine = {
      id: `act-${Date.now()}`,
      type: 'debt',
      title: `Debt: ${name}`,
      subtitle: `Recorded on account`,
      timeText: 'Just now',
      badgeText: 'Pending',
      amount: amount
    };
    setActivities((prev) => [newAct, ...prev]);
  };


  // Handler 5: Clean Deleted history ledger accounts
  const handleDeleteDebt = (id: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };


  // Handler 6: Mark an Outstanding Debtor as Paid
  const handleMarkPaid = (debtId: string) => {
    let debtValue = 0;
    let customer = '';

    setDebts((prevDebts) => 
      prevDebts.map((d) => {
        if (d.id === debtId) {
          debtValue = d.amountOwed;
          customer = d.customerName;
          return {
            ...d,
            status: 'Paid'
          };
        }
        return d;
      })
    );

    // Add settled value to ledger transactions so Today's Sales updates!
    const timestamp = new Date();
    const formattedTime = timestamp.toTimeString().split(' ')[0].slice(0, 5); // HH:MM
    const newTx: Transaction = {
      id: `tx-settle-${Date.now()}`,
      time: formattedTime,
      date: 'May 25, 2026',
      itemName: `Debt Settlement: ${customer}`,
      quantity: 1,
      unitPrice: debtValue,
      amount: debtValue,
      paymentMethod: 'cash' // standard default
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Push activity log line
    const newAct: ActivityLine = {
      id: `act-settle-${Date.now()}`,
      type: 'sale',
      title: `${customer} settled debt`,
      subtitle: `Balance Cleared`,
      timeText: 'Just now',
      badgeText: 'Paid',
      amount: debtValue
    };
    setActivities((prev) => [newAct, ...prev]);
  };


  // Handler 7: Record Operational Expense item
  const handleAddExpense = (
    name: string, 
    amount: number, 
    category: string = 'Miscellaneous', 
    date: string = '2026-05-25', 
    notes: string = ''
  ) => {
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name,
      amount,
      category,
      date,
      notes
    };
    setExpenses((prev) => [newExp, ...prev]);

    // Add activity card
    const newAct: ActivityLine = {
      id: `act-exp-${Date.now()}`,
      type: 'expense',
      title: `${category}: ${name}`,
      subtitle: notes || 'Recorded shop expense',
      timeText: 'Just now',
      badgeText: 'Expense',
      amount
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleResetDatabase = () => {
    localStorage.clear();
    setDrugs(INITIAL_DRUGS);
    setDebts(INITIAL_DEBTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setActivities(INITIAL_ACTIVITIES);
    setExpenses(INITIAL_EXPENSES);
    setSettings({
      pharmacyName: 'Favour Pharmacy',
      adminSlogan: 'Admin Console',
      adminUsername: 'kingpraise15',
      lowStockThreshold: 20,
      currencySymbol: '₦',
      defaultPaymentMethod: 'cash',
      whatsappMessageTemplate: 'Hello *{customerName}*, this is a friendly reminder from *{pharmacyName}* regarding your outstanding balance of *{currency}{amount}* recorded on *{dateRecorded}* ({days} Days ago). Kindly make arrangements for cash or bank transfer payment. Thank you!',
      themeMode: 'light'
    });
    setScreen('dashboard');
  };

  const handleExportBackup = () => {
    return {
      version: '1.0.0',
      drugs,
      debts,
      transactions,
      activities,
      expenses,
      settings
    };
  };

  const handleImportBackup = (imported: any) => {
    if (!imported || typeof imported !== 'object') return false;
    
    if (imported.drugs && Array.isArray(imported.drugs)) {
      setDrugs(imported.drugs);
    }
    if (imported.debts && Array.isArray(imported.debts)) {
      setDebts(imported.debts);
    }
    if (imported.transactions && Array.isArray(imported.transactions)) {
      setTransactions(imported.transactions);
    }
    if (imported.activities && Array.isArray(imported.activities)) {
      setActivities(imported.activities);
    }
    if (imported.expenses && Array.isArray(imported.expenses)) {
      setExpenses(imported.expenses);
    }
    if (imported.settings && typeof imported.settings === 'object') {
      setSettings(imported.settings);
    }
    return true;
  };

  const currentDebtAccountsCount = debts.filter((d) => d.status === 'Outstanding').length;

  if (currentScreen === 'clearcache') {
    return (
      <ClearCacheView 
        transactionsCount={transactions.length}
        debtsCount={debts.length}
        drugsCount={drugs.length}
        onClearAllData={handleResetDatabase}
        onCancel={() => setScreen('settings')}
        settings={settings}
      />
    );
  }

  if (currentScreen === 'landing') {
    return (
      <LandingView 
        onEnterApp={() => setScreen('dashboard')} 
        onSignupClick={() => setScreen('signup')} 
      />
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SignupView 
        onSignupSuccess={(data) => {
          setSettings(prev => {
            const updated = {
              ...prev,
              pharmacyName: data.businessName,
              pharmacistName: data.fullName,
              emailAddress: data.emailAddress,
            };
            // Also store to localStorage so other hooks sync immediately
            localStorage.setItem(KEY_SETTINGS, JSON.stringify(updated));
            return updated;
          });
          setScreen('signupsuccess');
        }} 
        onNavigateToLogin={() => setScreen('dashboard')} 
        onBackToLanding={() => setScreen('landing')} 
      />
    );
  }

  if (currentScreen === 'signupsuccess') {
    return (
      <SignupSuccessView 
        businessName={settings.pharmacyName}
        onNavigate={(target) => setScreen(target)}
      />
    );
  }

  return (
    <Layout
      currentScreen={currentScreen}
      setScreen={setScreen}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onNewSaleClick={() => setScreen('sales')}
      debtCount={currentDebtAccountsCount}
      settings={settings}
    >
      {currentScreen === 'dashboard' && (
        <DashboardView 
          todaySalesTotal={todaySalesTotal}
          stockAlertsCount={stockAlertsCount}
          outstandingDebtsTotal={outstandingDebtsTotal}
          monthlyProfitEstimate={monthlyProfitEstimate}
          activities={activities}
          onNavigate={(scr) => {
            setScreen(scr);
            setSearchQuery('');
          }}
          onAddDrug={handleAddNewDrug}
          onAddDebt={handleRecordDebt}
          onAddExpense={handleAddExpense}
        />
      )}

      {currentScreen === 'inventory' && (
        <InventoryView 
          drugs={drugs}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddDrug={handleAddNewDrug}
          onRestockDrug={handleRestockDrug}
        />
      )}

      {currentScreen === 'sales' && (
        <SalesView 
          drugs={drugs}
          transactions={transactions}
          onCompleteSale={handleCompleteSale}
          todaySalesAmount={todaySalesTotal}
        />
      )}

      {currentScreen === 'reports' && (
        <ReportsView 
          totalRevenue={totalRevenueFinance}
          totalExpenses={totalExpensesFinance}
          expenses={expenses}
          onNavigate={(scr) => {
            setScreen(scr);
            setSearchQuery('');
          }}
        />
      )}

      {currentScreen === 'debts' && (
        <DebtsView 
          debts={debts}
          onMarkPaid={handleMarkPaid}
          onRecordDebt={handleRecordDebt}
          onDeleteDebt={handleDeleteDebt}
          settings={settings}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsView 
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          onResetDatabase={handleResetDatabase}
          onImportBackup={handleImportBackup}
          onExportBackup={handleExportBackup}
          transactions={transactions}
          onNavigate={(scr) => {
            setScreen(scr);
            setSearchQuery('');
          }}
        />
      )}

      {currentScreen === 'expenses' && (
        <ExpensesView 
          expenses={expenses}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
          settings={settings}
        />
      )}

      {currentScreen === 'notifications' && (
        <NotificationsView 
          drugs={drugs}
          debts={debts}
          onRestockDrug={handleRestockDrug}
          onDeleteDrug={handleDeleteDrug}
          onUpdateDrugPrice={handleUpdateDrugPrice}
          onNavigate={(scr) => {
            setScreen(scr);
            setSearchQuery('');
          }}
          settings={settings}
        />
      )}

      {currentScreen === 'profile' && (
        <ProfileView 
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          onNavigate={(scr) => {
            setScreen(scr);
            setSearchQuery('');
          }}
        />
      )}

      {currentScreen === 'staff' && (
        <StaffView />
      )}
    </Layout>
  );
}
