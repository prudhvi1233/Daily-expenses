import React from 'react';

const FilterBar = ({ filters, setFilters }) => {
  const handleDateChange = (e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }));
  const handleCategoryChange = (e) => setFilters(prev => ({ ...prev, category: e.target.value }));
  const handleMethodChange = (e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }));

  return (
    <div className="glass-panel p-4 mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time Period</label>
        <select 
          value={filters.dateRange} 
          onChange={handleDateChange}
          className="bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">Category</label>
        <select 
          value={filters.category} 
          onChange={handleCategoryChange}
          className="bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="All">All Categories</option>
          {['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
        <select 
          value={filters.paymentMethod} 
          onChange={handleMethodChange}
          className="bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="All">All Methods</option>
          {['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 min-w-[200px] flex flex-col">
        <label className="text-xs text-slate-500 dark:text-slate-400 mb-1">Search</label>
        <input 
          type="text" 
          placeholder="Search descriptions or amount..." 
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2 text-sm text-slate-900 dark:text-slate-200 outline-none focus:border-blue-500 w-full"
        />
      </div>
    </div>
  );
};

export default FilterBar;
