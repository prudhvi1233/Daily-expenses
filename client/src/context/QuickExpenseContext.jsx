import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const QuickExpenseContext = createContext();

export const QuickExpenseProvider = ({ children }) => {
  const [quickExpenses, setQuickExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchQuickExpenses();
    } else {
      setQuickExpenses([]);
      setLoading(false);
    }
  }, [user]);

  const fetchQuickExpenses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/quick-expenses');
      setQuickExpenses(data);
    } catch (error) {
      console.error('Error fetching quick expenses:', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const addQuickExpense = async (expenseData) => {
    try {
      const { data } = await api.post('/quick-expenses', expenseData);
      setQuickExpenses((prev) => [...prev, data]);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  };

  const updateQuickExpense = async (id, expenseData) => {
    try {
      const { data } = await api.put(`/quick-expenses/${id}`, expenseData);
      setQuickExpenses((prev) => prev.map(exp => exp._id === id ? data : exp));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  };

  const deleteQuickExpense = async (id) => {
    try {
      await api.delete(`/quick-expenses/${id}`);
      setQuickExpenses((prev) => prev.filter(exp => exp._id !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message);
    }
  };

  return (
    <QuickExpenseContext.Provider value={{
      quickExpenses,
      loading,
      addQuickExpense,
      updateQuickExpense,
      deleteQuickExpense,
      fetchQuickExpenses
    }}>
      {children}
    </QuickExpenseContext.Provider>
  );
};
