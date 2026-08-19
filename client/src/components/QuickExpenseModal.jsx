import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { QuickExpenseContext } from '../context/QuickExpenseContext';

const QuickExpenseModal = ({ onClose, expenseToEdit }) => {
  const { addQuickExpense, updateQuickExpense } = useContext(QuickExpenseContext);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: expenseToEdit ? {
      ...expenseToEdit
    } : {
      amount: '',
      description: '',
      category: 'Food',
      paymentMethod: 'UPI',
      icon: '📌'
    }
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      if (expenseToEdit) {
        await updateQuickExpense(expenseToEdit._id, data);
      } else {
        await addQuickExpense(data);
      }
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 w-full max-w-sm mx-auto relative z-50">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">{expenseToEdit ? 'Edit Quick Expense' : 'New Quick Expense'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Icon</label>
            <input 
              type="text"
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-center text-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('icon')}
            />
          </div>
          <div className="col-span-3">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
            <input 
              type="text"
              placeholder="Daily Curry"
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              {...register('description', { required: 'Required' })}
            />
            {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount (₹)</label>
          <input 
            type="number" step="0.01"
            className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            {...register('amount', { required: 'Required', min: 0.01 })}
          />
          {errors.amount && <span className="text-red-500 text-xs mt-1 block">{errors.amount.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
            <select 
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('category')}
            >
              {['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Method</label>
            <select 
              className="w-full bg-black/5 dark:bg-slate-900 border border-black/10 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
              {...register('paymentMethod')}
            >
              {['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
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
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Quick Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickExpenseModal;
