import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Fetch all expenses
  const fetchExpenses = async (filters = {}) => {
    if (!user) return;
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/expenses?${params}`);
      console.log("API Response:", res.data);
      if (Array.isArray(res.data)) {
        setExpenses(res.data);
      } else {
        setExpenses([]);
        console.error("Expenses API did not return an array");
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching expenses');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const addExpense = async (expenseData) => {
    try {
      const res = await api.post('/expenses', expenseData);
      setExpenses(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error adding expense');
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const res = await api.put(`/expenses/${id}`, expenseData);
      setExpenses(prev => prev.map(exp => exp._id === id ? res.data : exp));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error updating expense');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error deleting expense');
    }
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      loading,
      error,
      fetchExpenses,
      addExpense,
      updateExpense,
      deleteExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
