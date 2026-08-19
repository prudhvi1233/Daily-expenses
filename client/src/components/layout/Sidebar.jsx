import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdList, MdAnalytics, MdLogout, MdSavings, MdCalendarToday, MdViewWeek, MdEventAvailable, MdPerson, MdAccountBalanceWallet } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Planner', path: '/dashboard/planner', icon: <MdEventAvailable className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Wallet', path: '/dashboard/wallet', icon: <MdAccountBalanceWallet className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Transactions', path: '/dashboard/transactions', icon: <MdList className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Calendar', path: '/dashboard/calendar', icon: <MdCalendarToday className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Weekly Summary', path: '/dashboard/weekly', icon: <MdViewWeek className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Analytics', path: '/dashboard/analytics', icon: <MdAnalytics className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> },
    { name: 'Profile', path: '/dashboard/profile', icon: <MdPerson className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" /> }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}
      <div className={`w-64 bg-[#EEF3FA] dark:bg-black/40 backdrop-blur-xl border-r border-[#E2E8F0] dark:border-white/10 h-screen fixed top-0 left-0 z-50 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 flex justify-between items-center">
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
                end={item.path === '/dashboard'}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                    ? 'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-500/20 dark:text-blue-400 font-semibold shadow-[inset_4px_0_0_0_#2563EB] dark:shadow-[inset_4px_0_0_0_rgba(96,165,250,1)]' 
                    : 'text-[#172033] hover:text-[#2563EB] hover:bg-white dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 font-medium'
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
          className="mt-8 flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 hover:backdrop-blur-md transition-colors w-full"
        >
          <MdLogout size={24} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
      </div>
    </>
  );
};

export default Sidebar;
