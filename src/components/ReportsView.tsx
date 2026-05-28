import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  Filter, 
  MoreVertical, 
  ChevronRight,
  Calculator,
  PieChart,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ExpenseItem, Screen } from '../types';

interface ReportsViewProps {
  totalRevenue: number;
  totalExpenses: number;
  expenses: ExpenseItem[];
  onNavigate: (screen: Screen) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May 2026', 'June', 'July', 
  'August', 'September', 'October', 'November', 'December'
];

export default function ReportsView({
  totalRevenue,
  totalExpenses,
  expenses,
  onNavigate
}: ReportsViewProps) {
  const [selectedMonth, setSelectedMonth] = React.useState('May 2026');
  const [showMonthSelect, setShowMonthSelect] = React.useState(false);

  // Compute weekly revenue and expenses based on current month's totals
  const chartData = React.useMemo(() => {
    return [
      {
        name: 'Week 1',
        Revenue: Math.round(totalRevenue * 0.25),
        Expenses: Math.round(totalExpenses * 0.25),
      },
      {
        name: 'Week 2',
        Revenue: Math.round(totalRevenue * 0.30),
        Expenses: Math.round(totalExpenses * 0.32),
      },
      {
        name: 'Week 3',
        Revenue: Math.round(totalRevenue * 0.20),
        Expenses: Math.round(totalExpenses * 0.18),
      },
      {
        name: 'Week 4',
        Revenue: Math.round(totalRevenue * 0.25),
        Expenses: Math.round(totalExpenses * 0.25),
      },
    ];
  }, [totalRevenue, totalExpenses]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(0)}K`;
    }
    return `₦${value}`;
  };

  // Hardcoded Top Selling list (which are dynamically computed or loaded)
  const topSellingDrugs = [
    { name: 'Amoxicillin 500mg', units: 1240, revenue: 620000 },
    { name: 'Artemether / Lumefantrine', units: 980, revenue: 490000 },
    { name: 'Paracetamol Syrup', units: 850, revenue: 212500 },
    { name: 'Vitamin C Drops', units: 720, revenue: 144000 },
    { name: 'Metformin 500mg', units: 610, revenue: 305000 },
  ];

  // Dynamic calculations
  const estimatedProfit = totalRevenue - totalExpenses;

  // Percentage calculations
  const getExpensePercentage = (amount: number) => {
    if (totalExpenses === 0) return 0;
    return Math.round((amount / totalExpenses) * 1000) / 10;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Month Selector header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg md:text-xl font-black text-on-surface">Reports Ledger & Profit/Loss Sheet</h2>
          <p className="text-xs text-secondary mt-0.5">Real-time dynamic balance updates of cash ledger accounts.</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowMonthSelect(!showMonthSelect)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low border border-border rounded-xl font-bold text-xs text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <Calendar className="w-4 h-4 text-primary" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-4 h-4 text-secondary ml-1" />
          </button>

          {showMonthSelect && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-border rounded-xl shadow-xl z-50 py-1 divide-y divide-border/40">
              {MONTHS.map((mon) => (
                <button
                  key={mon}
                  onClick={() => {
                    setSelectedMonth(mon);
                    setShowMonthSelect(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-surface-container text-xs text-on-surface hover:text-primary transition-colors font-semibold"
                >
                  {mon}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-secondary">Total Revenue</span>
            <div className="bg-success/10 p-2.5 rounded-xl border border-success/20">
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-xl md:text-2xl font-black text-success">₦{totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] text-secondary font-medium flex items-center gap-1.5 mt-1.5">
              <span className="text-success font-black">+12%</span> vs. last month
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-success/20"></div>
        </div>

        {/* Total Expenses */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-secondary">Total Expenses</span>
            <div className="bg-danger/10 p-2.5 rounded-xl border border-danger/20">
              <ArrowDownRight className="w-5 h-5 text-danger" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-xl md:text-2xl font-black text-danger">₦{totalExpenses.toLocaleString()}</span>
            <span className="text-[10px] text-secondary font-medium flex items-center gap-1.5 mt-1.5">
              <span className="text-danger font-black">+5%</span> vs. last month
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-danger/20"></div>
        </div>

        {/* Estimated Profit */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-secondary">Estimated Profit</span>
            <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <span className={`text-xl md:text-2xl font-black ${estimatedProfit < 0 ? 'text-danger' : 'text-primary'}`}>
              ₦{estimatedProfit.toLocaleString()}
            </span>
            <span className="text-[10px] text-secondary font-medium flex items-center gap-1.5 mt-1.5">
              <span className="text-success font-black">+18%</span> vs. last month
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20"></div>
        </div>

      </section>

      {/* Main Chart Section */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="font-bold text-base md:text-lg text-on-surface">Weekly Revenue vs. Expenses</h2>
            <p className="text-xs text-secondary mt-0.5">Line-chart analysis comparing weekly billing trends of {selectedMonth}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-semibold text-xs text-secondary">
              <div className="w-3.5 h-1.5 rounded-full bg-success shadow-sm"></div>
              <span>Revenue</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-xs text-secondary">
              <div className="w-3.5 h-1.5 rounded-full bg-danger shadow-sm"></div>
              <span>Expenses</span>
            </div>
          </div>
        </div>

        {/* Dynamic Recharts Line Chart */}
        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#71717a', fontSize: 11, fontWeight: 600 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl text-xs leading-5">
                        <p className="font-bold text-slate-100 mb-1">{label}</p>
                        <p className="text-success font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-success"></span>
                          <span>Revenue: <strong className="text-white">₦{payload[0].value?.toLocaleString()}</strong></span>
                        </p>
                        {payload[1] && (
                          <p className="text-danger font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-danger"></span>
                            <span>Expenses: <strong className="text-white">₦{payload[1].value?.toLocaleString()}</strong></span>
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="Revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: "#10b981", fill: "#ffffff" }}
                activeDot={{ r: 7, strokeWidth: 0, fill: "#10b981" }}
              />
              <Line 
                type="monotone" 
                dataKey="Expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, stroke: "#ef4444", fill: "#ffffff" }}
                activeDot={{ r: 7, strokeWidth: 0, fill: "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed breakdowns dual-grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Selling Drugs Table */}
        <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-1.5">
                <Calculator className="w-5 h-5 text-primary" />
                <span>Top Selling Drugs</span>
              </h3>
              <MoreVertical className="w-5 h-5 text-secondary cursor-pointer" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider">Drug Name</th>
                    <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Units</th>
                    <th className="px-6 py-3 text-xs font-semibold text-secondary uppercase tracking-wider text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {topSellingDrugs.map((item, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-sm text-on-surface">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-secondary text-right">{item.units.toLocaleString()}</td>
                      <td className="px-6 py-4 font-black text-sm text-on-surface text-right">₦{item.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-6 py-3 bg-surface-container-low text-center border-t border-border/60">
            <button 
              onClick={() => onNavigate('inventory')}
              className="text-primary font-bold text-xs flex items-center gap-1 mx-auto hover:underline"
            >
              <span>View Full Inventory Report</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Expense Breakdown Card progress details */}
        <section className="bg-surface-container-lowest rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col justify-between h-full">
          <div>
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-1.5">
                <PieChart className="w-5 h-5 text-primary" />
                <span>Expense Breakdown</span>
              </h3>
              <Filter className="w-5 h-5 text-primary cursor-pointer hover:bg-surface-container p-1 rounded-md" />
            </div>

            <div className="p-6 space-y-6">
              {expenses.length === 0 ? (
                <div className="text-center py-12 text-secondary text-xs font-medium">No recorded operational expenses yet.</div>
              ) : (
                expenses.map((exp) => {
                  const percentage = getExpensePercentage(exp.amount);
                  return (
                    <div key={exp.id} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-on-surface text-[13px]">{exp.name}</span>
                        <span className="font-black text-danger text-[13px]">₦{exp.amount.toLocaleString()}</span>
                      </div>
                      
                      <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-danger h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        ></div>
                      </div>
                      
                      <span className="text-[10px] text-secondary font-medium">{percentage}% of total Monthly Expenses</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-surface-container-low border-t border-border flex justify-between items-center mt-auto">
            <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Total Operational Expense</span>
            <span className="font-black text-sm text-danger bg-danger/10 px-3 py-1.5 rounded-xl border border-danger/15">
              ₦{totalExpenses.toLocaleString()}
            </span>
          </div>
        </section>

      </div>

    </div>
  );
}
