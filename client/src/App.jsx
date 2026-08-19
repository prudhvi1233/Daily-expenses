import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { TaskProvider } from './context/TaskContext';
import { QuickExpenseProvider } from './context/QuickExpenseContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import CalendarPage from './pages/CalendarPage';
import DailyExpensePage from './pages/DailyExpensePage';
import WeeklySummaryPage from './pages/WeeklySummaryPage';
import WeeklyDetailPage from './pages/WeeklyDetailPage';
import MonthlyGrandTotalPage from './pages/MonthlyGrandTotalPage';
import PlannerPage from './pages/PlannerPage';
import Wallet from './pages/Wallet';
import WalletHistory from './pages/WalletHistory';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Welcome from './pages/Welcome';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="h-screen flex items-center justify-center bg-transparent text-slate-300">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <>
      <div id="bg-light"></div>
      <div id="bg-dark"></div>
      <AuthProvider>
      <ExpenseProvider>
        <QuickExpenseProvider>
          <FinanceProvider>
            <TaskProvider>
              <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Welcome />} />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="calendar/month/:year/:month" element={<MonthlyGrandTotalPage />} />
                <Route path="calendar/:date" element={<DailyExpensePage />} />
                <Route path="weekly" element={<WeeklySummaryPage />} />
                <Route path="weekly/:year/:week" element={<WeeklyDetailPage />} />
                <Route path="planner" element={<PlannerPage />} />
                <Route path="wallet" element={<Wallet />} />
                <Route path="wallet/history" element={<WalletHistory />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Routes>
              </Router>
            </TaskProvider>
          </FinanceProvider>
        </QuickExpenseProvider>
      </ExpenseProvider>
      </AuthProvider>
    </>
  );
}

export default App;
