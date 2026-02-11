const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
        min: [0, 'Amount cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other']
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date'],
        default: Date.now
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
expenseSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
