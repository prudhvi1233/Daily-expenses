import React, { useState, useContext, useRef, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { MdAdd } from 'react-icons/md';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const PlannerPage = () => {
  const { tasks } = useContext(TaskContext);
  const [activeTab, setActiveTab] = useState('Monday');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const scrollContainerRef = useRef(null);

  const activeTasks = tasks.filter(t => t.dayOfWeek === activeTab);

  // Auto-scroll selected day into view on mobile
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector(`[data-day="${activeTab}"]`);
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };
  
  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      {/* Header section with flex-col on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Weekly Planner</h1>
        <button 
          onClick={handleAddNewTask}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 sm:py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"
        >
          <MdAdd size={20} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Horizontally scrollable day selector */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 sm:gap-3 mb-6 pb-2 snap-x snap-mandatory custom-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DAYS.map(day => (
          <button
            key={day}
            data-day={day}
            onClick={() => setActiveTab(day)}
            className={`px-5 py-3 sm:py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors snap-center flex-shrink-0 text-sm sm:text-base ${
              activeTab === day 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
              : 'bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="glass-panel p-4 sm:p-6 sm:p-8">
        <div className="mb-6 sm:mb-8 border-b border-black/5 dark:border-white/5 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{activeTab}'s Schedule</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {activeTasks.length} {activeTasks.length === 1 ? 'Task' : 'Tasks'}
          </p>
        </div>
        
        <TaskList 
          tasks={activeTasks} 
          onEdit={handleEdit} 
          onAddNew={handleAddNewTask} 
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <TaskForm task={editingTask} onClose={handleClose} defaultDay={activeTab} />
        </div>
      )}
    </div>
  );
};

export default PlannerPage;
