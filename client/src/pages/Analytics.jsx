import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const StatCard = ({ title, value }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg">
    <p className="text-sm text-slate-400 font-medium mb-2">{title}</p>
    <h3 className="text-xl font-bold text-slate-100">{value}</h3>
  </div>
);

const Analytics = () => {
  const { expenses, loading } = useContext(ExpenseContext);

  const stats = useMemo(() => {
    if (expenses.length === 0) return null;

    let maxExp = expenses[0];
    let minExp = expenses[0];
    let total = 0;
    const catMap = {};
    const methodMap = {};

    expenses.forEach(exp => {
      if (exp.amount > maxExp.amount) maxExp = exp;
      if (exp.amount < minExp.amount) minExp = exp;
      total += exp.amount;
      
      catMap[exp.category] = (catMap[exp.category] || 0) + 1;
      methodMap[exp.paymentMethod] = (methodMap[exp.paymentMethod] || 0) + 1;
    });

    const mostUsedCat = Object.keys(catMap).reduce((a, b) => catMap[a] > catMap[b] ? a : b);
    const mostUsedMethod = Object.keys(methodMap).reduce((a, b) => methodMap[a] > methodMap[b] ? a : b);

    // Simplistic averages
    const days = new Set(expenses.map(e => new Date(e.date).toDateString())).size || 1;
    const avgDaily = total / days;

    return {
      highest: maxExp,
      lowest: minExp,
      avgDaily,
      mostUsedCat,
      mostUsedMethod
    };
  }, [expenses]);

  if (loading) return <div className="text-center py-10 text-slate-400">Loading analytics...</div>;
  if (!stats) return <div className="text-center py-10 text-slate-400">Not enough data for analytics.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Analytics Insights</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Highest Expense" value={`₹${stats.highest.amount.toFixed(2)} (${stats.highest.category})`} />
        <StatCard title="Lowest Expense" value={`₹${stats.lowest.amount.toFixed(2)} (${stats.lowest.category})`} />
        <StatCard title="Average Daily Expense" value={`₹${stats.avgDaily.toFixed(2)}`} />
        <StatCard title="Most Used Category" value={stats.mostUsedCat} />
        <StatCard title="Most Used Payment Method" value={stats.mostUsedMethod} />
      </div>
    </div>
  );
};

export default Analytics;
