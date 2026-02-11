const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(protect);

// @route   GET /api/goals
// @desc    Get all goals for logged in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/goals/:id
// @desc    Get single goal
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Make sure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(goal);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { name, targetAmount, currentAmount, deadline, category, icon, color } = req.body;

        // Validation
        if (!name || !targetAmount || !deadline) {
            return res.status(400).json({ message: 'Please provide name, target amount, and deadline' });
        }

        const goal = await Goal.create({
            user: req.user.id,
            name,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline,
            category: category || 'Other',
            icon: icon || '🎯',
            color: color || '#6366f1'
        });

        res.status(201).json(goal);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        let goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Make sure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, targetAmount, currentAmount, deadline, category, icon, color } = req.body;

        goal = await Goal.findByIdAndUpdate(
            req.params.id,
            {
                name,
                targetAmount,
                currentAmount,
                deadline,
                category,
                icon,
                color
            },
            { new: true, runValidators: true }
        );

        res.json(goal);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Goal not found' });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/goals/:id/contribute
// @desc    Add money to a goal
// @access  Private
router.put('/:id/contribute', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Please provide a valid amount' });
        }

        let goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Make sure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        goal.currentAmount += amount;
        await goal.save();

        res.json(goal);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const goal = await Goal.findById(req.params.id);

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        // Make sure user owns the goal
        if (goal.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await goal.deleteOne();

        res.json({ message: 'Goal removed' });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Goal not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
