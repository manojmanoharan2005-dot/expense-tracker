// ===========================
// TRACKIFY - DASHBOARD.JS
// ===========================

// Require authentication
requireAuth();

// Load theme
loadTheme();

// Global variables
let allExpenses = [];
let categoryChart = null;
let trendChart = null;
let analyticsChart = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadExpenses();
    initializeCharts();
    setDefaultDate();
});

// Load user information
function loadUserInfo() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('user-name').textContent = userData.name;
        document.getElementById('user-email').textContent = userData.email;
        document.getElementById('user-avatar').textContent = userData.name.charAt(0).toUpperCase();
        document.getElementById('monthly-budget').textContent = formatCurrency(userData.monthlyBudget || 0);
        document.getElementById('current-budget').textContent = formatCurrency(userData.monthlyBudget || 0);

        if (userData.monthlyBudget) {
            document.getElementById('budget-amount').value = userData.monthlyBudget;
        }
    }
}

// Set default date to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
}

// Load all expenses
async function loadExpenses() {
    try {
        allExpenses = await apiRequest('/expenses', {
            method: 'GET'
        });

        updateDashboard();
        renderExpensesTable();
        filterExpenses();
    } catch (error) {
        console.error('Error loading expenses:', error);
        showAlert('Failed to load expenses', 'danger');
    }
}

// Update dashboard statistics
function updateDashboard() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter expenses for current month
    const currentMonthExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Filter expenses for previous month
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === previousMonth && expenseDate.getFullYear() === previousYear;
    });

    // Calculate totals
    const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const previousTotal = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate today's expenses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        expenseDate.setHours(0, 0, 0, 0);
        return expenseDate.getTime() === today.getTime();
    });
    const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate overall total (all time)
    const overallTotal = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate percentage change
    const percentageChange = previousTotal > 0
        ? ((totalSpent - previousTotal) / previousTotal * 100).toFixed(1)
        : 0;

    // Update stats
    document.getElementById('today-spent').textContent = formatCurrency(todayTotal);
    document.getElementById('today-count').textContent = `${todayExpenses.length} transaction${todayExpenses.length !== 1 ? 's' : ''}`;
    document.getElementById('total-spent').textContent = formatCurrency(totalSpent);
    document.getElementById('overall-total').textContent = formatCurrency(overallTotal);
    document.getElementById('overall-count').textContent = `${allExpenses.length} total`;
    document.getElementById('total-transactions').textContent = currentMonthExpenses.length;

    const changeElement = document.getElementById('spent-change');
    if (percentageChange > 0) {
        changeElement.innerHTML = `<span class="text-danger">↑ ${percentageChange}%</span> vs last month`;
    } else if (percentageChange < 0) {
        changeElement.innerHTML = `<span class="text-success">↓ ${Math.abs(percentageChange)}%</span> vs last month`;
    } else {
        changeElement.innerHTML = `<span>→ 0%</span> vs last month`;
    }

    // Calculate average daily spending
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const avgDaily = totalSpent / daysInMonth;
    document.getElementById('avg-daily').textContent = formatCurrency(avgDaily);

    // Update budget information
    const userData = getUserData();
    const monthlyBudget = userData?.monthlyBudget || 0;
    const remaining = monthlyBudget - totalSpent;
    const budgetPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget * 100).toFixed(1) : 0;

    document.getElementById('budget-remaining').textContent = `${formatCurrency(remaining)} remaining`;
    document.getElementById('budget-spent').textContent = formatCurrency(totalSpent);
    document.getElementById('budget-left').textContent = formatCurrency(remaining);
    document.getElementById('budget-progress').style.width = `${Math.min(budgetPercentage, 100)}%`;
    document.getElementById('budget-percentage').textContent = `${budgetPercentage}% used`;

    // Show budget alert if needed
    const alertContainer = document.getElementById('budget-alert');
    if (monthlyBudget > 0) {
        if (budgetPercentage >= 100) {
            alertContainer.innerHTML = '<div class="alert alert-danger">⚠️ You have exceeded your monthly budget!</div>';
            alertContainer.style.display = 'block';
        } else if (budgetPercentage >= 80) {
            alertContainer.innerHTML = '<div class="alert alert-warning">⚠️ You have used 80% of your monthly budget!</div>';
            alertContainer.style.display = 'block';
        } else {
            alertContainer.style.display = 'none';
        }
    }

    // Update analytics section
    document.getElementById('analytics-current').textContent = formatCurrency(totalSpent);
    document.getElementById('analytics-previous').textContent = formatCurrency(previousTotal);

    const analyticsChange = document.getElementById('analytics-change');
    if (percentageChange > 0) {
        analyticsChange.textContent = `+${percentageChange}%`;
        analyticsChange.className = 'stat-value text-danger';
    } else if (percentageChange < 0) {
        analyticsChange.textContent = `${percentageChange}%`;
        analyticsChange.className = 'stat-value text-success';
    } else {
        analyticsChange.textContent = '0%';
        analyticsChange.className = 'stat-value';
    }

    // Find top category
    const categoryTotals = {};
    currentMonthExpenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategory = Object.keys(categoryTotals).reduce((a, b) =>
        categoryTotals[a] > categoryTotals[b] ? a : b, 'None'
    );

    document.getElementById('analytics-top-category').textContent = topCategory;

    // Update recent transactions
    updateRecentTransactions(currentMonthExpenses);

    // Update charts
    updateCharts(currentMonthExpenses);
}

