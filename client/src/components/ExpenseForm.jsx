import React, { useContext, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import ClockTimePicker from './ClockTimePicker';
import { QuickExpenseContext } from '../context/QuickExpenseContext';
import QuickExpenseModal from './QuickExpenseModal';
import { MdClose } from 'react-icons/md';

const ExpenseForm = ({ expense, onClose, defaultDate }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const quickExpenseContextData = useContext(QuickExpenseContext) || {};
  const quickExpenses = Array.isArray(quickExpenseContextData.quickExpenses) ? quickExpenseContextData.quickExpenses : [];
  const deleteQuickExpense = quickExpenseContextData.deleteQuickExpense || (() => {});

  const [submitting, setSubmitting] = useState(false);
  const [isAddingQuickExpense, setIsAddingQuickExpense] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleQuickExpenseClick = async (qe) => {
    try {
      setSubmitting(true);
      await addExpense({
        amount: qe.amount,
        description: qe.description,
        category: qe.category || 'Food',
        paymentMethod: qe.paymentMethod || 'UPI',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm')
      });
      onClose();
    } catch (error) {
      alert(error.message);
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (e, qe) => {
    e.stopPropagation();
    setExpenseToDelete(qe);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;
    try {
      setIsDeleting(true);
      await deleteQuickExpense(expenseToDelete._id);
      setExpenseToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAddingQuickExpense) {
    return <QuickExpenseModal onClose={() => setIsAddingQuickExpense(false)} />;
  }

  if (expenseToDelete) {
    return (
      <div className="glass-panel p-6 w-full max-w-sm mx-auto text-center relative z-50">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdClose size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Delete Quick Expense?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Are you sure you want to delete <span className="font-semibold text-slate-700 dark:text-slate-200">"{expenseToDelete.description}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            type="button"
            onClick={() => setExpenseToDelete(null)}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg font-medium bg-black/5 hover:bg-black/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg font-medium bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
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
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Quick Expenses</p>
            <div className="flex flex-wrap gap-2">
              {quickExpenses.map(qe => (
                <div 
                  key={qe._id}
                  onClick={() => handleQuickExpenseClick(qe)}
                  className="group relative flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 hover:bg-[#EFF6FF] hover:border-blue-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full cursor-pointer transition-colors shadow-sm"
                >
                  <span className="text-sm">{qe.icon || '📌'}</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{qe.description}</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-1">₹{qe.amount}</span>
                  
                  <button 
                    type="button"
                    onClick={(e) => handleDeleteClick(e, qe)}
                    className="absolute -top-1.5 -right-1.5 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdClose size={12} />
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={() => setIsAddingQuickExpense(true)}
                className="flex items-center gap-1 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-transparent px-3 py-1.5 rounded-full cursor-pointer transition-colors"
              >
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">+ Add New</span>
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
