import React, { useContext, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { format, parseISO, isSameMonth } from 'date-fns';
import { MdArrowBack, MdArrowDownward, MdRemove } from 'react-icons/md';

const MonthlyGrandTotalPage = () => {
  const { year, month } = useParams();
  const { expenses, loading } = useContext(ExpenseContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { grandTotal, normalTotal, deductionsTotal } = useMemo(() => {
    if (!expenses) return { grandTotal: 0, normalTotal: 0, deductionsTotal: 0 };

    const targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    
    let normal = 0;
    let deductions = 0;

    expenses.forEach(tx => {
      if (!tx.date) return;
      const txDate = parseISO(tx.date);
      
      // Strict calendar month filter
      if (!isSameMonth(txDate, targetDate)) return;
      if (tx.type === 'income') return;
      
      const desc = (tx.description || '').toLowerCase();
      if (desc.includes('sameer old balance')) return;

      const isOtherCategory = tx.category === 'Other' || tx.category === 'Other Deduction';
      if (isOtherCategory) return;

      const isDeduction = tx.type === 'other_deduction';
      if (isDeduction) {
        deductions += tx.amount;
      } else {
        normal += tx.amount;
      }
    });

    return {
      grandTotal: normal + deductions,
      normalTotal: normal,
      deductionsTotal: deductions
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


    </div>
  );
};

export default MonthlyGrandTotalPage;
