import React, { useContext } from 'react';
import { MdMenu, MdLightMode, MdDarkMode } from 'react-icons/md';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, profilePic } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Get first letter of name or email, default to 'U'
  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };
  
  return (
    <header className="h-20 bg-white/60 dark:bg-black/20 backdrop-blur-xl border-b border-black/10 dark:border-white/10 sticky top-0 z-10 flex items-center px-4 md:px-8 transition-colors">
      <div className="flex-1 flex justify-between items-center">
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={onMenuClick} className="text-slate-800 dark:text-slate-200 p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <MdMenu size={24} />
          </button>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[150px] xs:max-w-none">
            ExpenseTracker
          </h2>
        </div>
        <div className="hidden md:flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Here's your financial overview</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <MdLightMode size={22} /> : <MdDarkMode size={22} />}
          </button>
          
          <div 
            onClick={() => navigate('/dashboard/profile')}
            className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-[2px] shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:scale-105 transition-all cursor-pointer overflow-hidden"
            title="Go to Profile"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">{getInitials()}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
