const express = require('express');
const router = express.Router();
const {
  getQuickExpenses,
  addQuickExpense,
  updateQuickExpense,
  deleteQuickExpense
} = require('../controllers/quickExpenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuickExpenses)
  .post(protect, addQuickExpense);

router.route('/:id')
  .put(protect, updateQuickExpense)
  .delete(protect, deleteQuickExpense);

module.exports = router;
