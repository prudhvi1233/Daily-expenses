import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { calculateSummaries } from '../utils/dashboardUtils';
import DashboardCharts from '../components/DashboardCharts';
import { MdToday, MdDateRange, MdCalendarMonth, MdAnalytics, MdReceipt } from 'react-icons/md';

const SummaryCard = ({ title, amount, icon, colorClass }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-100">
        {title === 'Total Transactions' ? amount : `₹${amount.toFixed(2)}`}
      </h3>
    </div>
  </div>
);

const Dashboard = () => {
  const { expenses, loading } = useContext(ExpenseContext);
  
  if (loading) return <div className="text-center py-10 text-slate-400 animate-pulse">Loading dashboard...</div>;

  const { today, week, month, year, totalCount } = calculateSummaries(expenses);

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <SummaryCard 
          title="Today's Expense" amount={today} 
          icon={<MdToday size={28} className="text-blue-400" />} 
          colorClass="bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        />
        <SummaryCard 
          title="This Week" amount={week} 
          icon={<MdDateRange size={28} className="text-emerald-400" />} 
          colorClass="bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        />
        <SummaryCard 
          title="This Month" amount={month} 
          icon={<MdCalendarMonth size={28} className="text-amber-400" />} 
          colorClass="bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        />
        <SummaryCard 
          title="This Year" amount={year} 
          icon={<MdAnalytics size={28} className="text-purple-400" />} 
          colorClass="bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
        />
        <SummaryCard 
          title="Total Transactions" amount={totalCount} 
          icon={<MdReceipt size={28} className="text-pink-400" />} 
          colorClass="bg-pink-500/10 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
        />
      </div>

      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
