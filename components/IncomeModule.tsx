
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Plus, Edit2, Trash2, TrendingUp, DollarSign } from 'lucide-react';
import { Income, Category } from '../types';

const IncomeModule: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const [formData, setFormData] = useState({
    client: '',
    category: 'Photoshoot' as Category,
    description: '',
    amount: 0
  });

  const categories: Category[] = ['Event', 'Photoshoot', 'Videography', 'Commercial', 'Music Compose', 'Voice Record'];

  const handleOpenModal = (income?: Income) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        client: income.client,
        category: income.category,
        description: income.description,
        amount: income.amount
      });
    } else {
      setEditingIncome(null);
      setFormData({ client: '', category: 'Photoshoot', description: '', amount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomeData: Income = {
      id: editingIncome?.id || Math.random().toString(36).substr(2, 9),
      client: formData.client,
      category: formData.category,
      description: formData.description,
      amount: formData.amount,
      date: editingIncome?.date || new Date().toISOString()
    };

    if (editingIncome) {
      dispatch({ type: 'UPDATE_INCOME', payload: incomeData });
    } else {
      dispatch({ type: 'ADD_INCOME', payload: incomeData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this income record?')) {
      dispatch({ type: 'DELETE_INCOME', payload: id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Income Ledger</h2>
          <p className="text-slate-500 dark:text-slate-400">Manage your revenue streams</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200 dark:shadow-none"
        >
          <Plus size={20} />
          <span>Add Income</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {categories.slice(0, 3).map(cat => {
          const total = state.incomes.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0);
          return (
            <div key={cat} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{cat}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">
                {state.profile.currency} {total.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {state.incomes.map((income) => (
                <tr key={income.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-white">{income.client}</td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded text-xs font-medium">
                      {income.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate">{income.description}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600">{state.profile.currency} {income.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleOpenModal(income)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(income.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {state.incomes.length === 0 && (
            <div className="p-12 text-center text-slate-500">No income records available.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold dark:text-white">{editingIncome ? 'Edit Income' : 'Log Income'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">{state.profile.currency}</span>
                  <input
                    required
                    type="number"
                    className="w-full pl-12 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeModule;
