import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { 
  MdPerson, MdEmail, MdCalendarToday, MdEdit, MdSecurity, 
  MdLockOutline, MdSettings, MdLanguage, MdAccessTime, MdPalette,
  MdBarChart, MdReceipt, MdAttachMoney, MdStar, MdFileDownload, 
  MdFileUpload, MdCloudUpload, MdDeleteForever, MdLogout, MdWarning, MdClose,
  MdVisibility, MdVisibilityOff
} from 'react-icons/md';

const ProfilePage = () => {
  const { user, logout, profilePic, updateProfilePic, updateUser } = useContext(AuthContext);
  const { expenses } = useContext(ExpenseContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Password form state
  const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [editSuccess, setEditSuccess] = useState('');

  // Delete account state
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  // Stats calculation
  const normalExpenses = expenses.filter(exp => !exp.type || exp.type === 'expense');
  const totalExpenses = normalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTransactions = normalExpenses.length;
  const highestExpense = normalExpenses.length > 0 ? Math.max(...normalExpenses.map(e => e.amount)) : 0;
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    
    if (passForm.new.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (passForm.new !== passForm.confirm) {
      setPassError('New passwords do not match.');
      return;
    }
    
    // Mock API call
    setTimeout(() => {
      setPassSuccess('Password updated successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassForm({ current: '', new: '', confirm: '' });
        setPassSuccess('');
      }, 2000);
    }, 1000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateUser({ name: editForm.name, email: editForm.email });
    setEditSuccess('Profile updated successfully!');
    setTimeout(() => {
      setShowEditModal(false);
      setEditSuccess('');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm === 'DELETE') {
      // Mock API delete
      logout();
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">User Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Section 1: User Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div 
                className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-1 shadow-lg mb-4 cursor-pointer group relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile picture"
              >
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden relative">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                      {getInitials()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <MdEdit className="text-white" size={24} />
                  </div>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name || 'User'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MdCalendarToday className="text-blue-500" size={18} />
                <span>Joined August 2026</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <MdAccessTime className="text-blue-500" size={18} />
                <span>Last login: Today</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setEditForm({ name: user?.name || '', email: user?.email || '' });
                setShowEditModal(true);
              }}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-white/5"
            >
              <MdEdit size={18} />
              Edit Profile
            </button>
          </motion.div>

          {/* Section 2: Security */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <MdSecurity className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Security</h3>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-white/5"
            >
              <MdLockOutline size={18} />
              Change Password
            </button>
          </motion.div>

          {/* Section 6: Account Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 border-red-500/20">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Account</h3>
            <div className="space-y-3">
              <button onClick={() => { logout(); navigate('/'); }} className="w-full py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-white/5">
                <MdLogout size={18} />
                Logout
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-medium rounded-xl flex items-center gap-2 transition-colors border border-red-500/20">
                <MdDeleteForever size={18} />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Section 4: Statistics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <MdBarChart className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Statistics</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 dark:border-blue-500/20">
                <MdAttachMoney className="text-blue-500 mb-2" size={24} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Expenses</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">₹{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/10 dark:border-cyan-500/20">
                <MdReceipt className="text-cyan-500 mb-2" size={24} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Transactions</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{totalTransactions}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20">
                <MdStar className="text-emerald-500 mb-2" size={24} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Highest Expense</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">₹{highestExpense.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/10 dark:border-purple-500/20">
                <MdCalendarToday className="text-purple-500 mb-2" size={24} />
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Member Since</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">Aug 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Preferences */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <MdSettings className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Preferences</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MdAttachMoney /> Default Currency
                </label>
                <select className="auth-input w-full p-2.5 rounded-lg cursor-pointer">
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="INR">₹ INR (Indian Rupee)</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="USD">$ USD (US Dollar)</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="EUR">€ EUR (Euro)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MdPalette /> Theme
                </label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 p-1 bg-black/5 dark:bg-black/20">
                  <button onClick={() => theme === 'dark' && toggleTheme()} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>Light</button>
                  <button onClick={() => theme === 'light' && toggleTheme()} className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${theme === 'dark' ? 'bg-slate-800 shadow-sm text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>Dark</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MdLanguage /> Time Zone
                </label>
                <select className="auth-input w-full p-2.5 rounded-lg cursor-pointer">
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="IST">(GMT+5:30) India Standard Time</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="UTC">(GMT+0:00) Universal Time Coordinated</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <MdCalendarToday /> Date Format
                </label>
                <select className="auth-input w-full p-2.5 rounded-lg cursor-pointer">
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white" value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Section 5: Data Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <MdCloudUpload className="text-blue-500" size={24} />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Data Management</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-white/5">
                <MdFileDownload size={18} />
                Export Data (CSV)
              </button>
              <button className="py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-white/5">
                <MdFileUpload size={18} />
                Import Data
              </button>
              <button className="py-2.5 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 font-medium rounded-xl flex items-center gap-2 transition-colors border border-slate-200 dark:border-white/5">
                <MdCloudUpload size={18} />
                Backup Database
              </button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="auth-glass w-full max-w-md p-8 relative z-10"
            >
              <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Edit Profile</h2>
              
              {editSuccess && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20">{editSuccess}</div>}
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                  <input type="text" required className="auth-input w-full p-3" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                  <input type="email" required className="auth-input w-full p-3" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} />
                </div>
                <button type="submit" className="auth-btn w-full mt-4">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPasswordModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="auth-glass w-full max-w-md p-8 relative z-10"
            >
              <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Change Password</h2>
              
              {passError && <div className="mb-4 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20">{passError}</div>}
              {passSuccess && <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm border border-emerald-500/20">{passSuccess}</div>}
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
                  <div className="relative">
                    <input type={showPasswords ? "text" : "password"} required className="auth-input w-full p-3 pr-10" value={passForm.current} onChange={(e) => setPassForm({...passForm, current: e.target.value})} />
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                      {showPasswords ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">New Password</label>
                  <div className="relative">
                    <input type={showPasswords ? "text" : "password"} required className="auth-input w-full p-3 pr-10" value={passForm.new} onChange={(e) => setPassForm({...passForm, new: e.target.value})} />
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                      {showPasswords ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input type={showPasswords ? "text" : "password"} required className="auth-input w-full p-3 pr-10" value={passForm.confirm} onChange={(e) => setPassForm({...passForm, confirm: e.target.value})} />
                    <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                      {showPasswords ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="auth-btn w-full mt-4">Update Password</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="auth-glass w-full max-w-md p-8 relative z-10 border-red-500/30"
            >
              <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <MdClose size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-4 text-red-500">
                <MdWarning size={28} />
                <h2 className="text-2xl font-bold">Delete Account</h2>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                This action is <strong>permanent</strong> and cannot be undone. All your expenses, budgets, and personal data will be completely wiped from our servers.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  To confirm, type <span className="font-bold text-red-500 select-none">DELETE</span> below:
                </label>
                <input 
                  type="text" 
                  className="auth-input w-full p-3 border-red-500/30 focus:border-red-500" 
                  value={deleteConfirm} 
                  onChange={(e) => setDeleteConfirm(e.target.value)} 
                  placeholder="DELETE"
                />
              </div>
              
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE'}
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:shadow-none"
              >
                Permanently Delete Account
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProfilePage;
