require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
