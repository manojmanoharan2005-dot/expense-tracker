const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/expenses
// @desc    Get all expenses for logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, amount, category, date, notes } = req.body;

        // Validation
        if (!title || !amount || !category) {
            return res.status(400).json({ message: 'Please provide title, amount, and category' });
        }

        if (amount < 0) {
            return res.status(400).json({ message: 'Amount cannot be negative' });
        }

        const expense = await Expense.create({
            user: req.user._id,
            title,
            amount,
            category,
            date: date || Date.now(),
            notes: notes || ''
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user owns this expense
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this expense' });
        }

        const { title, amount, category, date, notes } = req.body;

        // Update fields
        expense.title = title || expense.title;
        expense.amount = amount !== undefined ? amount : expense.amount;
        expense.category = category || expense.category;
        expense.date = date || expense.date;
        expense.notes = notes !== undefined ? notes : expense.notes;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Check if user owns this expense
        if (expense.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this expense' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense removed', id: req.params.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/expenses/budget/update
// @desc    Update user's monthly budget
// @access  Private
router.put('/budget/update', protect, async (req, res) => {
    try {
        const { monthlyBudget } = req.body;

        if (monthlyBudget === undefined || monthlyBudget < 0) {
            return res.status(400).json({ message: 'Please provide a valid budget amount' });
        }

        const user = await User.findById(req.user._id);
        user.monthlyBudget = monthlyBudget;
        await user.save();

        res.json({ monthlyBudget: user.monthlyBudget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
