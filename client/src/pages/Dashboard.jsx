import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseContext } from '../context/ExpenseContext';
import { TaskContext } from '../context/TaskContext';
import { calculateSummaries } from '../utils/dashboardUtils';
import ExpenseForm from '../components/ExpenseForm';
import VoiceExpenseModal from '../components/VoiceExpenseModal';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { 
  MdToday, MdDateRange, MdCalendarMonth, MdAnalytics, MdReceipt, MdAdd, 
  MdArrowForward, MdRestaurantMenu, MdDirectionsBus, MdLocalHospital, 
  MdShoppingCart, MdAttachMoney, MdMic 
} from 'react-icons/md';
import { format, parseISO, isSameDay, startOfWeek, addDays } from 'date-fns';
import { formatTime12Hour } from '../utils/formatTime';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SummaryCard = ({ title, amount, icon, colorClass, fullWidth }) => (
  <div className={`glass-panel p-4 sm:p-5 lg:p-6 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-transform duration-300 ${fullWidth ? 'w-full' : ''}`}>
    <div className={`p-3 sm:p-4 rounded-xl flex-shrink-0 ${colorClass}`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mb-0.5 sm:mb-1 truncate">{title}</p>
      <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-slate-800 dark:text-slate-100 truncate">
        {title === 'Total Transactions' ? amount : `₹${amount.toFixed(2)}`}
      </h3>
    </div>
  </div>
);

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Dashboard = () => {
  const { expenses, loading: expensesLoading } = useContext(ExpenseContext);
  const { tasks, loading: tasksLoading } = useContext(TaskContext);
  const navigate = useNavigate();
  
  const [isExpenseAddOpen, setIsExpenseAddOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isVoiceExpenseOpen, setIsVoiceExpenseOpen] = useState(false);

  // Spending Overview Chart Data (Current Week: Mon - Sun)
  const chartData = useMemo(() => {
    const days = [];
    let totalWeeklySpending = 0;
    
    // Normal expenses only
    const normalExpenses = (expenses || []).filter(t => !t.type || t.type === 'expense');
    
    // Get the start of the current week (Monday)
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    for (let i = 0; i <= 6; i++) {
      const d = addDays(weekStart, i);
      const dayName = format(d, 'EEE'); 
      
      const spentOnDay = normalExpenses
        .filter(t => {
          if (!t.date) return false;
          return isSameDay(parseISO(t.date), d);
        })
        .reduce((sum, t) => sum + t.amount, 0);

      totalWeeklySpending += spentOnDay;

      days.push({
        name: dayName,
        amount: spentOnDay
      });
    }
    return { days, totalWeeklySpending };
  }, [expenses]);

  // Recent Transactions Data (Normal Expenses only)
  const recentTransactions = useMemo(() => {
    const normalExpenses = (expenses || []).filter(t => !t.type || t.type === 'expense');
    
    return normalExpenses.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateB - dateA;
    }).slice(0, 5);
  }, [expenses]);
  
  if (expensesLoading || tasksLoading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading dashboard...</div>;

  const { today, week, month, year, totalCount } = calculateSummaries(expenses);

  const currentDayName = DAYS[new Date().getDay()];
  const todayTasks = tasks.filter(t => t.dayOfWeek === currentDayName);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const progressPercentage = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsVoiceExpenseOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-white/10 dark:hover:bg-white/20 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-black/10 text-sm sm:text-base border border-slate-700 dark:border-white/10"
          >
            <MdMic size={20} className="text-blue-400" />
            <span className="hidden sm:inline">Add by Voice</span>
            <span className="sm:hidden">Voice</span>
          </button>
          <button 
            onClick={() => setIsExpenseAddOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 text-sm sm:text-base"
          >
            <MdAdd size={20} />
            <span className="hidden sm:inline">Add Expense</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        <SummaryCard 
          title="Today's Exp" amount={today} 
          icon={<MdToday className="text-blue-400" />} 
          colorClass="bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        />
        <SummaryCard 
          title="This Week" amount={week} 
          icon={<MdDateRange className="text-emerald-400" />} 
          colorClass="bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        />
        <SummaryCard 
          title="This Month" amount={month} 
          icon={<MdCalendarMonth className="text-amber-400" />} 
          colorClass="bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
        />
        <SummaryCard 
          title="This Year" amount={year} 
          icon={<MdAnalytics className="text-purple-400" />} 
          colorClass="bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
        />
        <div className="col-span-2 lg:col-span-1 xl:col-span-1">
          <SummaryCard 
            title="Total Transactions" amount={totalCount} 
            icon={<MdReceipt className="text-pink-400" />} 
            colorClass="bg-pink-500/10 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
            fullWidth={true}
          />
        </div>
      </div>

      {/* Main Grid: Spending Overview + Today's Planner */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Spending Overview */}
        <div className="glass-panel p-4 sm:p-6 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Spending Overview</h2>
            <div className="flex justify-between items-end">
              <p className="text-slate-500 dark:text-slate-400 text-sm">This Week</p>
              <div className="text-right">
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Total Spent</p>
                <p className="text-base sm:text-lg font-black text-rose-500">₹{chartData.totalWeeklySpending.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full h-[200px] sm:h-[250px] min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.days} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11 }} 
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value) => [`₹${value.toFixed(2)}`, 'Spent']}
                />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Planner */}
        <div className="glass-panel p-4 sm:p-6 flex flex-col h-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Today's Planner</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Schedule for {currentDayName}</p>
            </div>
            <button 
              onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
              className="flex items-center gap-1.5 bg-black/5 hover:bg-black/10 text-slate-800 border-black/10 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-medium transition-colors border dark:border-white/10 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <MdAdd size={18} />
              <span>Add Task</span>
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Today's Progress</span>
              <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">{completedTasks} / {todayTasks.length} Completed</span>
            </div>
            <div className="w-full bg-black/10 dark:bg-black/50 rounded-full h-2.5 sm:h-3 border border-black/10 dark:border-white/10 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
              <TaskList 
                tasks={todayTasks} 
                onEdit={handleEditTask} 
                onAddNew={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 sm:mt-8 glass-panel p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Recent Transactions</h2>
          <button 
            onClick={() => navigate('/dashboard/transactions')}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View All <MdArrowForward size={16} />
          </button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No recent personal expenses found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => {
              let icon = <MdAttachMoney size={18} />;
              if (tx.category === 'Food') icon = <MdRestaurantMenu size={18} />;
              if (tx.category === 'Travel') icon = <MdDirectionsBus size={18} />;
              if (tx.category === 'Medical') icon = <MdLocalHospital size={18} />;
              if (tx.category === 'Shopping') icon = <MdShoppingCart size={18} />;

              return (
                <div key={tx._id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 flex-shrink-0">
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm sm:text-base">{tx.description}</p>
                      <p className="text-[10px] sm:text-xs text-slate-500 truncate flex gap-1 items-center mt-0.5">
                        <span className="bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded font-medium">{tx.category || 'Other'}</span>
                        <span className="opacity-50">•</span>
                        <span>{tx.date ? format(parseISO(tx.date), 'MMM dd') : 'Today'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right ml-4">
                    <p className="font-black text-rose-600 dark:text-rose-400 text-sm sm:text-base">
                      -₹{tx.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isExpenseAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm onClose={() => setIsExpenseAddOpen(false)} />
        </div>
      )}

      {isVoiceExpenseOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <VoiceExpenseModal onClose={() => setIsVoiceExpenseOpen(false)} />
        </div>
      )}

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <TaskForm task={editingTask} onClose={() => setIsTaskModalOpen(false)} defaultDay={currentDayName} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
