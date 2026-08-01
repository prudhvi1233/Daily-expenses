import React from 'react';
import { MdTrendingUp } from 'react-icons/md';

const AuthBackground = ({ children }) => {
  return (
    <div className="auth-bg relative min-h-screen flex items-center justify-center lg:justify-end p-4 sm:p-8 lg:pr-[12%] z-50 overflow-y-auto">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md py-10 md:py-0">
        <div className="text-center lg:text-left mb-10 flex flex-col items-center lg:items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30 flex items-center justify-center shrink-0">
              <MdTrendingUp className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 tracking-tight drop-shadow-sm">
              ExpenseTracker
            </h1>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-lg drop-shadow-sm lg:ml-16">
            Your intelligent financial companion.
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
