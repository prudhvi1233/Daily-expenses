import React, { useState, useContext, useMemo } from 'react';
import TransactionTable from '../components/TransactionTable';
import ExpenseForm from '../components/ExpenseForm';
import FilterBar from '../components/FilterBar';
import { ExpenseContext } from '../context/ExpenseContext';
import { isToday, isYesterday, subDays, isThisMonth, isThisYear, isAfter } from 'date-fns';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-100">Transactions</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-sm">
            <button onClick={() => exportToCSV(filteredExpenses)} className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors border-r border-slate-700">CSV</button>
            <button onClick={() => exportToExcel(filteredExpenses)} className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors border-r border-slate-700">Excel</button>
            <button onClick={() => exportToPDF(filteredExpenses)} className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-1">PDF</button>
          </div>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />

      <TransactionTable expenses={filteredExpenses} onEdit={handleEdit} />

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
