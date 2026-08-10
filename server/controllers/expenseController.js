const Expense = require('../models/Expense');
const User = require('../models/User');

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
    const { amount, type = 'expense', category, description, paymentMethod, date, time, notes } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (type === 'expense' && user.walletBalance < amount) {
      res.status(400);
      throw new Error('Insufficient balance');
    }

    const expense = await Expense.create({
      user: req.user.id,
      amount,
      type,
      category,
      description,
      paymentMethod,
      date,
      time,
      notes
    });

    const balanceChange = type === 'expense' ? -amount : amount;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { $inc: { walletBalance: balanceChange } }, 
      { new: true }
    );

    res.status(201).json({ expense, walletBalance: updatedUser.walletBalance });
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

    const user = await User.findById(req.user.id);
    const oldAmount = expense.amount;
    const oldType = expense.type;
    const newAmount = req.body.amount !== undefined ? Number(req.body.amount) : oldAmount;
    const newType = req.body.type || oldType;

    // Calculate effect on wallet
    // Reverse old effect: if old was expense, we add oldAmount back. If old was income, subtract oldAmount.
    const oldEffect = oldType === 'expense' ? oldAmount : -oldAmount;
    
    // Apply new effect: if new is expense, we subtract newAmount. If new is income, add newAmount.
    const newEffect = newType === 'expense' ? -newAmount : newAmount;
    
    const balanceChange = oldEffect + newEffect;

    if (balanceChange < 0 && user.walletBalance < Math.abs(balanceChange)) {
      res.status(400);
      throw new Error('Insufficient balance to update this transaction');
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    let updatedWalletBalance = user.walletBalance;
    if (balanceChange !== 0) {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $inc: { walletBalance: balanceChange } },
        { new: true }
      );
      updatedWalletBalance = updatedUser.walletBalance;
    }

    res.status(200).json({ expense: updatedExpense, walletBalance: updatedWalletBalance });
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

    const balanceChange = expense.type === 'expense' ? expense.amount : -expense.amount;
    
    // Allow deleting income even if it makes wallet negative?
    // User requested "If a transaction is deleted: The wallet balance must be restored appropriately."
    // Yes, just atomic update.
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { walletBalance: balanceChange } },
      { new: true }
    );

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Expense deleted', walletBalance: updatedUser.walletBalance });
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
