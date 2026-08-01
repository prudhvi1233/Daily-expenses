import React, { useState, useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { isThisMonth } from 'date-fns';

const BudgetsAndGoals = () => {
  const { budgets, goals, setBudget, createGoal, deleteGoal, updateGoal } = useContext(FinanceContext);
  const { expenses } = useContext(ExpenseContext);
  
  const [category, setCategory] = useState('Food');
  const [budgetAmt, setBudgetAmt] = useState('');
  
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const currentMonthExpenses = useMemo(() => {
    const cats = {};
    expenses.filter(e => isThisMonth(new Date(e.date))).forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.amount;
    });
    return cats;
  }, [expenses]);

  const handleSetBudget = (e) => {
    e.preventDefault();
    if(budgetAmt) setBudget(category, Number(budgetAmt));
    setBudgetAmt('');
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if(goalTitle && goalTarget) {
      createGoal({ title: goalTitle, targetAmount: Number(goalTarget) });
      setGoalTitle('');
      setGoalTarget('');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Budgets & Goals</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budgets Section */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Monthly Budgets</h2>
          
          <form onSubmit={handleSetBudget} className="flex gap-4 mb-6">
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none w-1/3"
            >
              {['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              value={budgetAmt}
              onChange={e => setBudgetAmt(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none flex-1"
              required
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg font-medium transition-colors">Set</button>
          </form>

          <div className="space-y-4">
            {budgets.map(b => {
              const spent = currentMonthExpenses[b.category] || 0;
              const percent = Math.min((spent / b.amount) * 100, 100);
              const isOver = spent > b.amount;
              return (
                <div key={b._id} className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">{b.category}</span>
                    <span className="text-slate-400 text-sm">₹{spent} / ₹{b.amount}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${isOver ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }}></div>
                  </div>
                  {isOver && <p className="text-red-400 text-xs mt-2 font-medium">Budget exceeded!</p>}
                </div>
              );
            })}
            {budgets.length === 0 && <p className="text-slate-500 text-sm">No budgets set. Create one above.</p>}
          </div>
        </div>

        {/* Goals Section */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-4">Savings Goals</h2>
          
          <form onSubmit={handleAddGoal} className="flex gap-4 mb-6">
            <input 
              type="text" 
              placeholder="Goal Title (e.g. Vacation)" 
              value={goalTitle}
              onChange={e => setGoalTitle(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none w-1/2"
              required
            />
            <input 
              type="number" 
              placeholder="Target (₹)" 
              value={goalTarget}
              onChange={e => setGoalTarget(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 outline-none flex-1"
              required
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-lg font-medium transition-colors">Add</button>
          </form>

          <div className="space-y-4">
            {goals.map(g => {
              const percent = Math.min((g.currentAmount / g.targetAmount) * 100, 100);
              return (
                <div key={g._id} className="bg-slate-900 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300 font-medium">{g.title}</span>
                    <span className="text-slate-400 text-sm">₹{g.currentAmount} / ₹{g.targetAmount}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 mb-3">
                    <div className="h-2.5 rounded-full bg-emerald-500" style={{ width: `${percent}%` }}></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateGoal(g._id, { currentAmount: g.currentAmount + 500 })} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded text-emerald-400 transition-colors">+₹500</button>
                    <button onClick={() => deleteGoal(g._id)} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1 rounded text-red-400 transition-colors ml-auto">Delete</button>
                  </div>
                </div>
              );
            })}
            {goals.length === 0 && <p className="text-slate-500 text-sm">No savings goals set yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetsAndGoals;
