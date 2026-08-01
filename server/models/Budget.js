const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a budget amount']
  }
}, { timestamps: true });

// Ensure one budget per category per user
budgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
