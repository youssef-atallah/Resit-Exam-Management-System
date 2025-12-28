/**
 * Header Utility Module
 * 
 * Provides common header functionality including:
 * - User dropdown menu toggle
 * - Logout functionality
 * - User name display
 * 
 * Import and call initializeHeader() on any page that uses the standard header.
 */

/**
 * Initialize all header functionality
 * Call this on DOMContentLoaded for any page with the standard header
 */
export function initializeHeader() {
    initializeUserMenu();
    initializeUserName();
    initializeLogout();
}

/**
 * Initialize user dropdown menu toggle
 */
function initializeUserMenu() {
    const userInfo = document.querySelector('.user-info');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    
    if (userInfo && dropdownMenu) {
        // Toggle dropdown on click
        userInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
}

/**
 * Display the logged-in user's name in the header
 */
function initializeUserName() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userData.name;
        }
    }
}

/**
 * Initialize logout button functionality
 */
function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            try {
                // Clear all stored data
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                sessionStorage.clear();
                
                // Redirect to login page
                // Handle different page depths
                const pathParts = window.location.pathname.split('/');
                let redirectPath = '/index.html';
                
                // Check if we're in /pages/role/ directory
                if (pathParts.includes('pages')) {
                    redirectPath = '../../index.html';
                }
                
                window.location.href = redirectPath;
            } catch (error) {
                console.error('Logout error:', error);
                // Force redirect anyway
                window.location.href = '/index.html';
            }
        });
    }
}

/**
 * Set the active navigation link based on current page
 */
export function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize everything for the header
 * This is the main entry point to call from any page
 */
export function initializePageHeader() {
    initializeHeader();
    setActiveNavLink();
}
