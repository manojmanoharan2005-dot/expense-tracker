// ===========================
// TRACKIFY - AUTH.JS
// ===========================

// Redirect if already authenticated
redirectIfAuthenticated();

// Load theme
loadTheme();

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validation
        if (!email || !password) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        try {
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';

            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Save token and user data
            setToken(data.token);
            setUserData({
                id: data._id,
                name: data.name,
                email: data.email,
                monthlyBudget: data.monthlyBudget
            });

            showAlert('Login successful! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);

        } catch (error) {
            showAlert(error.message || 'Login failed. Please try again.', 'danger');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}

// Signup Form Handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showAlert('Please fill in all fields', 'danger');
            return;
        }

        if (password.length < 6) {
            showAlert('Password must be at least 6 characters', 'danger');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'danger');
            return;
        }

        try {
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating account...';

            const data = await apiRequest('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            // Save token and user data
            setToken(data.token);
            setUserData({
                id: data._id,
                name: data.name,
                email: data.email,
                monthlyBudget: data.monthlyBudget
            });

            showAlert('Account created successfully! Redirecting...', 'success');

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);

        } catch (error) {
            showAlert(error.message || 'Signup failed. Please try again.', 'danger');
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Account';
        }
    });
}
