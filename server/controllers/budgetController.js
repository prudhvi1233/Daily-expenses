const Budget = require('../models/Budget');

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Set or update a budget
// @route   POST /api/budgets
// @access  Private
const setBudget = async (req, res, next) => {
  try {
    const { category, amount } = req.body;

    let budget = await Budget.findOne({ user: req.user.id, category });

    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({
        user: req.user.id,
        category,
        amount
      });
    }

    res.status(200).json(budget);
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, setBudget };
