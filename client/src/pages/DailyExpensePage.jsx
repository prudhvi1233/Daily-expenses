import React, { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, parseISO } from 'date-fns';
import { MdArrowBack, MdReceipt, MdTrendingUp, MdCategory, MdAdd } from 'react-icons/md';
import TransactionTable from '../components/TransactionTable';
import ExpenseForm from '../components/ExpenseForm';

const DailyExpensePage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { expenses } = useContext(ExpenseContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const parsedDate = parseISO(date);

  const dailyExpenses = useMemo(() => {
    return expenses.filter(exp => 
      (!exp.type || exp.type === 'expense') && 
      format(new Date(exp.date), 'yyyy-MM-dd') === date
    );
  }, [expenses, date]);

  const summary = useMemo(() => {
    const total = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const count = dailyExpenses.length;
    const highest = dailyExpenses.reduce((max, exp) => exp.amount > max ? exp.amount : max, 0);
    
    const categories = {};
    dailyExpenses.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { total, count, highest, topCategory };
  }, [dailyExpenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleAddNew = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/calendar')} className="p-2 glass-panel hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
            <MdArrowBack size={24} />
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {format(parsedDate, 'MMMM d, yyyy')}
          </h1>
        </div>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <MdAdd size={20} />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><MdReceipt size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Total Spent</p><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{summary.total.toFixed(2)}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><MdReceipt size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Transactions</p><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{summary.count}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><MdTrendingUp size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Highest Expense</p><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{summary.highest.toFixed(2)}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><MdCategory size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Top Category</p><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{summary.topCategory}</h3></div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden mb-8">
        <div className="p-6 border-b border-black/10 dark:border-white/10">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Transactions</h2>
        </div>
        <div className="p-6">
          {dailyExpenses.length > 0 ? (
            <TransactionTable expenses={dailyExpenses} onEdit={handleEdit} />
          ) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              No expenses recorded for this date.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm expense={editingExpense} onClose={handleClose} defaultDate={date} />
        </div>
      )}
    </div>
  );
};

export default DailyExpensePage;
