import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useAppContext();

  const totalIncome = state.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const pendingPayments = state.projects.reduce((sum, p) => sum + p.dueAmount, 0);

  // Chart Data: Monthly comparison
  const barData = useMemo(() => [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: totalIncome, expenses: totalExpenses },
  ], [totalIncome, totalExpenses]);

  // Pie Chart Data: Expense Breakdown
  const pieData = useMemo(() => {
    const expenseCategories = state.expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.description] = (acc[e.description] || 0) + e.amount;
      return acc;
    }, {});
    
    return Object.keys(expenseCategories).map(cat => ({
      name: cat,
      value: expenseCategories[cat]
    }));
  }, [state.expenses]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

  const stats = [
    { label: 'Total Income', value: totalIncome, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Total Expenses', value: totalExpenses, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: 'Total Balance', value: totalBalance, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const recentTransactions = useMemo(() => [
    ...state.incomes.map(i => ({ ...i, type: 'income' as const })),
    ...state.expenses.map(e => ({ ...e, type: 'expense' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [state.incomes, state.expenses]);

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={`${stat.label}-${idx}`} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400">Total</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {state.profile.currency} {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-0 w-full overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Income vs Expenses</h3>
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Breakdown Chart Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-w-0 w-full overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Expense Breakdown</h3>
          <div className="h-[300px] w-full min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length > 0 ? pieData : [{ name: 'No data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                  {pieData.length === 0 && <Cell fill="#e2e8f0" />}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentTransactions.map((tx, idx) => (
            <div key={`tx-${tx.id || idx}`} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
                    {'description' in tx ? tx.description : 'Income Payment'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-bold whitespace-nowrap ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.type === 'income' ? '+' : '-'} {state.profile.currency} {tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">
              <Clock size={40} className="mx-auto mb-3 opacity-20" />
              <p>No transactions recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;