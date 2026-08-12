import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdAccountBalanceWallet, MdAdd, MdArrowUpward, MdArrowDownward, MdHistory, MdRemove } from 'react-icons/md';
import AddMoneyModal from '../components/AddMoneyModal';
import OtherDeductionModal from '../components/OtherDeductionModal';
import { formatTime12Hour } from '../utils/formatTime';

const Wallet = () => {
  const { user } = useContext(AuthContext);
  const { expenses, loading } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading wallet...</div>;

  // Calculate totals
  const totalAdded = expenses.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = expenses.filter(t => (!t.type || t.type === 'expense')).reduce((sum, t) => sum + t.amount, 0);
  const totalDeducted = expenses.filter(t => t.type === 'other_deduction').reduce((sum, t) => sum + t.amount, 0);

  // Recent transactions
  const displayTransactions = showAll ? expenses : expenses.slice(0, 10);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="glass-panel p-6 sm:p-8 mb-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <MdAccountBalanceWallet size={28} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Wallet</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Your available money at a glance.</p>
          
          <div className="mb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Available Balance</p>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-800 dark:text-white tracking-tight">
              ₹{user?.walletBalance?.toFixed(2) || '0.00'}
            </h2>
          </div>
        </div>
        <div className="relative z-10 w-full sm:w-auto flex flex-col items-center sm:items-end gap-2">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1"
            >
              <MdAdd size={22} />
              <span>Add Money</span>
            </button>

            <button 
              onClick={() => setIsDeductionModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-slate-900/20 hover:-translate-y-1"
            >
              <MdRemove size={22} />
              <span>Other Deduction</span>
            </button>
          </div>
          
          <button 
            onClick={() => navigate('/dashboard/wallet/history')}
            className="text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            Wallet History <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10">
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <MdArrowUpward size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Money Added</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">₹{totalAdded.toFixed(2)}</h3>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <MdArrowDownward size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Personal Expenses</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">₹{totalSpent.toFixed(2)}</h3>
          </div>
        </div>
        <div className="glass-panel p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
            <MdRemove size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Other Deductions</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">₹{totalDeducted.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <MdHistory size={24} className="text-slate-600 dark:text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdAccountBalanceWallet size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Your wallet is empty</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">Add your current available money to start tracking your spending.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              + Add Money Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTransactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const isOtherDeduction = tx.type === 'other_deduction';
              
              let icon = <MdArrowDownward size={20} />;
              let iconBg = 'bg-rose-500/10 text-rose-500';
              let amountColor = 'text-slate-800 dark:text-slate-100';
              let categoryText = tx.category;

              if (isIncome) {
                icon = <MdArrowUpward size={20} />;
                iconBg = 'bg-emerald-500/10 text-emerald-500';
                amountColor = 'text-emerald-600 dark:text-emerald-400';
              } else if (isOtherDeduction) {
                icon = <MdRemove size={20} />;
                iconBg = 'bg-orange-500/10 text-orange-500';
                categoryText = 'Other Deduction';
              }

              return (
                <div 
                  key={tx._id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{tx.description}</p>
                      <p className="text-xs sm:text-sm text-slate-500 truncate flex gap-1">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span>{formatTime12Hour(tx.time)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <p className={`font-bold ${amountColor}`}>
                      {isIncome ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">{categoryText}</p>
                  </div>
                </div>
              );
            })}

            {expenses.filter(t => t.type === 'income' || t.type === 'other_deduction').length > 10 && !showAll && (
              <button 
                onClick={() => navigate('/dashboard/wallet/history')}
                className="w-full py-4 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
              >
                View Complete Wallet History <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <AddMoneyModal onClose={() => setIsAddModalOpen(false)} />
      )}
      {isDeductionModalOpen && (
        <OtherDeductionModal onClose={() => setIsDeductionModalOpen(false)} />
      )}
    </div>
  );
};

export default Wallet;
