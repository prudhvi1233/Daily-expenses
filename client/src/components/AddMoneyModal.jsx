import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdClose } from 'react-icons/md';

const AddMoneyModal = ({ onClose, income = null }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const [amount, setAmount] = useState(income ? income.amount : '');
  const [description, setDescription] = useState(income ? income.description : '');
  const [category, setCategory] = useState(income ? income.category : 'Salary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      setError('Please provide amount and description');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (income) {
        await updateExpense(income._id, {
          type: 'income',
          amount: Number(amount),
          description,
          category,
          date: income.date,
          time: income.time,
          paymentMethod: income.paymentMethod
        });
      } else {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);

        await addExpense({
          type: 'income',
          amount: Number(amount),
          description,
          category,
          date: dateStr,
          time: timeStr,
          paymentMethod: 'Net Banking'
        });
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error adding money');
    } finally {
      setLoading(false);
    }
  };

  const sources = ['Salary', 'Dad given', 'Mom given', 'Savings', 'Freelance', 'Pocket money', 'Bonus', 'Cash received', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-panel w-[95%] max-w-md mx-auto p-6 sm:p-8 animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{income ? 'Edit Money Added' : 'Add Money'}</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5000"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Salary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Source</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {sources.map(src => (
                <option key={src} value={src}>{src}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (income ? 'Updating...' : 'Adding...') : (income ? 'Update' : 'Add Money')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMoneyModal;
