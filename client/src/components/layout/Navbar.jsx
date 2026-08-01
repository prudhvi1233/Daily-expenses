import React from 'react';

const Navbar = () => {
  return (
    <header className="h-20 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-10 flex items-center px-8">
      <div className="flex-1 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100 md:hidden">
          ExpenseTracker
        </h2>
        <div className="hidden md:block">
          <h2 className="text-xl font-semibold text-slate-100">Welcome Back!</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
              <span className="text-sm font-bold">PT</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
