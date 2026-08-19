const QuickExpense = require('../models/QuickExpense');

// @desc    Get quick expenses
// @route   GET /api/quick-expenses
// @access  Private
const getQuickExpenses = async (req, res) => {
  try {
    const quickExpenses = await QuickExpense.find({ user: req.user.id });
    res.status(200).json(quickExpenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add quick expense
// @route   POST /api/quick-expenses
// @access  Private
const addQuickExpense = async (req, res) => {
  try {
    const { description, amount, category, paymentMethod, icon } = req.body;

    if (!description || !amount || !category || !paymentMethod) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    const quickExpense = await QuickExpense.create({
      user: req.user.id,
      description,
      amount,
      category,
      paymentMethod,
      icon
    });

    res.status(201).json(quickExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quick expense
// @route   DELETE /api/quick-expenses/:id
// @access  Private
const deleteQuickExpense = async (req, res) => {
  try {
    const quickExpense = await QuickExpense.findById(req.params.id);

    if (!quickExpense) {
      return res.status(404).json({ message: 'Quick expense not found' });
    }

    // Check for user
    if (quickExpense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await quickExpense.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuickExpenses,
  addQuickExpense,
  deleteQuickExpense
};
