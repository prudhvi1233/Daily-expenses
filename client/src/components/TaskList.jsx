import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from './ConfirmModal';

const priorityColors = {
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
};

const TaskList = ({ tasks, onEdit }) => {
  const { updateTask, deleteTask } = useContext(TaskContext);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    return <div className="text-center py-8 text-slate-500 dark:text-slate-400">No tasks scheduled for this day.</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div 
          key={task._id} 
          className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
            task.completed 
            ? 'bg-black/5 dark:bg-black/20 border-black/5 dark:border-white/5 opacity-60' 
            : 'bg-white/50 dark:bg-black/40 border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 shadow-sm hover:shadow-md'
          }`}
        >
          <button 
            onClick={() => toggleComplete(task)}
            className={`flex-shrink-0 transition-colors ${task.completed ? 'text-blue-500' : 'text-slate-500 hover:text-blue-400'}`}
          >
            {task.completed ? <MdCheckCircle size={28} /> : <MdRadioButtonUnchecked size={28} />}
          </button>
          
          <div className="w-20 flex-shrink-0 text-slate-600 dark:text-slate-400 font-medium text-sm">
            {formatTime12Hour(task.time)}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold truncate ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className="text-sm text-slate-500 truncate">{task.description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className={`text-xs px-2 py-1 rounded-md border font-medium hidden sm:block ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(task)}
                className="p-2 text-slate-600 hover:text-blue-600 bg-black/5 hover:bg-black/10 dark:text-slate-400 dark:hover:text-blue-400 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-lg transition-colors"
              >
                <MdEdit size={18} />
              </button>
              <button 
                onClick={() => setItemToDelete(task._id)}
                className="p-2 text-slate-600 hover:text-red-600 bg-black/5 hover:bg-black/10 dark:text-slate-400 dark:hover:text-red-400 dark:bg-slate-900/50 dark:hover:bg-slate-900 rounded-lg transition-colors"
              >
                <MdDelete size={18} />
              </button>
            </div>
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
