import React, { useContext, useState } from 'react';
import { QuickExpenseContext } from '../context/QuickExpenseContext';
import { MdEdit, MdDelete, MdArrowBack } from 'react-icons/md';
import QuickExpenseModal from './QuickExpenseModal';

const ManageQuickExpenses = ({ onClose }) => {
  const { quickExpenses, deleteQuickExpense } = useContext(QuickExpenseContext);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this quick expense permanently?')) {
      try {
        await deleteQuickExpense(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (isAddingNew || expenseToEdit) {
    return (
      <QuickExpenseModal 
        onClose={() => {
          setIsAddingNew(false);
          setExpenseToEdit(null);
        }} 
        expenseToEdit={expenseToEdit} 
      />
    );
  }

  return (
    <div className="glass-panel p-6 w-full max-w-md mx-auto relative z-50">
      <div className="flex items-center justify-between mb-6">
        <button 
          type="button" 
          onClick={onClose}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
        >
          <MdArrowBack size={20} /> Back
        </button>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Manage Presets</h2>
      </div>

      {quickExpenses.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>No quick expenses found.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {quickExpenses.map(qe => (
            <div key={qe._id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl bg-slate-50 dark:bg-slate-700/50 w-10 h-10 rounded-full flex items-center justify-center">
                  {qe.icon || '📌'}
                </span>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">{qe.description}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{qe.category} • {qe.paymentMethod}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600 dark:text-blue-400">₹{qe.amount}</span>
                <div className="flex items-center gap-2">
                  <button 
                    type="button" 
                    onClick={() => setExpenseToEdit(qe)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDelete(qe._id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button 
        type="button" 
        onClick={() => setIsAddingNew(true)}
        className="w-full bg-black/5 hover:bg-black/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium py-3 rounded-xl transition-colors border border-transparent dark:border-slate-600 border-dashed"
      >
        + Create New Preset
      </button>
    </div>
  );
};

export default ManageQuickExpenses;
