import { showNotification } from '../utils/uiUtils.js';

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

export const auth = {
    // Login
    login: async (studentId, password, role) => {
        try {
            // Simulate API call
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        data: {
                            id: 1,
                            studentId: studentId,
                            name: 'Test User',
                            role: role,
                            token: 'dummy-token'
                        }
                    });
                }, 1000);
            });

            if (response.success) {
                localStorage.setItem('userData', JSON.stringify(response.data));
                localStorage.setItem('token', response.data.token);
                return response.data;
            }
        } catch (error) {
            showNotification(error.message || 'An error occurred', 'error');
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            // Clear user data
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            sessionStorage.clear();
            
            // Redirect to main login page using relative path
            window.location.href = '../../index.html';
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get current user
    getCurrentUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
}; 