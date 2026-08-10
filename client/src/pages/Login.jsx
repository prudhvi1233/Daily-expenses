import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdVisibility, MdVisibilityOff, MdEmail, MdLock } from 'react-icons/md';
import AuthBackground from '../components/AuthBackground';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthBackground>
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="auth-glass p-6 sm:p-8 w-[95%] sm:w-full"
      >
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm font-medium">Sign in to continue to your dashboard.</p>
        
        {error && (
          <div className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-200 p-3 rounded-xl text-sm mb-6 border border-red-500/20 dark:border-red-500/30 backdrop-blur-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="relative group">
              <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input w-full p-3.5 pl-12"
                placeholder="Email Address"
                required
              />
            </div>
          </div>
          
          <div>
            <div className="relative group">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input w-full p-3.5 pl-12 pr-12"
                placeholder="Password"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>
          
          <button type="submit" className="auth-btn w-full mt-2">
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            Create Account
          </Link>
        </p>
      </motion.div>
    </AuthBackground>
  );
};

export default Login;
