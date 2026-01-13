import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, Clock, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const [isMounted, setIsMounted] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalIncome = state.incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = state.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBalance = totalIncome - totalExpenses;
  const pendingPayments = state.projects.reduce((sum, p) => sum + p.dueAmount, 0);

  const getAIInsights = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Analyze this financial data for a creative business:
        Total Income: ${state.profile.currency} ${totalIncome}
        Total Expenses: ${state.profile.currency} ${totalExpenses}
        Net Balance: ${state.profile.currency} ${totalBalance}
        Pending Receivables: ${state.profile.currency} ${pendingPayments}
        Number of active projects: ${state.projects.length}
        
        Provide 3 concise, professional bullet points of advice to improve profitability or cash flow.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a senior financial advisor for creative professionals. Provide high-level, actionable, and encouraging business advice.",
          temperature: 0.7,
        }
      });

      setAiInsight(response.text || "Unable to generate insights at this moment.");
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiInsight("Connect your Gemini API key to receive personalized financial insights.");
    } finally {
      setIsGenerating(false);
    }
  };

  const barData = useMemo(() => [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: totalIncome, expenses: totalExpenses },
  ], [totalIncome, totalExpenses]);

  const pieData = useMemo(() => {
    const expenseCategories = state.expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.description] = (acc[e.description] || 0) + e.amount;
      return acc;
    }, {});
    
    const data = Object.keys(expenseCategories).map(cat => ({
      name: cat,
      value: expenseCategories[cat]
    }));
    return data.length > 0 ? data : [{ name: 'No Expenses', value: 1 }];
  }, [state.expenses]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6'];

  const stats = [
    { id: 'stat-inc', label: 'Total Income', value: totalIncome, icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'stat-exp', label: 'Total Expenses', value: totalExpenses, icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { id: 'stat-bal', label: 'Total Balance', value: totalBalance, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'stat-pnd', label: 'Pending Payments', value: pendingPayments, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const recentTransactions = useMemo(() => [
    ...state.incomes.map(i => ({ ...i, txType: 'income' as const })),
    ...state.expenses.map(e => ({ ...e, txType: 'expense' as const }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [state.incomes, state.expenses]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* AI Insights Panel */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl border border-white/10 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="text-amber-300 animate-pulse" size={24} />
              <h3 className="text-lg font-bold">ProFin AI Advisor</h3>
            </div>
            {aiInsight ? (
              <div className="text-indigo-50 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/5 animate-in fade-in zoom-in duration-500">
                <p className="whitespace-pre-line text-sm leading-relaxed">{aiInsight}</p>
                <button 
                  onClick={() => setAiInsight(null)}
                  className="mt-4 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
                >
                  Refresh Analysis
                </button>
              </div>
            ) : (
              <p className="text-indigo-100 text-sm">
                Get real-time financial analysis and business growth tips based on your current revenue and spending patterns.
              </p>
            )}
          </div>
          {!aiInsight && (
            <button 
              onClick={getAIInsights}
              disabled={isGenerating}
              className="flex items-center justify-center space-x-2 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              <span>{isGenerating ? 'Analyzing...' : 'Generate Insights'}</span>
            </button>
          )}
        </div>
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            </div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {state.profile.currency} {stat.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Financial Overview</h3>
          <div className="flex-1 w-full min-h-[300px] relative">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Expense Categories</h3>
          <div className="flex-1 w-full min-h-[300px] relative">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" debounce={100}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'No Expenses' ? '#e2e8f0' : COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Recent Activity</h3>
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Live Feed</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {recentTransactions.map((tx) => (
            <div key={`tx-item-${tx.id}`} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl ${tx.txType === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {tx.txType === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {'description' in tx ? tx.description : 'Payment'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`font-bold text-base ${tx.txType === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {tx.txType === 'income' ? '+' : '-'} {state.profile.currency} {tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">No transactions found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;