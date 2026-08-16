import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef(null);

  // Close mobile menu on route change and reset scroll position
  useEffect(() => {
    setIsMobileMenuOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-transparent overflow-hidden relative max-w-[100vw]">
      {/* Global Watermark */}
      <div className="fixed bottom-6 right-6 pointer-events-none z-50 opacity-30 select-none">
        <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap tracking-wider">
          Designed by Prudhvi
        </div>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col md:ml-64 relative w-full">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
