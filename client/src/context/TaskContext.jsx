import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, res.data].sort((a, b) => a.time.localeCompare(b.time)));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error adding task');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t).sort((a, b) => a.time.localeCompare(b.time)));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error updating task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Error deleting task');
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