// Update recent transactions table
function updateRecentTransactions(expenses) {
    const tbody = document.getElementById('recent-transactions');

    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No transactions yet</td></tr>';
        return;
    }

    // Sort by date (newest first) and take first 5
    const recent = expenses
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    tbody.innerHTML = recent.map(expense => `
    <tr>
      <td>${formatDate(expense.date)}</td>
      <td>${expense.title}</td>
      <td><span class="badge badge-${expense.category.toLowerCase()}">${expense.category}</span></td>
      <td><strong>${formatCurrency(expense.amount)}</strong></td>
    </tr>
  `).join('');
}

// Render expenses table
function renderExpensesTable(expenses = allExpenses) {
    const tbody = document.getElementById('expenses-table');

    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No expenses found</td></tr>';
        return;
    }

    // Sort by date (newest first)
    const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sorted.map(expense => `
    <tr>
      <td>${formatDate(expense.date)}</td>
      <td>${expense.title}</td>
      <td><span class="badge badge-${expense.category.toLowerCase()}">${expense.category}</span></td>
      <td><strong>${formatCurrency(expense.amount)}</strong></td>
      <td>${expense.notes || '-'}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editExpense('${expense._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteExpense('${expense._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Filter expenses
function filterExpenses() {
    const category = document.getElementById('filter-category')?.value;
    const month = document.getElementById('filter-month')?.value;

    let filtered = allExpenses;

    if (category) {
        filtered = filtered.filter(exp => exp.category === category);
    }

    if (month) {
        const [year, monthNum] = month.split('-');
        filtered = filtered.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getFullYear() === parseInt(year) &&
                expDate.getMonth() === parseInt(monthNum) - 1;
        });
    }

    renderExpensesTable(filtered);
}

// Initialize charts
function initializeCharts() {
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#ef4444', '#3b82f6', '#ec4899', '#a855f7',
                        '#f59e0b', '#10b981', '#6366f1', '#94a3b8'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#64748b' }
                    }
                }
            }
        });
    }

    // Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Daily Spending',
                    data: [],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#64748b' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#64748b' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#64748b' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                    }
                }
            }
        });
    }

    // Analytics Chart
    const analyticsCtx = document.getElementById('analyticsChart');
    if (analyticsCtx) {
        analyticsChart = new Chart(analyticsCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Spending by Category',
                    data: [],
                    backgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        labels: { color: '#64748b' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#64748b' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#64748b' },
                        grid: { color: 'rgba(0, 0, 0, 0.1)' }
                    }
                }
            }
        });
    }
}

// Update charts with current data
function updateCharts(expenses) {
    // Category breakdown
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (categoryChart) {
        categoryChart.data.labels = categories;
        categoryChart.data.datasets[0].data = amounts;
        categoryChart.update();
    }

    if (analyticsChart) {
        analyticsChart.data.labels = categories;
        analyticsChart.data.datasets[0].data = amounts;
        analyticsChart.update();
    }

    // Daily trend for current month
    const dailyTotals = {};
    expenses.forEach(expense => {
        const day = new Date(expense.date).getDate();
        dailyTotals[day] = (dailyTotals[day] || 0) + expense.amount;
    });

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const days = [];
    const dailyAmounts = [];
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
        dailyAmounts.push(dailyTotals[i] || 0);
    }

    if (trendChart) {
        trendChart.data.labels = days;
        trendChart.data.datasets[0].data = dailyAmounts;
        trendChart.update();
    }
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.getElementById('overview-section').style.display = 'none';
    document.getElementById('expenses-section').style.display = 'none';
    document.getElementById('budget-section').style.display = 'none';
    document.getElementById('goals-section').style.display = 'none';
    document.getElementById('analytics-section').style.display = 'none';

    // Show selected section
    document.getElementById(`${sectionName}-section`).style.display = 'block';

    // Update active menu item
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Modal functions
function openAddExpenseModal() {
    document.getElementById('modal-title').textContent = 'Add Expense';
    document.getElementById('expense-form').reset();
    document.getElementById('expense-id').value = '';
    setDefaultDate();
    document.getElementById('expense-modal').classList.add('active');
}

function closeExpenseModal() {
    document.getElementById('expense-modal').classList.remove('active');
}

// Edit expense
function editExpense(id) {
    const expense = allExpenses.find(exp => exp._id === id);
    if (!expense) return;

    document.getElementById('modal-title').textContent = 'Edit Expense';
    document.getElementById('expense-id').value = expense._id;
    document.getElementById('expense-title').value = expense.title;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-category').value = expense.category;
    document.getElementById('expense-date').value = new Date(expense.date).toISOString().split('T')[0];
    document.getElementById('expense-notes').value = expense.notes || '';

    document.getElementById('expense-modal').classList.add('active');
}

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) {
        return;
    }

    try {
        await apiRequest(`/expenses/${id}`, {
            method: 'DELETE'
        });

        showAlert('Expense deleted successfully', 'success');
        loadExpenses();
    } catch (error) {
        showAlert(error.message || 'Failed to delete expense', 'danger');
    }
}

// Expense form submit
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('expense-id').value;
    const title = document.getElementById('expense-title').value.trim();
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    const notes = document.getElementById('expense-notes').value.trim();

    if (!title || !amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const expenseData = { title, amount, category, date, notes };

    try {
        if (id) {
            // Update existing expense
            await apiRequest(`/expenses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(expenseData)
            });
            showAlert('Expense updated successfully', 'success');
        } else {
            // Create new expense
            await apiRequest('/expenses', {
                method: 'POST',
                body: JSON.stringify(expenseData)
            });
            showAlert('Expense added successfully', 'success');
        }

        closeExpenseModal();
        loadExpenses();
    } catch (error) {
        alert(error.message || 'Failed to save expense');
    }
});

// Budget form submit
document.getElementById('budget-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('budget-amount').value);

    if (amount < 0) {
        alert('Budget amount cannot be negative');
        return;
    }

    try {
        await apiRequest('/expenses/budget/update', {
            method: 'PUT',
            body: JSON.stringify({ monthlyBudget: amount })
        });

        // Update local user data
        const userData = getUserData();
        userData.monthlyBudget = amount;
        setUserData(userData);

        showAlert('Budget updated successfully', 'success');
        loadUserInfo();
        updateDashboard();
    } catch (error) {
        alert(error.message || 'Failed to update budget');
    }
});

// Export expenses to CSV
async function exportToCSV() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('Session expired. Please login again.', 'danger');
            return;
        }

        const response = await fetch(`${API_URL}/expenses/export`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Export failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trackify_expenses_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showAlert('Expenses exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showAlert('Failed to export expenses', 'danger');
    }
}

