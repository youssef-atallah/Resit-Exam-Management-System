// Import all modules
import { formatDate, formatTimeAgo } from './utils/dateUtils.js';
import { showNotification, validateForm, showModal } from './utils/uiUtils.js';
import { auth } from './auth/auth.js';
import { apiRequest } from './api/apiService.js';
import { navigation } from './utils/navigation.js';
import { exportToExcel, exportToPDF } from './utils/exportUtils.js';
import { sortTable } from './utils/tableUtils.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    navigation.handleNavigation();

    // Comment out authentication check for development
    // if (!auth.isAuthenticated() && !window.location.pathname.includes('index.html')) {
    //     window.location.href = '../../index.html';
    //     return;
    // }

    // Initialize header if it exists
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        initializeHeader();
    }
});

// Header initialization
async function initializeHeader() {
    try {
        const response = await fetch('../../components/header.html');
        if (!response.ok) {
            throw new Error('Failed to load header component');
        }
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;

        const userData = auth.getCurrentUser();
        if (userData) {
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            if (userName) userName.textContent = userData.name;
            if (userRole) userRole.textContent = userData.role;
        }

        // Add logout event listener
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => auth.logout());
        }
    } catch (error) {
        showNotification('Failed to initialize header', 'error');
        console.error('Header initialization error:', error);
    }
}

// Export all utilities and functions for use in other files
export {
    formatDate,
    formatTimeAgo,
    showNotification,
    validateForm,
    showModal,
    auth,
    apiRequest,
    navigation,
    exportToExcel,
    exportToPDF,
    sortTable
}; 