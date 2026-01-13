
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Plus, Edit2, Trash2, Receipt } from 'lucide-react';
import { Expense } from '../types';

const ExpenseModule: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: 0
  });

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        description: expense.description,
        amount: expense.amount
      });
    } else {
      setEditingExpense(null);
      setFormData({ description: '', amount: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData: Expense = {
      id: editingExpense?.id || Math.random().toString(36).substr(2, 9),
      description: formData.description,
      amount: formData.amount,
      date: editingExpense?.date || new Date().toISOString()
    };

    if (editingExpense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expenseData });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expenseData });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this expense?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Expense Tracker</h2>
          <p className="text-slate-500 dark:text-slate-400">Keep an eye on your spending</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-rose-200 dark:shadow-none"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">Recent Expenses</h3>
            <div className="space-y-2">
              {state.expenses.map((expense) => (
                <div key={expense.id} className="group p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-between hover:ring-1 hover:ring-rose-500 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg text-rose-500 shadow-sm">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{expense.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-bold text-rose-600">-{state.profile.currency} {expense.amount.toLocaleString()}</p>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(expense)} className="p-1 hover:text-indigo-600 dark:text-slate-400"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(expense.id)} className="p-1 hover:text-rose-600 dark:text-slate-400"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {state.expenses.length === 0 && <p className="text-center py-8 text-slate-500">No expenses recorded yet.</p>}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
            <h4 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Total Monthly Expenditure</h4>
            <p className="text-4xl font-black text-rose-600">
              {state.profile.currency} {state.expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
            </p>
            <div className="mt-8 w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
               {/* Just a decorative bar showing relative spending */}
               <div className="h-full bg-rose-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold dark:text-white">{editingExpense ? 'Edit Expense' : 'Log Expense'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Travel, Equipment, Software Subscription"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount</label>
                <input
                  required
                  type="number"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium shadow-lg shadow-rose-200 dark:shadow-none">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseModule;
