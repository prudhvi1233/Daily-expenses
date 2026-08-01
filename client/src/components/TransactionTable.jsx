import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { MdEdit, MdDelete } from 'react-icons/md';

const TransactionTable = ({ expenses, onEdit }) => {
  const { loading, deleteExpense } = useContext(ExpenseContext);

  if (loading) return <div className="text-center py-10 text-slate-400 animate-pulse">Loading transactions...</div>;
  if (expenses.length === 0) return <div className="text-center py-10 text-slate-400">No transactions found matching your filters.</div>;

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-2xl border border-slate-700 shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-900/50 text-slate-400 text-sm uppercase tracking-wider">
            <th className="p-4 font-medium">Date & Time</th>
            <th className="p-4 font-medium">Description</th>
            <th className="p-4 font-medium">Category</th>
            <th className="p-4 font-medium">Method</th>
            <th className="p-4 font-medium text-right">Amount</th>
            <th className="p-4 font-medium text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {expenses.map((expense) => (
            <tr key={expense._id} className="hover:bg-slate-700/30 transition-colors">
              <td className="p-4">
                <div className="font-medium text-slate-200">{format(new Date(expense.date), 'MMM dd, yyyy')}</div>
                <div className="text-xs text-slate-400">{expense.time}</div>
              </td>
              <td className="p-4 text-slate-300 font-medium">{expense.description}</td>
              <td className="p-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                  {expense.category}
                </span>
              </td>
              <td className="p-4 text-slate-400 text-sm">{expense.paymentMethod}</td>
              <td className="p-4 text-right font-bold text-red-400">
                ₹{expense.amount.toFixed(2)}
              </td>
              <td className="p-4">
                <div className="flex justify-center gap-2">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this expense?')) {
                        deleteExpense(expense._id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
