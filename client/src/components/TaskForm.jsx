import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TaskContext } from '../context/TaskContext';

const TaskForm = ({ task, onClose, defaultDay }) => {
  const { addTask, updateTask } = useContext(TaskContext);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: task ? task : {
      dayOfWeek: defaultDay || 'Monday',
      time: '09:00',
      title: '',
      description: '',
      priority: 'Medium'
    }
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (task) {
        await updateTask(task._id, data);
      } else {
        await addTask(data);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl w-full max-w-md mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-white">{task ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Day</label>
            <select 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('dayOfWeek', { required: true })}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
            <input 
              type="time"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('time', { required: true })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
          <input 
            type="text"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Description (Optional)</label>
          <textarea 
            rows="2"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            {...register('description')}
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Priority</label>
          <div className="flex gap-4">
            {['Low', 'Medium', 'High'].map(level => (
              <label key={level} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input 
                  type="radio" 
                  value={level} 
                  {...register('priority')} 
                  className="w-4 h-4 text-blue-500 bg-slate-900 border-slate-700 focus:ring-blue-500"
                />
                {level}
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-700">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
