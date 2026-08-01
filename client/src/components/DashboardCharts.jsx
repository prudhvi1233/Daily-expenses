import React, { useContext, useMemo } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const DashboardCharts = () => {
  const { expenses } = useContext(ExpenseContext);
  const { theme } = useContext(ThemeContext);
  
  const isDark = theme === 'dark';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const axisColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

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
      <div className="glass-panel p-6 h-96">
        <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">Category-wise Spending</h3>
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
              contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', transition: 'background-color 0.6s ease, border-color 0.6s ease' }}
              itemStyle={{ color: textColor }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-panel p-6 h-96">
        <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-200">Top Categories</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData.slice(0,5)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false}/>
            <XAxis dataKey="name" stroke={axisColor} tick={{fill: axisColor}} />
            <YAxis stroke={axisColor} tick={{fill: axisColor}} />
            <RechartsTooltip 
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px', transition: 'background-color 0.6s ease, border-color 0.6s ease' }}
              itemStyle={{ color: textColor }}
              cursor={{fill: gridColor, opacity: 0.4}}
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
