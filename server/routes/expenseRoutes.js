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

// @route   GET /api/expenses/export
// @desc    Export expenses to CSV
// @access  Private
router.get('/export', protect, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });

        // Define CSV headers
        let csv = 'Date,Title,Category,Amount,Notes\n';

        // Add expense rows
        expenses.forEach(expense => {
            const dateObj = new Date(expense.date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;
            const title = `"${expense.title.replace(/"/g, '""')}"`;
            const category = `"${expense.category}"`;
            const amount = expense.amount;
            const notes = `"${(expense.notes || '').replace(/"/g, '""')}"`;

            csv += `${date},${title},${category},${amount},${notes}\n`;
        });

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=trackify_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Export failed', error: error.message });
    }
});

module.exports = router;
