import React, { useState, useContext, useMemo } from 'react';
import TransactionTable from '../components/TransactionTable';
import ExpenseForm from '../components/ExpenseForm';
import FilterBar from '../components/FilterBar';
import { ExpenseContext } from '../context/ExpenseContext';
import { isToday, isYesterday, subDays, isThisMonth, isThisYear, isAfter } from 'date-fns';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { MdDownload, MdPictureAsPdf, MdGridOn } from 'react-icons/md';

const Transactions = () => {
  const { expenses } = useContext(ExpenseContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [filters, setFilters] = useState({
    dateRange: 'All',
    category: 'All',
    paymentMethod: 'All',
    search: ''
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      if (exp.type === 'other_deduction') return false;

      // 1. Search Filter
      const searchMatch = 
        exp.description.toLowerCase().includes(filters.search.toLowerCase()) || 
        exp.amount.toString().includes(filters.search);
      if (!searchMatch) return false;

      // 2. Category Filter
      if (filters.category !== 'All' && exp.category !== filters.category) return false;

      // 3. Payment Method Filter
      if (filters.paymentMethod !== 'All' && exp.paymentMethod !== filters.paymentMethod) return false;

      // 4. Date Range Filter
      const date = new Date(exp.date);
      const today = new Date();
      switch (filters.dateRange) {
        case 'Today': return isToday(date);
        case 'Yesterday': return isYesterday(date);
        case 'Last 7 Days': return isAfter(date, subDays(today, 7));
        case 'Last 30 Days': return isAfter(date, subDays(today, 30));
        case 'This Month': return isThisMonth(date);
        case 'This Year': return isThisYear(date);
        default: return true;
      }
    });
  }, [expenses, filters]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage all your expenses in one place</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => exportToCSV(filteredExpenses)} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-400 shadow-sm"
            title="Export to CSV"
          >
            <MdDownload size={16} /> <span className="hidden sm:inline">CSV</span>
          </button>
          <button 
            onClick={() => exportToExcel(filteredExpenses)} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-green-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-green-400 shadow-sm"
            title="Export to Excel"
          >
            <MdGridOn size={16} /> <span className="hidden sm:inline">Excel</span>
          </button>
          <button 
            onClick={() => exportToPDF(filteredExpenses)} 
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-red-600 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-red-400 shadow-sm"
            title="Export to PDF"
          >
            <MdPictureAsPdf size={16} /> <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="glass-panel overflow-hidden">
        <TransactionTable expenses={filteredExpenses} onEdit={handleEdit} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm 
            expense={editingExpense} 
            onClose={handleClose} 
          />
        </div>
      )}
    </div>
  );
};

export default Transactions;
