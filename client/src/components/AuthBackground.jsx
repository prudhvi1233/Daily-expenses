import React from 'react';

const AuthBackground = ({ children }) => {
  return (
    <div className="auth-bg relative min-h-screen flex items-center justify-center lg:justify-end p-4 md:p-8 lg:pr-[12%] z-50">
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center lg:text-left mb-8 lg:ml-2">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 drop-shadow-md">Expense Tracker</h1>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-lg drop-shadow">Track your finances smarter.</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;
