import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { DollarSign, Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const Overview = () => {
  const { expenses, addExpense, loading } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // ✅ FIX: Removed useEffect(() => { fetchExpenses() }) here.
  // ExpenseContext already fetches on mount — calling it again per-page
  // caused a race condition where the fallback wiped in-memory state.

  const totalExpense = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    await addExpense({
      amount: Number(amount),
      category,
      description,
      date
    });

    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalExpense.toFixed(2)}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
            <h3 className="text-2xl font-bold text-gray-900">{expenses.length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Add New Expense
          </h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Food">Food & Dining</option>
                <option value="Transport">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Lunch at cafe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>

        {/* Recent Transactions Preview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No expenses yet. Start tracking by adding one!
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.slice(-5).reverse().map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl bg-gray-50/50">
                  <div>
                    <p className="font-medium text-gray-900">{exp.description}</p>
                    <p className="text-sm text-gray-500">{exp.category} • {exp.date}</p>
                  </div>
                  <span className="font-semibold text-gray-900">${Number(exp.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
