import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, eachWeekOfInterval, startOfYear, endOfYear, endOfWeek, parseISO, isSameWeek } from 'date-fns';
import { MdChevronLeft, MdChevronRight, MdViewWeek } from 'react-icons/md';

const WeeklySummaryPage = () => {
  const { expenses } = useContext(ExpenseContext);
  const navigate = useNavigate();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const weeks = useMemo(() => {
    const start = startOfYear(new Date(currentYear, 0, 1));
    const end = endOfYear(new Date(currentYear, 0, 1));
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  }, [currentYear]);

  // Aggregate expenses per week
  const weeklyData = useMemo(() => {
    const data = weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekExpenses = expenses.filter(exp => {
        const expDate = parseISO(exp.date);
        return expDate >= weekStart && expDate <= weekEnd;
      });
      return {
        weekStart,
        weekEnd,
        total: weekExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        count: weekExpenses.length
      };
    });
    // Reverse to show most recent first
    return data.reverse();
  }, [weeks, expenses]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Weekly Summary</h1>
        <div className="flex items-center gap-4 glass-panel p-1">
          <button onClick={() => setCurrentYear(y => y - 1)} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 rounded-md transition-colors"><MdChevronLeft size={24} /></button>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-200 w-16 text-center">{currentYear}</span>
          <button onClick={() => setCurrentYear(y => y + 1)} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-black/10 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 rounded-md transition-colors"><MdChevronRight size={24} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {weeklyData.map((week, index) => {
          const isCurrent = isSameWeek(week.weekStart, new Date(), { weekStartsOn: 1 });
          return (
            <motion.div 
              key={week.weekStart.toISOString()}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/dashboard/weekly/${currentYear}/${weeks.length - index}`)}
              className={`glass-panel p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex justify-between items-center group relative overflow-hidden ${
                isCurrent 
                ? 'bg-blue-500/10 border-blue-500/30 dark:border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:border-blue-400' 
                : 'hover:border-black/20 dark:hover:border-white/20'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  CURRENT WEEK
                </div>
              )}
              <div>
                <p className={`text-sm font-medium mb-1 ${isCurrent ? 'text-blue-600 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  {format(week.weekStart, 'MMM d')} - {format(week.weekEnd, 'MMM d, yyyy')}
                </p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{week.total.toFixed(2)}</h3>
                <p className="text-xs text-slate-500 mt-1">{week.count} transactions</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isCurrent ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white'
              }`}>
                <MdViewWeek size={24} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySummaryPage;
