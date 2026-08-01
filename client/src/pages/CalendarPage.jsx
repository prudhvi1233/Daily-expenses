import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, eachMonthOfInterval, startOfYear, endOfYear, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const CalendarPage = () => {
  const { expenses } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 0, 1));
    return eachMonthOfInterval({ start, end });
  }, [currentYear]);

  // Pre-calculate daily totals
  const dailyTotals = useMemo(() => {
    const totals = {};
    expenses.forEach(exp => {
      const dateStr = format(new Date(exp.date), 'yyyy-MM-dd');
      totals[dateStr] = (totals[dateStr] || 0) + exp.amount;
    });
    return totals;
  }, [expenses]);

  const getColorClass = (amount) => {
    if (!amount) return 'bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300';
    if (amount < 500) return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30';
    if (amount < 2000) return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30';
    return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30';
  };

  const renderMonth = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start); // 0 = Sunday

    // Pad beginning of month
    const padding = Array(startDayOfWeek).fill(null);
    const isCurrentMonth = format(monthDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

    return (
      <div key={monthDate.toISOString()} className={`glass-panel p-4 transition-colors ${isCurrentMonth ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-blue-500/5' : 'hover:border-black/20 dark:hover:border-white/20'}`}>
        <h3 className={`text-lg font-bold mb-3 text-center ${isCurrentMonth ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>{format(monthDate, 'MMMM')}</h3>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-slate-600 dark:text-slate-500 font-medium">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {padding.map((_, i) => <div key={`pad-${i}`} className="aspect-square"></div>)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const amount = dailyTotals[dateStr];
            const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
            return (
              <button
                key={dateStr}
                onClick={() => navigate(`/dashboard/calendar/${dateStr}`)}
                className={`aspect-square rounded-md flex items-center justify-center text-xs transition-all duration-200 hover:scale-110 ${getColorClass(amount)} ${isToday ? 'ring-2 ring-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] z-10 text-white font-bold' : ''}`}
                title={`${format(day, 'MMM d, yyyy')}${amount ? `: ₹${amount.toFixed(2)}` : ''}${isToday ? ' (Today)' : ''}`}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Calendar</h1>
        <div className="flex items-center gap-4 glass-panel p-1">
          <button onClick={() => setCurrentYear(y => y - 1)} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 rounded-md transition-colors"><MdChevronLeft size={24} /></button>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200 w-16 text-center">{currentYear}</span>
          <button onClick={() => setCurrentYear(y => y + 1)} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 rounded-md transition-colors"><MdChevronRight size={24} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map(renderMonth)}
      </div>
      
      <div className="mt-8 p-4 glass-panel flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10"></div> No Expenses</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div> &lt; ₹500</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30"></div> ₹500 - ₹2000</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div> &gt; ₹2000</div>
      </div>
    </div>
  );
};

export default CalendarPage;
