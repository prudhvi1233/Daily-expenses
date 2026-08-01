import React, { useContext } from 'react';
import { MdMenu, MdLightMode, MdDarkMode } from 'react-icons/md';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <header className="h-20 bg-white/60 dark:bg-black/20 backdrop-blur-xl border-b border-black/10 dark:border-white/10 sticky top-0 z-10 flex items-center px-4 md:px-8 transition-colors">
      <div className="flex-1 flex justify-between items-center">
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={onMenuClick} className="text-slate-800 dark:text-slate-200 p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <MdMenu size={24} />
          </button>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            ExpenseTracker
          </h2>
        </div>
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Welcome Back!</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
          </button>
          
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-[2px] shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full rounded-full bg-white dark:bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="text-sm font-bold text-slate-800 dark:text-white">PT</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
