import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api';
import { Expense } from '../types';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  error: string;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const LOCAL_KEY = 'lumeray_expenses';

// ✅ Detect and remove stale locally-saved expenses (those with Date.now() IDs).
// These were saved before the JWT fix and have no matching record in the DB.
// Real DB expenses have small sequential IDs (1, 2, 3...).
// Local fallback IDs are 13-digit timestamps like 1773852894812.
const clearStaleLocalExpenses = () => {
  try {
    const local = localStorage.getItem(LOCAL_KEY);
    if (!local) return;
    const parsed: Expense[] = JSON.parse(local);
    const hasStaleIds = parsed.some(e => e.id > 9999999999); // 10+ digit = Date.now()
    if (hasStaleIds) {
      localStorage.removeItem(LOCAL_KEY);
      console.info('Cleared stale local expenses — will reload from database.');
    }
  } catch {
    localStorage.removeItem(LOCAL_KEY);
  }
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    clearStaleLocalExpenses(); // run once on init
    try {
      const local = localStorage.getItem(LOCAL_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveAndSet = (newExpenses: Expense[]) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/expenses');
      saveAndSet(res.data);
    } catch (err: any) {
      // Don't wipe state on failure — keep cached data
      console.warn('Could not fetch from backend, showing cached data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    setError('');
    try {
      // ✅ Only save to DB — no local fallback with fake IDs.
      // If this fails, the error is shown to the user instead of
      // silently saving with a Date.now() ID that breaks delete later.
      await API.post('/expenses/add', expenseData);
      await fetchExpenses(); // reload with real DB-assigned ID
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to add expense. Please try again.';
      setError(msg);
      throw err; // let the form know it failed
    }
  };

  const deleteExpense = async (id: number) => {
    setError('');
    // Optimistic UI — remove instantly
    const previous = expenses;
    saveAndSet(expenses.filter(e => e.id !== id));
    try {
      await API.delete(`/expenses/${id}`);
      // Success — already removed from UI
    } catch (err: any) {
      // Revert optimistic update on failure
      saveAndSet(previous);
      const msg = err.response?.data?.error || 'Failed to delete expense. Please try again.';
      setError(msg);
    }
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, error, fetchExpenses, addExpense, deleteExpense }}>
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
