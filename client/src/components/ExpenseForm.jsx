import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import ClockTimePicker from './ClockTimePicker';
import { QuickExpenseContext } from '../context/QuickExpenseContext';
import ManageQuickExpenses from './ManageQuickExpenses';
import QuickExpenseModal from './QuickExpenseModal';
import { MdCheck } from 'react-icons/md';

const ExpenseForm = ({ expense, onClose, defaultDate }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const quickExpenseContextData = useContext(QuickExpenseContext) || {};
  const quickExpenses = Array.isArray(quickExpenseContextData.quickExpenses) ? quickExpenseContextData.quickExpenses : [];
  const deleteQuickExpense = quickExpenseContextData.deleteQuickExpense || (() => {});

  const [submitting, setSubmitting] = useState(false);
  const [isManagingQuickExpenses, setIsManagingQuickExpenses] = useState(false);
  const [isAddingQuickExpense, setIsAddingQuickExpense] = useState(false);
  const [selectedQuickExpense, setSelectedQuickExpense] = useState(null);
  
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
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

  const handleQuickExpenseClick = (qe) => {
    setSelectedQuickExpense(qe._id);
    setValue('amount', qe.amount);
    setValue('description', qe.description);
    setValue('category', qe.category || 'Food');
    setValue('paymentMethod', qe.paymentMethod || 'UPI');
    setValue('date', format(new Date(), 'yyyy-MM-dd'));
    setValue('time', format(new Date(), 'HH:mm'));
  };

  if (isManagingQuickExpenses) {
    return <ManageQuickExpenses onClose={() => setIsManagingQuickExpenses(false)} />;
  }

  if (isAddingQuickExpense) {
    return <QuickExpenseModal onClose={() => setIsAddingQuickExpense(false)} />;
  }

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

        {/* Quick Expenses Section */}
        {!expense && (
          <div className="pt-2 pb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quick Expenses</p>
              <button 
                type="button"
                onClick={() => setIsManagingQuickExpenses(true)}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Manage
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickExpenses.map(qe => {
                const isSelected = selectedQuickExpense === qe._id;
                return (
                  <button 
                    key={qe._id}
                    type="button"
                    onClick={() => handleQuickExpenseClick(qe)}
                    className={`
                      relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all shadow-sm border
                      ${isSelected 
                        ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-blue-500/20 dark:bg-blue-900/40 dark:border-blue-400 dark:text-blue-100 dark:shadow-blue-900/30 ring-1 ring-blue-500 dark:ring-blue-400 scale-[1.02]' 
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700'}
                    `}
                  >
                    {isSelected && (
                      <span className="text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center p-0.5 shadow-sm border border-blue-100 dark:border-blue-800">
                        <MdCheck size={12} />
                      </span>
                    )}
                    {!isSelected && <span>{qe.icon || '📌'}</span>}
                    <span className="font-medium">{qe.description}</span>
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-blue-600 dark:text-blue-400'} ml-1`}>₹{qe.amount}</span>
                  </button>
                );
              })}
              <button 
                type="button"
                onClick={() => setIsAddingQuickExpense(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-black/5 hover:bg-black/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 border-dashed transition-all"
              >
                + Add New
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
