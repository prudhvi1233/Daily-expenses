import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const DashboardCharts = () => {
  const { expenses } = useContext(ExpenseContext);

  const categoryData = useMemo(() => {
    const map = {};
    expenses.forEach(exp => {
      map[exp.category] = (map[exp.category] || 0) + exp.amount;
    });
    return Object.keys(map).map(key => ({ name: key, value: map[key] })).sort((a,b) => b.value - a.value);
  }, [expenses]);

  if (expenses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg h-96">
        <h3 className="text-lg font-medium mb-4 text-slate-200">Category-wise Spending</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg h-96">
        <h3 className="text-lg font-medium mb-4 text-slate-200">Top Categories</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData.slice(0,5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/>
            <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
            <RechartsTooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
              cursor={{fill: '#334155', opacity: 0.4}}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {categoryData.slice(0,5).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
