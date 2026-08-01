const Expense = require('../models/Expense');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res, next) => {
  try {
    const { category, paymentMethod, startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query).sort({ date: -1, time: -1, createdAt: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Public
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, paymentMethod, date, time, notes } = req.body;

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      category,
      description,
      paymentMethod,
      date,
      time,
      notes
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Public
const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    if (expense.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400);
    next(error);
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Public
const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      res.status(404);
      throw new Error('Expense not found');
    }

    if (expense.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Expense deleted' });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
};
