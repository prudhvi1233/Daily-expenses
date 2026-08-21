import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { MdClose } from 'react-icons/md';

const OtherDeductionModal = ({ onClose, deduction = null }) => {
  const { addExpense, updateExpense } = useContext(ExpenseContext);
  const [amount, setAmount] = useState(deduction ? deduction.amount : '');
  const [description, setDescription] = useState(deduction ? deduction.description : '');
  const [category, setCategory] = useState(deduction ? (deduction.category === 'Other Deduction' ? 'Other' : deduction.category) : 'Other');
  const [date, setDate] = useState(deduction ? deduction.date : new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(deduction ? deduction.time : new Date().toTimeString().split(' ')[0].substring(0, 5));
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
      
      const finalCategory = category === 'Other' ? 'Other Deduction' : category;
      
      if (deduction) {
        await updateExpense(deduction._id, {
          type: 'other_deduction',
          amount: Number(amount),
          description,
          category: finalCategory,
          date: date,
          time: time,
          paymentMethod: 'Wallet'
        });
      } else {
        await addExpense({
          type: 'other_deduction',
          amount: Number(amount),
          description,
          category: finalCategory,
          date: date,
          time: time,
          paymentMethod: 'Wallet'
        });
      }
      
      onClose();
    } catch (err) {
      setError(err.message || 'Error deducting money');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Other'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-panel w-[95%] max-w-md mx-auto p-6 sm:p-8 animate-fade-in relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{deduction ? 'Edit Other Deduction' : 'Other Deduction'}</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Amount (₹)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. 3000"
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
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="e.g. Bank EMI"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Time</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>
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
              className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-50"
            >
              {loading ? (deduction ? 'Updating...' : 'Deducting...') : (deduction ? 'Update' : 'Deduct Money')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtherDeductionModal;
