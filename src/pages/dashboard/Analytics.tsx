import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export const Analytics = () => {
  const { expenses } = useExpenses();

  // ✅ FIX: Removed useEffect(() => { fetchExpenses() }) here.
  // Same reason as Transactions.tsx — context handles this globally.

  const categoryData = expenses.reduce((acc: any, exp) => {
    const existing = acc.find((item: any) => item.name === exp.category);
    if (existing) {
      existing.value += Number(exp.amount);
    } else {
      acc.push({ name: exp.category, value: Number(exp.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Expenses by Category</h2>

        {expenses.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Not enough data to generate analytics. Start adding expenses!
          </div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
