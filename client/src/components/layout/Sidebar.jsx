import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdList, MdAnalytics, MdLogout, MdSavings } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <MdDashboard className="w-5 h-5" /> },
    { name: 'Transactions', path: '/transactions', icon: <MdList className="w-5 h-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <MdAnalytics className="w-5 h-5" /> },
    { name: 'Budgets & Goals', path: '/budgets', icon: <MdSavings className="w-5 h-5" /> }
  ];

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 h-screen fixed top-0 left-0 hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          ExpenseTracker
        </h1>
      </div>
      <nav className="flex-1 px-4 mt-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/50'
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <button 
          onClick={logout} 
          className="mt-8 flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <MdLogout size={24} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
