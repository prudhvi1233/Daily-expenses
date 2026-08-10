import React, { useContext, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, parseISO, eachWeekOfInterval, startOfYear, endOfYear, endOfWeek, eachDayOfInterval } from 'date-fns';
import { MdArrowBack, MdReceipt, MdTrendingUp, MdCategory } from 'react-icons/md';
import TransactionTable from '../components/TransactionTable';
import ExpenseForm from '../components/ExpenseForm';

const WeeklyDetailPage = () => {
  const { year, week } = useParams();
  const navigate = useNavigate();
  const { expenses } = useContext(ExpenseContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const parsedYear = parseInt(year, 10);
  const weekIndex = parseInt(week, 10) - 1; // 0-indexed

  const weekInfo = useMemo(() => {
    const start = startOfYear(new Date(parsedYear, 0, 1));
    const end = endOfYear(new Date(parsedYear, 0, 1));
    const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
    const weekStart = weeks[weekIndex];
    if (!weekStart) return null;
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    return { weekStart, weekEnd };
  }, [parsedYear, weekIndex]);

  const { weekExpenses, summary, dailySubtotals } = useMemo(() => {
    if (!weekInfo) return { weekExpenses: [], summary: {}, dailySubtotals: [] };
    
    const { weekStart, weekEnd } = weekInfo;
    const filtered = expenses.filter(exp => {
      const isExpense = !exp.type || exp.type === 'expense';
      if (!isExpense) return false;
      const d = parseISO(exp.date);
      return d >= weekStart && d <= weekEnd;
    });

    const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);
    const count = filtered.length;
    
    const categories = {};
    const dailyTotals = {};
    
    filtered.forEach(exp => {
      categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
      const dStr = format(parseISO(exp.date), 'yyyy-MM-dd');
      dailyTotals[dStr] = (dailyTotals[dStr] || 0) + exp.amount;
    });

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const highestSpendingDayStr = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])[0]?.[0];
    const highestSpendingDay = highestSpendingDayStr ? format(parseISO(highestSpendingDayStr), 'EEEE') : 'N/A';

    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const subtotals = days.map(d => ({
      date: d,
      dateStr: format(d, 'yyyy-MM-dd'),
      dayName: format(d, 'EEEE'),
      amount: dailyTotals[format(d, 'yyyy-MM-dd')] || 0
    }));

    return { 
      weekExpenses: filtered, 
      summary: { total, count, topCategory, highestSpendingDay },
      dailySubtotals: subtotals
    };
  }, [expenses, weekInfo]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  if (!weekInfo) return <div className="text-slate-900 dark:text-white">Week not found</div>;

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/weekly')} className="p-2 glass-panel hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors">
            <MdArrowBack size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {format(weekInfo.weekStart, 'MMMM d')} - {format(weekInfo.weekEnd, 'MMMM d, yyyy')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Week {weekIndex + 1} of {parsedYear}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><MdReceipt size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Weekly Total</p><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{summary.total?.toFixed(2)}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><MdReceipt size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Transactions</p><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{summary.count}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><MdCategory size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Top Category</p><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">{summary.topCategory}</h3></div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20"><MdTrendingUp size={28} /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Highest Day</p><h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{summary.highestSpendingDay}</h3></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mb-8">
        <div className="glass-panel p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Daily Breakdown</h2>
          <div className="space-y-4">
            {dailySubtotals.map(day => (
              <div 
                key={day.dateStr} 
                onClick={() => navigate(`/dashboard/calendar/${day.dateStr}`)}
                className="flex justify-between items-center p-4 rounded-lg bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{day.dayName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{format(day.date, 'MMM d')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-lg ${day.amount > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
                    ₹{day.amount.toFixed(2)}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm expense={editingExpense} onClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default WeeklyDetailPage;
