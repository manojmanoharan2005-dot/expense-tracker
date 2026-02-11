// ===========================
// TRACKIFY - MAIN.JS
// ===========================

// API Base URL
const API_URL = 'http://localhost:3000/api';

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeIcon = document.getElementById('theme-icon');
        const themeText = document.getElementById('theme-text');
        if (themeIcon) themeIcon.textContent = '🌙';
        if (themeText) themeText.textContent = 'Dark Mode';
    }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', loadTheme);

// Format currency
function formatCurrency(amount) {
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} fade-in`;
    alert.textContent = message;

    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Set auth token
function setToken(token) {
    localStorage.setItem('token', token);
}

// Remove auth token
function removeToken() {
    localStorage.removeItem('token');
}

// Get user data
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Set user data
function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
}

// Remove user data
function removeUserData() {
    localStorage.removeItem('userData');
}

// Check if user is authenticated
function isAuthenticated() {
    return !!getToken();
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
}

// Redirect to dashboard if already authenticated
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.href = '/dashboard';
    }
}

// Logout
function logout() {
    removeToken();
    removeUserData();
    window.location.href = '/login';
}

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_URL,
        formatCurrency,
        formatDate,
        showAlert,
        getToken,
        setToken,
        removeToken,
        getUserData,
        setUserData,
        removeUserData,
        isAuthenticated,
        requireAuth,
        redirectIfAuthenticated,
        logout,
        apiRequest
    };
}
