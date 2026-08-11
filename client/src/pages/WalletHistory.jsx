import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdArrowBack, MdArrowUpward, MdRemove, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { format } from 'date-fns';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from '../components/ConfirmModal';
import AddMoneyModal from '../components/AddMoneyModal';
import OtherDeductionModal from '../components/OtherDeductionModal';

const WalletHistory = () => {
  const { expenses, loading, deleteExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();
  
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'other_deduction'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Filter and search
  const filteredHistory = useMemo(() => {
    return expenses.filter(tx => {
      // Must be either income or other_deduction
      if (tx.type !== 'income' && tx.type !== 'other_deduction') return false;

      // Filter by type
      if (filterType !== 'all' && tx.type !== filterType) return false;

      // Search by description
      if (searchQuery && !tx.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [expenses, filterType, searchQuery]);

  // Handlers
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
      return `This will restore ₹${itemToDelete.amount.toFixed(2)} to your wallet balance.`;
    }
  };

  if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Loading history...</div>;

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/wallet')}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MdArrowBack size={24} />
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Wallet History</h1>
      </div>

      <div className="glass-panel p-4 sm:p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-xl w-full sm:w-auto">
          {['all', 'income', 'other_deduction'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {type === 'all' ? 'All' : type === 'income' ? 'Money Added' : 'Other Deductions'}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <MdSearch size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search description..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              {searchQuery ? 'No matching records found' : 
               filterType === 'income' ? 'No Money Added Records Yet' :
               filterType === 'other_deduction' ? 'No Other Deductions Yet' :
               'No Wallet History Yet. Money added and other deductions will appear here.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((tx) => {
              const isIncome = tx.type === 'income';
              
              let icon = <MdArrowUpward size={20} />;
              let iconBg = 'bg-emerald-500/10 text-emerald-500';
              let amountColor = 'text-emerald-600 dark:text-emerald-400';
              let categoryText = 'Money Added';
              
              if (!isIncome) {
                icon = <MdRemove size={20} />;
                iconBg = 'bg-orange-500/10 text-orange-500';
                amountColor = 'text-slate-800 dark:text-slate-100';
                categoryText = 'Other Deduction';
              }

              return (
                <div 
                  key={tx._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors gap-4 sm:gap-0"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-lg text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                      <p className="text-sm font-medium text-slate-500 mb-0.5">{categoryText}</p>
                      <p className="text-xs text-slate-400 truncate flex gap-1">
                        <span>{format(new Date(tx.date), 'MMM dd')}</span>
                        <span>•</span>
                        <span>{formatTime12Hour(tx.time)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end gap-3 sm:gap-2 border-t sm:border-0 border-black/5 dark:border-white/5 pt-3 sm:pt-0">
                    <p className={`text-xl font-black ${amountColor}`}>
                      {isIncome ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingItem(tx)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MdEdit size={14} /> Edit
                      </button>
                      <button 
                        onClick={() => setItemToDelete(tx)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-black/5 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MdDelete size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

      <ConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete?.type === 'income' ? 'Money Added' : 'Other Deduction'}?`}
        message={`Are you sure you want to delete "${itemToDelete?.description}" (₹${itemToDelete?.amount?.toFixed(2)})?\n\n${getDeleteWarningMessage()}`}
      />
    </div>
  );
};

export default WalletHistory;
