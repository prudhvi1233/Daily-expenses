const express = require('express');
const router = express.Router();
const {
  getQuickExpenses,
  addQuickExpense,
  deleteQuickExpense
} = require('../controllers/quickExpenseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getQuickExpenses)
  .post(protect, addQuickExpense);

router.route('/:id')
  .delete(protect, deleteQuickExpense);

module.exports = router;
