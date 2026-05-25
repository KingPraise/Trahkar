import { DrugItem, DebtRecord, Transaction, ActivityLine, ExpenseItem } from './types';

export const INITIAL_DRUGS: DrugItem[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    category: 'Analgesic & Antipyretic',
    quantity: 1240,
    unitType: 'tabs',
    unitPrice: 500,
    expiryDate: 'Dec 2026',
    status: 'IN STOCK'
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    category: 'Broad-spectrum Antibiotic',
    quantity: 85,
    unitType: 'capsules',
    unitPrice: 2500,
    expiryDate: 'Aug 2025',
    status: 'IN STOCK'
  },
  {
    id: '3',
    name: 'Artemether + Lumefantrine',
    category: 'Anti-malarial Treatment',
    quantity: 12,
    unitType: 'packs',
    unitPrice: 4500,
    expiryDate: 'Oct 2024',
    status: 'LOW STOCK'
  },
  {
    id: '4',
    name: 'Vitamin C (Chewable)',
    category: 'Immune Support Supplement',
    quantity: 450,
    unitType: 'tabs',
    unitPrice: 1200,
    expiryDate: 'Feb 2027',
    status: 'IN STOCK'
  },
  {
    id: '5',
    name: 'Oral Rehydration Salts',
    category: 'Dehydration Therapy',
    quantity: 200,
    unitType: 'sachets',
    unitPrice: 800,
    expiryDate: 'Nov 2023',
    status: 'EXPIRING SOON'
  },
  {
    id: '6',
    name: 'Insulin Glargine',
    category: 'Long-acting Insulin',
    quantity: 0,
    unitType: 'vials',
    unitPrice: 15000,
    expiryDate: '-',
    status: 'OUT OF STOCK'
  }
];

export const INITIAL_DEBTS: DebtRecord[] = [
  {
    id: 'd1',
    customerName: 'Alhaji Musa Bello',
    phoneNumber: '0803 123 4567',
    amountOwed: 64500,
    dateRecorded: 'Oct 12, 2023',
    daysOutstanding: 42,
    status: 'Outstanding',
    ageCategory: 'Over 30 Days'
  },
  {
    id: 'd2',
    customerName: 'Mr. Adebayo Ogunwale',
    phoneNumber: '0701 987 6543',
    amountOwed: 82000,
    dateRecorded: 'Oct 20, 2023',
    daysOutstanding: 34,
    status: 'Outstanding',
    ageCategory: 'Over 30 Days'
  },
  {
    id: 'd3',
    customerName: 'Mrs. Chioma Eze',
    phoneNumber: '0905 555 1212',
    amountOwed: 36700,
    dateRecorded: 'Nov 05, 2023',
    daysOutstanding: 18,
    status: 'Outstanding',
    ageCategory: '15-30 Days'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    time: '14:22',
    date: 'May 25, 2026',
    itemName: 'Paracetamol Extra',
    quantity: 2,
    unitPrice: 1200,
    amount: 2400,
    paymentMethod: 'cash'
  },
  {
    id: 't2',
    time: '14:15',
    date: 'May 25, 2026',
    itemName: 'Augmentin 625mg',
    quantity: 1,
    unitPrice: 15000,
    amount: 15000,
    paymentMethod: 'pos'
  },
  {
    id: 't3',
    time: '13:58',
    date: 'May 25, 2026',
    itemName: 'Loratadine Syrup',
    quantity: 3,
    unitPrice: 3500,
    amount: 10500,
    paymentMethod: 'transfer'
  }
];

export const INITIAL_ACTIVITIES: ActivityLine[] = [
  {
    id: 'a1',
    type: 'sale',
    title: 'Sale: Amoxicillin (2x)',
    subtitle: 'Processed by Admin',
    timeText: '2 mins ago',
    badgeText: 'Paid',
    amount: 4200
  },
  {
    id: 'a2',
    type: 'debt',
    title: 'Debt: Mr. Ibrahim K.',
    subtitle: 'Anti-malarial course',
    timeText: '15 mins ago',
    badgeText: 'Pending',
    amount: 8500
  },
  {
    id: 'a3',
    type: 'expense',
    title: 'Expense: Shop Electricity',
    subtitle: 'PHCN Token',
    timeText: '1 hour ago',
    badgeText: 'Expense',
    amount: 15000
  },
  {
    id: 'a4',
    type: 'sale',
    title: 'Sale: Panadol Cold & Flu',
    subtitle: 'Processed by Pharmacist',
    timeText: '3 hours ago',
    badgeText: 'Paid',
    amount: 1500
  },
  {
    id: 'a5',
    type: 'sale',
    title: 'Sale: Glucose Monitor D-1',
    subtitle: 'Bulk Sale',
    timeText: '4 hours ago',
    badgeText: 'Paid',
    amount: 12000
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: 'e1', name: 'Facility Rent', amount: 600000 },
  { id: 'e2', name: 'Staff Salaries', amount: 750000 },
  { id: 'e3', name: 'Fuel & Power (Generator)', amount: 350000 },
  { id: 'e4', name: 'Logistics & Supply Chain', amount: 150000 }
];
