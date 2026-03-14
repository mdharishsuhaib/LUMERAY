import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { Expense } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from local storage as fallback
  const loadLocalExpenses = () => {
    const local = localStorage.getItem('lumeray_expenses');
    if (local) {
      setExpenses(JSON.parse(local));
    }
  };

  const saveLocalExpenses = (newExpenses: Expense[]) => {
    localStorage.setItem('lumeray_expenses', JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/expenses');
      setExpenses(res.data);
      localStorage.setItem('lumeray_expenses', JSON.stringify(res.data));
    } catch (error) {
      console.warn("Backend unreachable, using local data.");
      loadLocalExpenses();
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      await API.post('/expenses/add', expenseData);
      fetchExpenses();
    } catch (error) {
      console.warn("Backend unreachable, saving locally.");
      const newExpense = { ...expenseData, id: Date.now() };
      saveLocalExpenses([...expenses, newExpense]);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      // Assuming you will add a DELETE route in your backend: router.delete("/:id", auth, expenseController.deleteExpense);
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.warn("Backend unreachable, deleting locally.");
      saveLocalExpenses(expenses.filter(e => e.id !== id));
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, fetchExpenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
