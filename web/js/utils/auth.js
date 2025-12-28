// Core Authentication Utilities for JWT-based Auth
// Handles login, logout, token management, and API request headers

const API_BASE_URL = '';

/**
 * Sign in user and store JWT token
 * @param {Object} credentials - {id/email, password}
 * @returns {Promise<Object>} User data and token
 */
export async function login(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store role-specific IDs for backward compatibility
        if (data.user.role === 'student') {
            localStorage.setItem('studentId', data.user.id);
        } else if (data.user.role === 'instructor') {
            localStorage.setItem('instructorId', data.user.id);
        }
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

/**
 * Logout user and clear all stored data
 */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('studentId');
    localStorage.removeItem('instructorId');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    window.location.href = '/index.html';
}

/**
 * Get stored JWT token
 * @returns {string|null} JWT token or null
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Get stored user data
 * @returns {Object|null} User object or null
 */
export function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export function isAuthenticated() {
    const token = getToken();
    const user = getUser();
    return !!(token && user);
}

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

/**
 * Make authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export async function authenticatedFetch(endpoint, options = {}) {
    const token = getToken();
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions);
    
    // Handle authentication errors
    if (response.status === 401) {
        handleAuthError('Session expired. Please login again.');
        throw new Error('Unauthorized');
    }
    
    if (response.status === 403) {
        handleAuthError('You do not have permission to access this resource.');
        throw new Error('Forbidden');
    }
    
    return response;
}

/**
 * Handle authentication errors
 * @param {string} message - Error message
 */
export function handleAuthError(message) {
    console.error('Auth error:', message);
    alert(message);
    logout();
}

/**
 * Check authentication and redirect if not authenticated
 * @param {string} requiredRole - Required user role (optional)
 */
export function requireAuth(requiredRole = null) {
    if (!isAuthenticated()) {
        window.location.href = '/index.html';
        return false;
    }
    
    if (requiredRole) {
        const user = getUser();
        if (user.role !== requiredRole) {
            alert('You do not have permission to access this page');
            window.location.href = '/index.html';
            return false;
        }
    }
    
    return true;
}

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export function getUserRole() {
    const user = getUser();
    return user ? user.role : null;
}

/**
 * Get user ID
 * @returns {string|null} User ID or null
 */
export function getUserId() {
    const user = getUser();
    return user ? user.id : null;
}
