import React, { useContext, useState, useRef, useEffect } from 'react';
import { TaskContext } from '../context/TaskContext';
import { MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdMoreVert, MdEventNote } from 'react-icons/md';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from './ConfirmModal';

const TaskList = ({ tasks, onEdit, onAddNew }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteTask(itemToDelete);
      } catch (error) {
        console.error(error);
      }
      setItemToDelete(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <MdEventNote size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No tasks scheduled</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xs text-sm sm:text-base">
          Add a task to organize your day.
        </p>
        <button 
          onClick={onAddNew}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors hover:underline"
        >
          + Add Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      {tasks.map(task => (
        <div 
          key={task._id} 
          className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
            task.completed 
            ? 'bg-black/5 dark:bg-black/20 border-transparent opacity-70' 
            : 'bg-white/60 dark:bg-black/40 border-black/5 hover:border-black/10 dark:border-white/5 dark:hover:border-white/10 shadow-sm hover:shadow-md'
          }`}
        >
          {/* Top Row: Check, Time, Menu */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => toggleComplete(task)}
                className={`flex-shrink-0 transition-transform active:scale-90 ${task.completed ? 'text-blue-500' : 'text-slate-400 hover:text-blue-400'}`}
              >
                {task.completed ? <MdCheckCircle size={26} /> : <MdRadioButtonUnchecked size={26} />}
              </button>
              <div className={`font-bold text-sm sm:text-base ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                {formatTime12Hour(task.time)}
              </div>
            </div>
            
            {/* Action Menu */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(activeMenuId === task._id ? null : task._id);
                }}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors -mr-2 sm:-mr-0"
              >
                <MdMoreVert size={22} />
              </button>
              
              {activeMenuId === task._id && (
                <div 
                  ref={menuRef}
                  className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-20 animate-fade-in"
                >
                  <button 
                    onClick={() => { onEdit(task); setActiveMenuId(null); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                  >
                    <MdEdit size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => { setItemToDelete(task._id); setActiveMenuId(null); }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                  >
                    <MdDelete size={16} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Title and Desc */}
          <div className="ml-[38px] sm:ml-[42px] pr-4">
            <h4 className={`text-base sm:text-lg font-semibold leading-tight mb-1 ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className={`text-xs sm:text-sm leading-relaxed ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
                {task.description}
              </p>
            )}
          </div>
        </div>
      ))}
      
      <ConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export default TaskList;
