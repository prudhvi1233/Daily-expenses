import React from 'react';
import { MdSearch, MdClear, MdFilterList } from 'react-icons/md';

const FilterBar = ({ filters, setFilters }) => {
  const handleDateChange = (e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }));
  const handleCategoryChange = (e) => setFilters(prev => ({ ...prev, category: e.target.value }));
  const handleMethodChange = (e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }));

  const hasActiveFilters = filters.dateRange !== 'All' || filters.category !== 'All' || filters.paymentMethod !== 'All' || filters.search !== '';

  const clearFilters = () => {
    setFilters({
      dateRange: 'All',
      category: 'All',
      paymentMethod: 'All',
      search: ''
    });
  };

  return (
    <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-6 shadow-sm flex flex-col gap-4">
      
      {/* Top Row: Search and Title (Mobile) / Clear (Desktop) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search descriptions or amount..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all sm:text-sm"
          />
        </div>
        
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            <MdClear size={16} /> Clear Filters
          </button>
        )}
      </div>

      {/* Bottom Row: Select Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-400 hidden sm:flex">
          <MdFilterList size={18} />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <select 
          value={filters.dateRange} 
          onChange={handleDateChange}
          className="flex-1 sm:flex-none min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer appearance-none shadow-sm"
        >
          <option value="All">All Time</option>
          <option value="Today">Today</option>
          <option value="Yesterday">Yesterday</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>

        <select 
          value={filters.category} 
          onChange={handleCategoryChange}
          className="flex-1 sm:flex-none min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer appearance-none shadow-sm"
        >
          <option value="All">All Categories</option>
          {['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select 
          value={filters.paymentMethod} 
          onChange={handleMethodChange}
          className="flex-1 sm:flex-none min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-3 text-sm text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 cursor-pointer appearance-none shadow-sm"
        >
          <option value="All">All Methods</option>
          {['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="md:hidden flex items-center justify-center gap-1.5 flex-1 min-w-[140px] px-3 py-1.5 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors border border-red-100 dark:border-red-500/20"
          >
            <MdClear size={16} /> Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
