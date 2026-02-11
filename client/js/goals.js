
// ===========================
// GOALS FUNCTIONALITY
// ===========================

let allGoals = [];

// Load all goals
async function loadGoals() {
    try {
        allGoals = await apiRequest('/goals', { method: 'GET' });
        renderGoals();
    } catch (error) {
        console.error('Error loading goals:', error);
        showAlert('Failed to load goals', 'danger');
    }
}

// Render goals grid
function renderGoals() {
    const goalsGrid = document.getElementById('goals-grid');

    if (allGoals.length === 0) {
        goalsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <p class="empty-state-text">No goals yet</p>
                <p class="text-muted">Start by creating your first savings goal!</p>
            </div>
        `;
        return;
    }

    goalsGrid.innerHTML = allGoals.map(goal => {
        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount * 100).toFixed(1) : 0;
        const remaining = goal.targetAmount - goal.currentAmount;
        const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;
        const isCompleted = goal.completed;

        const categoryIcons = {
            'Emergency Fund': '🚨',
            'Vacation': '✈️',
            'Education': '📚',
            'Home': '🏠',
            'Car': '🚗',
            'Investment': '📈',
            'Other': '📦'
        };

        const icon = categoryIcons[goal.category] || '🎯';

        return `
            <div class="card goal-card ${isCompleted ? 'goal-completed' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${icon}</div>
                        <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.25rem;">${goal.name}</h3>
                        <p class="text-muted" style="font-size: 0.875rem;">${goal.category}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="action-btn" onclick="contributeToGoal('${goal._id}')" title="Add Money">
                            💰
                        </button>
                        <button class="action-btn" onclick="editGoal('${goal._id}')" title="Edit">
                            ✏️
                        </button>
                        <button class="action-btn" onclick="deleteGoal('${goal._id}')" title="Delete">
                            🗑️
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem; font-weight: 700;">${formatCurrency(goal.currentAmount)}</span>
                        <span style="font-size: 0.875rem; color: var(--text-muted);">of ${formatCurrency(goal.targetAmount)}</span>
                    </div>
                    
                    <div style="background: #e5e7eb; height: 12px; border-radius: 999px; overflow: hidden;">
                        <div style="height: 100%; background: ${isCompleted ? '#10b981' : '#6366f1'}; width: ${Math.min(progress, 100)}%; transition: width 0.3s ease;"></div>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.875rem;">
                        <span style="color: ${isCompleted ? '#10b981' : '#6366f1'}; font-weight: 600;">${progress}% Complete</span>
                        <span class="text-muted">${formatCurrency(remaining)} to go</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e5e7eb;">
                    <span style="font-size: 0.875rem; color: var(--text-muted);">
                        📅 ${formatDate(goal.deadline)}
                    </span>
                    <span style="font-size: 0.875rem; font-weight: 600; color: ${isOverdue ? '#ef4444' : isCompleted ? '#10b981' : '#6366f1'};">
                        ${isCompleted ? '✅ Completed!' : isOverdue ? '⚠️ Overdue' : `${daysLeft} days left`}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

// Open add goal modal
function openAddGoalModal() {
    document.getElementById('goal-modal-title').textContent = 'Add Savings Goal';
    document.getElementById('goal-form').reset();
    document.getElementById('goal-id').value = '';

    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('goal-deadline').min = today;

    document.getElementById('goal-modal').classList.add('active');
}

// Close goal modal
function closeGoalModal() {
    document.getElementById('goal-modal').classList.remove('active');
}

// Edit goal
function editGoal(id) {
    const goal = allGoals.find(g => g._id === id);
    if (!goal) return;

    document.getElementById('goal-modal-title').textContent = 'Edit Savings Goal';
    document.getElementById('goal-id').value = goal._id;
    document.getElementById('goal-name').value = goal.name;
    document.getElementById('goal-category').value = goal.category;
    document.getElementById('goal-target').value = goal.targetAmount;
    document.getElementById('goal-current').value = goal.currentAmount;
    document.getElementById('goal-deadline').value = new Date(goal.deadline).toISOString().split('T')[0];

    document.getElementById('goal-modal').classList.add('active');
}

// Delete goal
async function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this goal?')) {
        return;
    }

    try {
        await apiRequest(`/goals/${id}`, { method: 'DELETE' });
        showAlert('Goal deleted successfully', 'success');
        loadGoals();
    } catch (error) {
        showAlert(error.message || 'Failed to delete goal', 'danger');
    }
}

// Contribute to goal
async function contributeToGoal(id) {
    const amount = prompt('Enter amount to add to this goal (₹):');

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        return;
    }

    try {
        await apiRequest(`/goals/${id}/contribute`, {
            method: 'PUT',
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        showAlert('Contribution added successfully!', 'success');
        loadGoals();
    } catch (error) {
        showAlert(error.message || 'Failed to add contribution', 'danger');
    }
}

// Goal form submit
document.getElementById('goal-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('goal-id').value;
    const name = document.getElementById('goal-name').value.trim();
    const category = document.getElementById('goal-category').value;
    const targetAmount = parseFloat(document.getElementById('goal-target').value);
    const currentAmount = parseFloat(document.getElementById('goal-current').value) || 0;
    const deadline = document.getElementById('goal-deadline').value;

    if (!name || !category || !targetAmount || !deadline) {
        alert('Please fill in all required fields');
        return;
    }

    const goalData = { name, category, targetAmount, currentAmount, deadline };

    try {
        if (id) {
            // Update existing goal
            await apiRequest(`/goals/${id}`, {
                method: 'PUT',
                body: JSON.stringify(goalData)
            });
            showAlert('Goal updated successfully', 'success');
        } else {
            // Create new goal
            await apiRequest('/goals', {
                method: 'POST',
                body: JSON.stringify(goalData)
            });
            showAlert('Goal created successfully!', 'success');
        }

        closeGoalModal();
        loadGoals();
    } catch (error) {
        alert(error.message || 'Failed to save goal');
    }
});

// Close modal when clicking outside
document.getElementById('goal-modal').addEventListener('click', (e) => {
    if (e.target.id === 'goal-modal') {
        closeGoalModal();
    }
});

// Load goals when dashboard loads
document.addEventListener('DOMContentLoaded', () => {
    loadGoals();
});
