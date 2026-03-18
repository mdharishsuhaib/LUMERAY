import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { useCurrency, formatAmount } from '../../context/CurrencyContext';
import { Trash2 } from 'lucide-react';

export const Transactions = () => {
  const { expenses, deleteExpense, loading } = useExpenses();
  const { defaultCurrency } = useCurrency();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Transactions</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading transactions...</div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No transactions found. Add your first expense from the Dashboard!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                  <th className="p-4">Date</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">{exp.date}</td>
                    <td className="p-4 font-medium text-gray-900">{exp.description}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">
                      {/* Show symbol + amount + currency code e.g. ₹500.00 INR */}
                      {formatAmount(Number(exp.amount), exp.currency || defaultCurrency)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
