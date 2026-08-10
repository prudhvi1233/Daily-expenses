import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const StatCard = ({ title, value }) => (
  <div className="glass-panel p-6">
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">{title}</p>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
  </div>
);

const Analytics = () => {
  const { expenses, loading } = useContext(ExpenseContext);

  const stats = useMemo(() => {
    if (expenses.length === 0) return null;

    let total = 0;
    const catMap = {}; // amount per category
    
    // Find min and max dates to calculate accurate averages over time
    let minDate = new Date(expenses[0].date).getTime();
    let maxDate = new Date(expenses[0].date).getTime();

    expenses.forEach(exp => {
      total += exp.amount;
      catMap[exp.category] = (catMap[exp.category] || 0) + exp.amount;
      
      const expDate = new Date(exp.date).getTime();
      if (expDate < minDate) minDate = expDate;
      if (expDate > maxDate) maxDate = expDate;
    });

    // Calculate timespan in days (add 1 so a single day counts as 1 full day)
    const msPerDay = 1000 * 60 * 60 * 24;
    let days = (maxDate - minDate) / msPerDay + 1; 
    
    // Calculate averages based on total days tracked
    const avgDaily = total / days;
    const avgWeekly = avgDaily * 7;
    const avgMonthly = avgDaily * 30.44; // average days in a month

    // Sort category breakdown by highest spent first
    const categoryBreakdown = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1]); 

    return {
      avgDaily,
      avgWeekly,
      avgMonthly,
      categoryBreakdown
    };
  }, [expenses]);

  if (loading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading analytics...</div>;
  if (!stats) return <div className="text-center py-10 text-slate-500 dark:text-slate-400">Not enough data for analytics.</div>;

  return (
    <div className="pb-12">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">Analytics Insights</h1>
      
      {/* Averages Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Avg. Daily Expense" value={`₹${stats.avgDaily.toFixed(2)}`} />
        <StatCard title="Avg. Weekly Expense" value={`₹${stats.avgWeekly.toFixed(2)}`} />
        <StatCard title="Avg. Monthly Expense" value={`₹${stats.avgMonthly.toFixed(2)}`} />
      </div>

      {/* Category Breakdown Section */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Category Wise Spending</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.categoryBreakdown.map(([category, amount]) => (
          <div key={category} className="glass-panel p-4 flex justify-between items-center border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">₹{amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
