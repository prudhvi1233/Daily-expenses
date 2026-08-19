const mongoose = require('mongoose');

const quickExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method']
  },
  icon: {
    type: String,
    default: '📌'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuickExpense', quickExpenseSchema);
