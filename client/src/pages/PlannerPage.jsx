import React, { useState, useContext } from 'react';
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

  const activeTasks = tasks.filter(t => t.dayOfWeek === activeTab);

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Weekly Planner</h1>
        <button 
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          <MdAdd size={20} />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveTab(day)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === day 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">{activeTab}'s Schedule</h2>
        <TaskList tasks={activeTasks} onEdit={handleEdit} />
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
