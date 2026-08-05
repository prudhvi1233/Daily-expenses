import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import ClockTimePicker from './ClockTimePicker';

const ExpenseForm = ({ expense, onClose, defaultDate }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: expense ? {
      ...expense,
      date: format(new Date(expense.date), 'yyyy-MM-dd')
    } : {
      date: defaultDate || format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      category: 'Food',
      paymentMethod: 'UPI'
    }
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (expense) {
        await updateExpense(expense._id, data);
      } else {
        await addExpense(data);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">{expense ? 'Edit Expense' : 'Add Expense'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount</label>
          <input 
            type="number" step="0.01"
            className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            {...register('amount', { required: 'Amount is required', min: 0.01 })}
          />
          {errors.amount && <span className="text-red-500 text-xs mt-1 block">{errors.amount.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
          <input 
            type="text"
            className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
            <select 
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('category', { required: true })}
            >
              {['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Payment Method</label>
            <select 
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('paymentMethod', { required: true })}
            >
              {['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
            <input 
              type="date"
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('date', { required: true })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
            <Controller
              control={control}
              name="time"
              rules={{ required: true }}
              render={({ field }) => (
                <ClockTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-black/10 dark:border-slate-700">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
