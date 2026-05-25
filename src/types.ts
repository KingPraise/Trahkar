export type Screen = 'dashboard' | 'inventory' | 'sales' | 'reports' | 'debts' | 'settings' | 'expenses' | 'clearcache' | 'notifications' | 'profile' | 'staff';

export interface StaffMember {
  id: string;
  name: string;
  role: 'Admin' | 'Attendant';
  phone: string;
  status: 'Active' | 'Away';
  lastSeen: string;
  initials: string;
}

export interface DrugItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitType: string;
  unitPrice: number;
  expiryDate: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'EXPIRING SOON' | 'OUT OF STOCK';
}

export interface DebtRecord {
  id: string;
  customerName: string;
  phoneNumber: string;
  amountOwed: number;
  dateRecorded: string;
  daysOutstanding: number;
  status: 'Outstanding' | 'Paid';
  ageCategory: 'Over 30 Days' | '15-30 Days' | '0-14 Days';
}

export interface Transaction {
  id: string;
  time: string;
  date: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'pos';
}

export interface ActivityLine {
  id: string;
  type: 'sale' | 'debt' | 'expense';
  title: string;
  subtitle: string;
  timeText: string;
  badgeText: 'Paid' | 'Pending' | 'Expense' | 'Refund' | 'Overdue';
  amount: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category?: string;
  date?: string;
  notes?: string;
}

export interface AppSettings {
  pharmacyName: string;
  adminSlogan: string;
  adminUsername: string;
  lowStockThreshold: number;
  currencySymbol: string;
  defaultPaymentMethod: 'cash' | 'transfer' | 'pos';
  whatsappMessageTemplate: string;
  themeMode: 'light' | 'dark';
  emailAddress?: string;
  physicalLocation?: string;
  phoneNumber?: string;
  logoUrl?: string;
  preferredUnitOfMeasure?: string;
  whatsappSharing?: boolean;
  businessRegNo?: string;
  pharmacistName?: string;
  pharmacyLicense?: string;
  specialty?: string;
  language?: string;
  twoFactorAuth?: boolean;
  inventoryAlerts?: boolean;
  salesSummaries?: boolean;
  securityNotifications?: boolean;
}

