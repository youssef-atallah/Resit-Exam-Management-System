// Login page handler - Uses JWT authentication
import { login } from './utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const roleOptions = document.querySelectorAll('.role-option');
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    let selectedRole = null;

    // Handle role selection
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            roleOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedRole = option.dataset.role;
            loginBtn.disabled = false;
        });
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!selectedRole) {
            showError('Please select a role');
            return;
        }

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            showError('Please enter both ID and password');
            return;
        }

        // Disable button and show loading
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        try {
            // Call login function from auth.js
            const data = await login({
                id: username,
                password: password
            });

            // Verify role matches selection
            if (data.user.role !== selectedRole) {
                throw new Error(`Invalid credentials for ${selectedRole} role`);
            }

            // Show success message
            showSuccess('Login successful! Redirecting...');

            // Redirect based on role
            setTimeout(() => {
                switch (data.user.role) {
                    case 'student':
                        window.location.href = 'pages/student/dashboard.html';
                        break;
                    case 'instructor':
                        window.location.href = 'pages/instructor/dashboard.html';
                        break;
                    case 'secretary':
                        window.location.href = 'pages/secretary/dashboard.html';
                        break;
                    default:
                        throw new Error('Unknown user role');
                }
            }, 500);

        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Login failed. Please check your credentials.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Login';
        }
    });

    // Helper function to show error messages
    function showError(message) {
        // Remove existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        loginForm.appendChild(errorDiv);

        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Helper function to show success messages
    function showSuccess(message) {
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const successDiv = document.createElement('div');
        successDiv.className = 'error-message';
        successDiv.style.color = '#10b981';
        successDiv.textContent = message;
        loginForm.appendChild(successDiv);
    }
});
