import React, { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, eachMonthOfInterval, startOfYear, endOfYear, eachDayOfInterval, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const CalendarPage = () => {
  const { expenses } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const currentMonthRef = useRef(null);

  useEffect(() => {
    if (currentMonthRef.current) {
      setTimeout(() => {
        currentMonthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [currentYear]);

  const months = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 0, 1));
    return eachMonthOfInterval({ start, end });
  }, [currentYear]);

  // Pre-calculate daily totals
  const dailyTotals = useMemo(() => {
    const totals = {};
    const onlyExpenses = expenses.filter(e => !e.type || e.type === 'expense');
    onlyExpenses.forEach(exp => {
      const dateStr = format(new Date(exp.date), 'yyyy-MM-dd');
      totals[dateStr] = (totals[dateStr] || 0) + exp.amount;
    });
    return totals;
  }, [expenses]);

  const getColorClass = (amount) => {
    if (!amount) return 'bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300';
    if (amount < 100) return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30';
    if (amount <= 250) return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30';
    return 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30';
  };

  const formatCompactAmount = (amount) => {
    if (!amount) return '';
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${Math.round(amount)}`;
  };

  const renderMonth = (monthDate) => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);
    const days = eachDayOfInterval({ start, end });
    const startDayOfWeek = getDay(start); // 0 = Sunday

    // Calculate monthly total
    const monthTotal = days.reduce((sum, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return sum + (dailyTotals[dateStr] || 0);
    }, 0);

    // Pad beginning of month
    const padding = Array(startDayOfWeek).fill(null);
    const isCurrentMonth = format(monthDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

    return (
      <div 
        key={monthDate.toISOString()} 
        ref={isCurrentMonth ? currentMonthRef : null}
        className={`glass-panel p-4 transition-colors ${isCurrentMonth ? 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-blue-500/5' : 'hover:border-black/20 dark:hover:border-white/20'}`}
      >
        <div className="mb-3 text-center">
          <h3 className={`text-lg font-bold ${isCurrentMonth ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {format(monthDate, 'MMMM')}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Total: ₹{monthTotal.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-slate-600 dark:text-slate-500 font-medium">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {padding.map((_, i) => <div key={`pad-${i}`} className="aspect-square"></div>)}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const amount = dailyTotals[dateStr];
            const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');
            const compactAmount = formatCompactAmount(amount);
            
            return (
              <button
                key={dateStr}
                onClick={() => navigate(`/dashboard/calendar/${dateStr}`)}
                className={`aspect-square rounded-md flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 ${getColorClass(amount)} ${isToday ? 'ring-2 ring-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)] z-10 font-bold' : ''}`}
                title={`${format(day, 'MMM d, yyyy')}${amount ? `: ₹${amount.toFixed(2)} spent` : ''}${isToday ? ' (Today)' : ''}`}
              >
                <span className={`${isToday ? 'text-white' : ''} text-sm sm:text-base leading-none ${amount ? 'mb-0.5' : ''}`}>
                  {format(day, 'd')}
                </span>
                {amount > 0 && (
                  <span className={`text-[9px] sm:text-[10px] leading-tight px-1 font-medium ${isToday ? 'text-white/90' : 'opacity-80'}`}>
                    {compactAmount}
                  </span>
                )}
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
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30"></div> &lt; ₹100</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30"></div> ₹100 - ₹250</div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30"></div> &gt; ₹250</div>
      </div>
    </div>
  );
};

export default CalendarPage;
