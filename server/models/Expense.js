const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0.01, 'Amount must be greater than zero']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Food', 'Travel', 'Shopping', 'Medical', 'Education', 'Entertainment', 'Recharge', 'Bills', 'Home', 'Fuel', 'Others']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please select a payment method'],
    enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Expense', expenseSchema);
