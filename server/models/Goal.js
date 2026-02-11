const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a goal name'],
        trim: true,
        maxlength: [100, 'Goal name cannot be more than 100 characters']
    },
    targetAmount: {
        type: Number,
        required: [true, 'Please add a target amount'],
        min: [0, 'Target amount cannot be negative']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Current amount cannot be negative']
    },
    deadline: {
        type: Date,
        required: [true, 'Please add a deadline']
    },
    category: {
        type: String,
        enum: ['Emergency Fund', 'Vacation', 'Education', 'Home', 'Car', 'Investment', 'Other'],
        default: 'Other'
    },
    icon: {
        type: String,
        default: '🎯'
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
goalSchema.index({ user: 1, completed: 1 });

// Calculate progress percentage
goalSchema.virtual('progress').get(function () {
    return this.targetAmount > 0 ? (this.currentAmount / this.targetAmount * 100).toFixed(1) : 0;
});

// Check if goal is completed
goalSchema.pre('save', function (next) {
    if (this.currentAmount >= this.targetAmount && !this.completed) {
        this.completed = true;
        this.completedAt = new Date();
    } else if (this.currentAmount < this.targetAmount && this.completed) {
        this.completed = false;
        this.completedAt = null;
    }
    next();
});

module.exports = mongoose.model('Goal', goalSchema);
