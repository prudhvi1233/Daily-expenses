import React, { useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdArrowBack, MdArrowUpward, MdArrowDownward, MdRemove, MdEdit, MdDelete, MdChevronLeft, MdChevronRight, MdAccountBalanceWallet } from 'react-icons/md';
import { format, startOfMonth, addMonths, subMonths, isSameMonth, parseISO } from 'date-fns';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from '../components/ConfirmModal';
import AddMoneyModal from '../components/AddMoneyModal';
import OtherDeductionModal from '../components/OtherDeductionModal';
import ExpenseForm from '../components/ExpenseForm';

const WalletHistory = () => {
  const { expenses, loading, deleteExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();
  
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [showOtherCategoriesOnly, setShowOtherCategoriesOnly] = useState(false);
  
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Group by Date for the selected month
  const { groupedDays, monthHasData } = useMemo(() => {
    // 1. Filter by selected month and type
    const monthExpenses = expenses.filter(tx => {
      if (tx.type !== 'income' && tx.type !== 'other_deduction') return false;
      
      if (showOtherCategoriesOnly) {
        if (tx.type !== 'other_deduction') return false;
        if (tx.category === 'Other Deduction' || !tx.category) return false;
      }

      const txDate = parseISO(tx.date);
      return isSameMonth(txDate, currentMonth);
    });

    if (monthExpenses.length === 0) return { groupedDays: [], monthHasData: false };

    // 2. Group by date string
    const groups = {};
    monthExpenses.forEach(tx => {
      const dateStr = tx.date;
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(tx);
    });

    // 3. Sort days descending and then sort items within each day by time descending
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b) - new Date(a));
    
    const structuredDays = sortedDates.map(dateStr => {
      const dayTransactions = groups[dateStr].sort((a, b) => {
        // Compare by time if available, otherwise fallback to created at or ID
        if (a.time && b.time) {
           return b.time.localeCompare(a.time);
        }
        return 0;
      });

      // Calculate Daily Summaries
      let dailyAdded = 0;
      let dailySpent = 0; // Personal expense + Other deduction

      dayTransactions.forEach(tx => {
        if (tx.type === 'income') {
          dailyAdded += tx.amount;
        } else {
          dailySpent += tx.amount;
        }
      });

      return {
        dateStr,
        dateObj: parseISO(dateStr),
        transactions: dayTransactions,
        dailyAdded,
        dailySpent
      };
    });

    return { groupedDays: structuredDays, monthHasData: true };
  }, [expenses, currentMonth]);

  // Handlers
  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteExpense(itemToDelete._id);
      setItemToDelete(null);
    }
  };

  const getDeleteWarningMessage = () => {
    if (!itemToDelete) return '';
    if (itemToDelete.type === 'income') {
      return `This will remove ₹${itemToDelete.amount.toFixed(2)} from your wallet balance.`;
    } else {
      // Both expense and other_deduction restore the wallet balance
      return `This will restore ₹${itemToDelete.amount.toFixed(2)} to your wallet balance.`;
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Loading history...</div>;

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/wallet')}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
            {showOtherCategoriesOnly ? 'Other Category History' : 'Wallet History'}
          </h1>
        </div>
        <button
          onClick={() => setShowOtherCategoriesOnly(!showOtherCategoriesOnly)}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors border ${
            showOtherCategoriesOnly 
              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-black/10 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          {showOtherCategoriesOnly ? 'View All History' : 'Other Category History'}
        </button>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between glass-panel p-4 mb-8">
        <button 
          onClick={handlePrevMonth}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MdChevronLeft size={28} />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 min-w-[150px] text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MdChevronRight size={28} />
        </button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {!monthHasData ? (
          <div className="text-center py-16 glass-panel">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdAccountBalanceWallet size={32} className="text-slate-400" />
            </div>
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
              No wallet activity found for {format(currentMonth, 'MMMM yyyy')}.
            </p>
          </div>
        ) : (
          groupedDays.map((dayGroup) => (
            <div key={dayGroup.dateStr} className="glass-panel overflow-hidden animate-fade-in">
              {/* Day Header */}
              <div className="bg-black/5 dark:bg-white/5 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="text-center flex flex-col bg-white dark:bg-slate-800 rounded-xl px-4 py-2 border border-black/5 dark:border-white/5 shadow-sm">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 leading-none mb-1">{format(dayGroup.dateObj, 'EEE')}</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-slate-100 leading-none">{format(dayGroup.dateObj, 'dd')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{format(dayGroup.dateObj, 'MMMM yyyy')}</h3>
                  </div>
                </div>
                
                {/* Daily Summary */}
                <div className="flex gap-4 sm:gap-6 text-sm bg-white/50 dark:bg-black/20 p-2 sm:p-0 sm:bg-transparent sm:dark:bg-transparent rounded-lg">
                  {dayGroup.dailyAdded > 0 && (
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Added</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{dayGroup.dailyAdded.toFixed(2)}</span>
                    </div>
                  )}
                  {dayGroup.dailySpent > 0 && (
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Spent</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">-₹{dayGroup.dailySpent.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-black/5 dark:divide-white/5">
                {dayGroup.transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const isOtherDeduction = tx.type === 'other_deduction';
                  const isExpense = (!tx.type || tx.type === 'expense');
                  
                  let icon = <MdArrowDownward size={20} />;
                  let iconBg = 'bg-rose-500/10 text-rose-500';
                  let amountColor = 'text-slate-800 dark:text-slate-100';
                  let typeLabel = 'Personal Expense';
                  
                  if (isIncome) {
                    icon = <MdArrowUpward size={20} />;
                    iconBg = 'bg-emerald-500/10 text-emerald-500';
                    amountColor = 'text-emerald-600 dark:text-emerald-400';
                    typeLabel = 'Money Added';
                  } else if (isOtherDeduction) {
                    icon = <MdRemove size={20} />;
                    iconBg = 'bg-orange-500/10 text-orange-500';
                    typeLabel = 'Other Deduction';
                  }

                  return (
                    <div 
                      key={tx._id}
                      className="p-4 sm:px-6 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                          {icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-0.5 mt-0.5">
                            <span className="bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">{tx.category || typeLabel}</span>
                            <span>•</span>
                            <span className="text-slate-400">{typeLabel}</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-1">
                            {formatTime12Hour(tx.time)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2 ml-16 sm:ml-0">
                        <p className={`text-lg font-black ${amountColor}`}>
                          {isIncome ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingItem(tx)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <MdEdit size={18} />
                          </button>
                          <button 
                            onClick={() => setItemToDelete(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <MdDelete size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {editingItem?.type === 'income' && (
        <AddMoneyModal 
          income={editingItem} 
          onClose={() => setEditingItem(null)} 
        />
      )}

      {editingItem?.type === 'other_deduction' && (
        <OtherDeductionModal 
          deduction={editingItem} 
          onClose={() => setEditingItem(null)} 
        />
      )}

      {(!editingItem?.type || editingItem?.type === 'expense') && editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm 
            expense={editingItem} 
            onClose={() => setEditingItem(null)} 
          />
        </div>
      )}

      <ConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction?"
        message={getDeleteWarningMessage() ? `Are you sure you want to delete "${itemToDelete?.description}" (₹${itemToDelete?.amount?.toFixed(2)})?\n\n${getDeleteWarningMessage()}` : `Are you sure you want to delete "${itemToDelete?.description}" (₹${itemToDelete?.amount?.toFixed(2)})?`}
      />
    </div>
  );
};

export default WalletHistory;
