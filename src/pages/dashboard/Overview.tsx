import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useCurrency, CURRENCIES, getCurrency, formatAmount } from '../../context/CurrencyContext';
import { DollarSign, Plus, TrendingUp, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try { return new Date(dateStr).toISOString().split('T')[0]; }
  catch { return dateStr; }
};

const CurrencyDropdown = ({ value, onChange }: { value: string; onChange: (code: string) => void }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = getCurrency(value);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} className="relative w-28">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-1 px-2 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <span>{selected.symbol} {selected.code}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto">
          {CURRENCIES.map(c => (
            <button key={c.code} type="button" onClick={() => { onChange(c.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${c.code === value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700'}`}>
              <span className="w-6 text-center">{c.symbol}</span>
              <span>{c.code}</span>
              <span className="text-gray-400 text-xs truncate">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Overview = () => {
  const { expenses, addExpense, loading, error } = useExpenses();
  const { defaultCurrency } = useCurrency();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [adding, setAdding] = useState(false);
  const [currency, setCurrency] = useState(defaultCurrency);

  // ✅ FIX: sync currency when user changes default in Settings
  useEffect(() => { setCurrency(defaultCurrency); }, [defaultCurrency]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    setAdding(true);
    try {
      await addExpense({ amount: Number(amount), category, description, date, currency });
      setAmount(''); setDescription(''); setCurrency(defaultCurrency);
    } catch { /* error shown via context */ } finally { setAdding(false); }
  };

  const totalsByCurrency = expenses.reduce((acc: Record<string, number>, exp) => {
    const c = exp.currency || defaultCurrency;
    acc[c] = (acc[c] || 0) + Number(exp.amount);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Expenses</p>
            {Object.keys(totalsByCurrency).length === 0
              ? <p className="text-2xl font-bold text-gray-900">—</p>
              : Object.entries(totalsByCurrency).map(([code, total]) => (
                <p key={code} className="text-xl font-bold text-gray-900">{formatAmount(total, code)}</p>
              ))}
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
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Add New Expense
          </h2>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount & Currency</label>
              <div className="flex gap-2">
                <input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="0.00" />
                <CurrencyDropdown value={currency} onChange={setCurrency} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Set your default currency in Settings</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500">
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
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Lunch at cafe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <button type="submit" disabled={adding || loading}
              className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
              {adding ? 'Adding...' : 'Add Expense'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No expenses yet. Start tracking by adding one!</div>
          ) : (
            <div className="space-y-4">
              {expenses.slice(-5).reverse().map((exp) => (
                <div key={exp.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl bg-gray-50/50">
                  <div>
                    <p className="font-medium text-gray-900">{exp.description}</p>
                    {/* ✅ FIX: format ISO date from DB */}
                    <p className="text-sm text-gray-500">{exp.category} • {formatDate(exp.date)}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatAmount(Number(exp.amount), exp.currency || defaultCurrency)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
