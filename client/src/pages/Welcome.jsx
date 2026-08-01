import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SideRays from '../components/SideRays';
import { 
  MdDashboard, MdList, MdCalendarToday, MdViewWeek, 
  MdSavings, MdEventAvailable, MdFileDownload, MdDarkMode, MdArrowForward
} from 'react-icons/md';

const features = [
  { icon: <MdDashboard size={28} />, title: "Dashboard", desc: "View your financial overview instantly." },
  { icon: <MdList size={28} />, title: "Expense Tracking", desc: "Record and manage daily expenses." },
  { icon: <MdCalendarToday size={28} />, title: "Daily Expense Calendar", desc: "Browse every day of the year and review expenses by date." },
  { icon: <MdViewWeek size={28} />, title: "Weekly Summary", desc: "View Monday–Sunday spending totals." },
  { icon: <MdSavings size={28} />, title: "Budgets & Goals", desc: "Track budgets and savings goals." },
  { icon: <MdEventAvailable size={28} />, title: "Daily Planner", desc: "Manage daily tasks, routines, reminders and schedules." },
  { icon: <MdFileDownload size={28} />, title: "Export", desc: "Export reports as CSV, Excel and PDF." },
  { icon: <MdDarkMode size={28} />, title: "Light & Dark Themes", desc: "Switch between elegant themes with smooth transitions." },
];

const steps = [
  { step: 1, text: "Create an account." },
  { step: 2, text: "Add your daily expenses." },
  { step: 3, text: "Organize expenses by category." },
  { step: 4, text: "Monitor weekly and monthly spending." },
  { step: 5, text: "Review analytics and improve your financial habits." }
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 overflow-x-hidden font-sans">
      {/* Subtle Overlay to ensure readability against background */}
      <div className="fixed inset-0 bg-black/5 dark:bg-black/60 z-[-1] pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/5 dark:bg-black/20 border-b border-slate-200/20 dark:border-white/5">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
            ExpenseTracker
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
          <a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it Works</a>
          <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:block text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Log In
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="absolute inset-0 z-[-1] opacity-60 dark:opacity-100 mix-blend-screen dark:mix-blend-normal">
          <SideRays 
            speed={1.5}
            rayColor1="#3b82f6" 
            rayColor2="#06b6d4" 
            intensity={1.5}
            spread={2.5}
            opacity={0.8}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl z-10 w-full"
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md mb-8">
            <span className="text-blue-500 dark:text-blue-400">✨</span>
            <span className="text-sm font-medium text-slate-800 dark:text-slate-300">Your Ultimate Finance Workspace</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
            <span className="text-slate-900 dark:text-white block">Take Control of Your</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 dark:from-blue-400 dark:via-cyan-300 dark:to-blue-400 drop-shadow-sm pb-2">
              Daily Expenses
            </span>
          </h1>
          
          <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-12 max-w-3xl mx-auto">
            From deep expense tracking and intelligent budget optimization to personal finance planning, Daily Expenses Analyser gives you the edge to achieve your financial goals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-black/40 border border-blue-500/50 hover:border-blue-400 hover:bg-slate-800 dark:hover:bg-black/60 text-white font-semibold rounded-full text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10">Get Started for Free</span>
              <MdArrowForward className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 w-full sm:w-auto bg-transparent border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-semibold rounded-full text-lg transition-all"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 drop-shadow-md text-slate-900 dark:text-white"
        >
          Powerful Features
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-panel p-8 text-center group cursor-default transition-transform duration-300"
            >
              <div className="w-16 h-16 mx-auto bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 max-w-4xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-20 drop-shadow-md text-slate-900 dark:text-white"
        >
          How It Works
        </motion.h2>
        
        <div className="space-y-8 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/30 via-cyan-500/30 to-blue-500/30 -translate-x-1/2 rounded-full hidden md:block"></div>
          
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full">
                <div className={`glass-panel p-8 transform transition-transform hover:scale-[1.02] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right text-center md:text-right'}`}>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-2">Step {item.step}</span>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.text}</p>
                </div>
              </div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] relative z-10 shrink-0 border-4 border-white/50 dark:border-slate-800/50">
                {item.step}
              </div>
              
              <div className="flex-1 hidden md:block"></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About the Developer */}
      <section id="about" className="py-24 px-4 max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-16 text-center relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] z-0 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h2 className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-3 uppercase tracking-widest">About the Developer</h2>
            <h3 className="text-5xl font-extrabold mb-8 text-slate-900 dark:text-white">Prudhvi Behara</h3>
            
            <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-12 max-w-2xl mx-auto font-medium italic">
              "This application was designed and developed by Prudhvi Behara as a personal finance management system. The goal is to provide a clean, modern, and efficient workspace for tracking expenses, managing budgets, organizing daily plans, and improving financial discipline."
            </p>
            
            <div className="inline-block border-t border-slate-300 dark:border-slate-700 pt-8 mt-4 w-64">
              <span className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Designed & Developed by</span>
              <span className="block text-2xl font-bold text-slate-800 dark:text-slate-100">Prudhvi Behara</span>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-4 text-center relative z-10">
        <motion.button
          whileHover={{ scale: 1.05, translateY: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="px-12 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-full text-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-3 mx-auto group"
        >
          Get Started Now
          <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </section>

    </div>
  );
};

export default Welcome;
