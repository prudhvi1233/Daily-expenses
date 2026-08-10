import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdArrowBack, MdArrowUpward, MdAccountBalanceWallet, MdEdit, MdDelete } from 'react-icons/md';
import { format } from 'date-fns';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from '../components/ConfirmModal';
import AddMoneyModal from '../components/AddMoneyModal';

const IncomeHistory = () => {
  const { expenses, loading, deleteExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();
  
  const [editingIncome, setEditingIncome] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const incomeTransactions = expenses.filter(t => t.type === 'income');

  if (loading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading history...</div>;

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/wallet')} 
          className="p-2 glass-panel hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors rounded-xl"
        >
          <MdArrowBack size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Income History</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">A complete record of money added to your wallet</p>
        </div>
      </div>

      <div className="glass-panel p-4 sm:p-6">
        {incomeTransactions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
              <MdAccountBalanceWallet size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No money added yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Any money you add to your wallet will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {incomeTransactions.map((tx) => (
              <div 
                key={tx._id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                    <MdArrowUpward size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-lg text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                    <p className="text-sm text-slate-500 truncate flex gap-1.5 items-center mt-0.5">
                      <span className="font-medium">{tx.category}</span>
                      <span>•</span>
                      <span>{format(new Date(tx.date), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span>{formatTime12Hour(tx.time)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right ml-4">
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    +₹{tx.amount.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => setEditingIncome(tx)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      title="Edit"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button 
                      onClick={() => setItemToDelete(tx._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingIncome && (
        <AddMoneyModal 
          income={editingIncome} 
          onClose={() => setEditingIncome(null)} 
        />
      )}

      <ConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) deleteExpense(itemToDelete);
        }}
        title="Delete Added Money"
        message="Are you sure you want to delete this record? This will reduce your wallet balance by this amount."
      />
    </div>
  );
};

export default IncomeHistory;
