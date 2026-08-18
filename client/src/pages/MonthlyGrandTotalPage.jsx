import React, { useContext, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, parseISO, isSameMonth, getWeekOfMonth } from 'date-fns';
import { MdArrowBack, MdArrowDownward, MdRemove } from 'react-icons/md';

const MonthlyGrandTotalPage = () => {
  const { year, month } = useParams();
  const { expenses, loading } = useContext(ExpenseContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { grandTotal, normalTotal, deductionsTotal, weeklyData } = useMemo(() => {
    if (!expenses) return { grandTotal: 0, normalTotal: 0, deductionsTotal: 0, weeklyData: [] };

    const targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    // Filter for the month, NOT income, and NOT 'sameer old balance'
    const monthlyExpenses = expenses.filter(tx => {
      if (!tx.date) return false;
      const txDate = parseISO(tx.date);
      if (!isSameMonth(txDate, targetDate)) return false;
      if (tx.type === 'income') return false;
      
      const desc = (tx.description || '').toLowerCase();
      if (desc.includes('sameer old balance')) return false;
      
      return true;
    });

    let normal = 0;
    let deductions = 0;
    const weeks = {};

    monthlyExpenses.forEach(tx => {
      const isDeduction = tx.type === 'other_deduction';
      if (isDeduction) deductions += tx.amount;
      else normal += tx.amount;

      const txDate = parseISO(tx.date);
      const weekIndex = getWeekOfMonth(txDate);

      if (!weeks[weekIndex]) {
        weeks[weekIndex] = { week: weekIndex, personal: 0, deduction: 0, total: 0 };
      }

      if (isDeduction) {
        weeks[weekIndex].deduction += tx.amount;
      } else {
        weeks[weekIndex].personal += tx.amount;
      }
      weeks[weekIndex].total += tx.amount;
    });

    const weeklyData = Object.values(weeks).sort((a, b) => a.week - b.week);

    return {
      grandTotal: normal + deductions,
      normalTotal: normal,
      deductionsTotal: deductions,
      weeklyData
    };
  }, [expenses, year, month]);

  const monthName = format(new Date(parseInt(year), parseInt(month) - 1, 1), 'MMMM yyyy');

  if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Loading data...</div>;

  return (
    <div className="pb-12 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 font-medium transition-colors mb-6"
      >
        <MdArrowBack size={20} /> Back to Calendar
      </button>

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Grand Total</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Combined expenses & deductions for {monthName}.</p>
          
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Spending</p>
            <h2 className="text-4xl sm:text-5xl font-black text-rose-500 tracking-tight">
              ₹{grandTotal.toFixed(2)}
            </h2>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="glass-panel p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
              <MdArrowDownward size={20} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Personal Expenses</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{normalTotal.toFixed(2)}</h3>
        </div>

        <div className="glass-panel p-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <MdRemove size={20} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Other Deductions</p>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">₹{deductionsTotal.toFixed(2)}</h3>
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div className="glass-panel p-4 sm:p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Weekly Breakdown</h2>
        
        {weeklyData.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-6">No data found for this month.</p>
        ) : (
          <div className="space-y-4">
            {weeklyData.map(week => (
              <div key={week.week} className="p-4 sm:p-5 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Week {week.week}</h3>
                  <p className="font-black text-rose-500 text-lg">₹{week.total.toFixed(2)}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 pt-3 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <MdArrowDownward className="text-rose-400" size={18} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Personal:</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">₹{week.personal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdRemove className="text-orange-400" size={18} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Deductions:</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">₹{week.deduction.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyGrandTotalPage;
