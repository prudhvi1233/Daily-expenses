import React, { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { format } from 'date-fns';
import { 
  MdEdit, MdDelete, MdFastfood, MdFlight, MdShoppingCart, 
  MdLocalHospital, MdSchool, MdMovie, MdPhoneAndroid, 
  MdReceipt, MdHome, MdLocalGasStation, MdMoreHoriz 
} from 'react-icons/md';
import { formatTime12Hour } from '../utils/formatTime';
import ConfirmModal from './ConfirmModal';

const categoryIcons = {
  'Food': <MdFastfood className="w-4 h-4" />,
  'Travel': <MdFlight className="w-4 h-4" />,
  'Shopping': <MdShoppingCart className="w-4 h-4" />,
  'Medical': <MdLocalHospital className="w-4 h-4" />,
  'Education': <MdSchool className="w-4 h-4" />,
  'Entertainment': <MdMovie className="w-4 h-4" />,
  'Recharge': <MdPhoneAndroid className="w-4 h-4" />,
  'Bills': <MdReceipt className="w-4 h-4" />,
  'Home': <MdHome className="w-4 h-4" />,
  'Fuel': <MdLocalGasStation className="w-4 h-4" />,
  'Others': <MdMoreHoriz className="w-4 h-4" />
};

const categoryColors = {
  'Food': 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
  'Travel': 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  'Shopping': 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400 border-pink-200 dark:border-pink-500/20',
  'Medical': 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20',
  'Education': 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
  'Entertainment': 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
  'Recharge': 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20',
  'Bills': 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
  'Home': 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 border-teal-200 dark:border-teal-500/20',
  'Fuel': 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-300 dark:border-slate-500/20',
  'Others': 'bg-gray-50 text-gray-600 dark:bg-gray-500/10 dark:text-gray-400 border-gray-200 dark:border-gray-500/20'
};

const TransactionTable = ({ expenses, onEdit }) => {
  const { loading, deleteExpense } = useContext(ExpenseContext);
  const [itemToDelete, setItemToDelete] = useState(null);

  if (loading) return <div className="text-center py-10 text-slate-500 dark:text-slate-400 animate-pulse">Loading transactions...</div>;
  if (expenses.length === 0) return <div className="text-center py-10 text-slate-500 dark:text-slate-400">No transactions found matching your filters.</div>;

  return (
    <div className="w-full">
      
      {/* MOBILE VIEW (Cards) */}
      <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5 md:hidden">
        {expenses.map((expense) => (
          <div key={expense._id} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${categoryColors[expense.category] || categoryColors['Others']}`}>
                  {categoryIcons[expense.category] || categoryIcons['Others']}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{expense.description}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>{format(new Date(expense.date), 'EEE, MMM dd')}</span>
                    <span>•</span>
                    <span>{formatTime12Hour(expense.time)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${expense.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{expense.category}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                <span>{expense.paymentMethod}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onEdit(expense)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                >
                  <MdEdit size={18} />
                </button>
                <button 
                  onClick={() => setItemToDelete(expense._id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP VIEW (Table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-black/20 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Date & Time</th>
              <th className="p-4">Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Method</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 pr-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {expenses.map((expense) => (
              <tr key={expense._id} className="group hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6">
                  <div className="font-medium text-slate-700 dark:text-slate-300">{format(new Date(expense.date), 'MMM dd, yyyy')}</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{format(new Date(expense.date), 'EEEE')} • {formatTime12Hour(expense.time)}</div>
                </td>
                <td className="p-4">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{expense.description}</span>
                </td>
                <td className="p-4">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${categoryColors[expense.category] || categoryColors['Others']}`}>
                    {categoryIcons[expense.category] || categoryIcons['Others']}
                    {expense.category}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{expense.paymentMethod}</span>
                </td>
                <td className={`p-4 text-right font-bold ${expense.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                  {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toFixed(2)}
                </td>
                <td className="p-4 pr-6">
                  <div className="flex justify-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(expense)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-full transition-all"
                      title="Edit Transaction"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button 
                      onClick={() => setItemToDelete(expense._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
                      title="Delete Transaction"
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

      <ConfirmModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) deleteExpense(itemToDelete);
        }}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
      />
    </div>
  );
};

export default TransactionTable;
