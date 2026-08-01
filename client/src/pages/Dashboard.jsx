import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { TaskContext } from '../context/TaskContext';
import { calculateSummaries } from '../utils/dashboardUtils';
import ExpenseForm from '../components/ExpenseForm';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { MdToday, MdDateRange, MdCalendarMonth, MdAnalytics, MdReceipt, MdAdd } from 'react-icons/md';

const SummaryCard = ({ title, amount, icon, colorClass }) => (
  <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {title === 'Total Transactions' ? amount : `₹${amount.toFixed(2)}`}
      </h3>
    </div>
  </div>
);

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Dashboard = () => {
  const { expenses, loading: expensesLoading } = useContext(ExpenseContext);
  const { tasks, loading: tasksLoading } = useContext(TaskContext);
  
  const [isExpenseAddOpen, setIsExpenseAddOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Dashboard</h1>
        <button 
          onClick={() => setIsExpenseAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
        >
          <MdAdd size={20} />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
      
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

      <div className="mt-8 glass-panel p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">Today's Planner</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Schedule for {currentDayName}</p>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setIsTaskModalOpen(true); }}
            className="flex items-center gap-2 bg-black/5 hover:bg-black/10 text-slate-800 border-black/10 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white px-4 py-2 rounded-xl font-medium transition-colors border dark:border-white/10"
          >
            <MdAdd size={20} />
            <span>Add Task</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Today's Progress</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{completedTasks} / {todayTasks.length} Tasks Completed</span>
          </div>
          <div className="w-full bg-black/10 dark:bg-black/50 rounded-full h-3 border border-black/10 dark:border-white/10 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-3 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <TaskList tasks={todayTasks} onEdit={handleEditTask} />
      </div>

      {isExpenseAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <ExpenseForm onClose={() => setIsExpenseAddOpen(false)} />
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
