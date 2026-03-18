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
 
const LOCAL_KEY = 'lumeray_expenses';
 
export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    // ✅ FIX 1: Initialize state directly from localStorage so data
    // is available instantly on every page — no flicker, no reset.
    try {
      const local = localStorage.getItem(LOCAL_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
 
  const saveAndSet = (newExpenses: Expense[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };
 
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/expenses');
      // ✅ FIX 2: On success, update both state and localStorage.
      saveAndSet(res.data);
    } catch (error) {
      // ✅ FIX 3: On failure, do NOT clear state. Keep whatever is
      // already in state (initialized from localStorage above).
      // This means navigating to Transactions will never show $0
      // just because the backend is sleeping or slow.
      console.warn('Backend unreachable, showing cached data.');
    } finally {
      setLoading(false);
    }
  }, []);
 
  // ✅ FIX 4: Fetch from backend once on app start to sync latest data.
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
 
  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    try {
      await API.post('/expenses/add', expenseData);
      // ✅ FIX 5: After adding, re-fetch to get the server-assigned ID.
      await fetchExpenses();
    } catch (error) {
      console.warn('Backend unreachable, saving locally.');
      const newExpense = { ...expenseData, id: Date.now() };
      saveAndSet([...expenses, newExpense]);
    }
  };
 
  const deleteExpense = async (id: number) => {
    // ✅ FIX 6: Optimistic delete — remove from state immediately for
    // instant UI feedback, then sync with backend.
    const previous = expenses;
    saveAndSet(expenses.filter(e => e.id !== id));
    try {
      await API.delete(`/expenses/${id}`);
    } catch (error) {
      console.warn('Backend delete failed, reverting.');
      // Revert if backend call fails
      saveAndSet(previous);
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
 