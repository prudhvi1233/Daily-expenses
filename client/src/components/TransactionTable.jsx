import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { MdEdit, MdDelete } from 'react-icons/md';
import { formatTime12Hour } from '../utils/formatTime';

const TransactionTable = ({ expenses, onEdit }) => {
  const { loading, deleteExpense } = useContext(ExpenseContext);

  if (loading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading transactions...</div>;
  if (expenses.length === 0) return <div className="text-center py-10 text-slate-500 dark:text-slate-400">No transactions found matching your filters.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-black/5 dark:bg-black/20 text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
            <th className="p-4 font-medium">Date & Time</th>
            <th className="p-4 font-medium">Description</th>
            <th className="p-4 font-medium">Category</th>
            <th className="p-4 font-medium">Method</th>
            <th className="p-4 font-medium text-right">Amount</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10 dark:divide-white/10">
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="p-4">
                <div className="font-medium text-slate-800 dark:text-slate-200">{format(new Date(expense.date), 'MMM dd, yyyy')}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{formatTime12Hour(expense.time)}</div>
              </td>
              <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{expense.description}</td>
              <td className="p-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  {expense.category}
                </span>
              </td>
              <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">{expense.paymentMethod}</td>
              <td className="p-4 text-right font-bold text-red-600 dark:text-red-400">
                ₹{expense.amount.toFixed(2)}
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg transition-all"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this expense?')) {
                        deleteExpense(expense._id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-500/10 dark:text-slate-400 dark:hover:text-red-400 rounded-lg transition-all"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
