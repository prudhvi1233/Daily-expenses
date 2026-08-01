import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, goalsRes] = await Promise.all([
        api.get('/budgets'),
        api.get('/goals')
      ]);
      setBudgets(budgetsRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFinanceData();
    } else {
      setBudgets([]);
      setGoals([]);
    }
  }, [user]);

  const setBudget = async (category, amount) => {
    try {
      await api.post('/budgets', { category, amount });
      fetchFinanceData();
    } catch (error) {
      console.error(error);
    }
  };

  const createGoal = async (goalData) => {
    try {
      await api.post('/goals', goalData);
      fetchFinanceData();
    } catch (error) {
      console.error(error);
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      await api.put(`/goals/${id}`, goalData);
      fetchFinanceData();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await api.delete(`/goals/${id}`);
      fetchFinanceData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FinanceContext.Provider value={{ budgets, goals, loading, setBudget, createGoal, updateGoal, deleteGoal }}>
      {children}
    </FinanceContext.Provider>
  );
};
