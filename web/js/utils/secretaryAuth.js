// Secretary authentication and data utilities - JWT based
import { getToken, getUser, logout, authenticatedFetch, requireAuth } from './auth.js';

/**
 * Check if secretary is authenticated and redirect if not
 */
export function checkSecretaryAuth() {
    return requireAuth('secretary');
}

/**
 * Get logged-in secretary data from API
 * Uses JWT token and user data from localStorage
 */
export async function getLoggedInSecretaryData() {
    try {
        const user = getUser();
        if (user && user.role === 'secretary') {
            return user;
        }
        return { id: 'unknown', name: 'Secretary', email: 'secretary@uskudar.edu.tr' };
    } catch (error) {
        console.error('Error fetching secretary data:', error);
        const user = getUser();
        if (user) {
            return user;
        }
        return { id: 'unknown', name: 'Secretary', email: 'secretary@uskudar.edu.tr' };
    }
}

/**
 * Update secretary name in header
 * Fetches user data and updates all .user-name elements
 */
export async function updateSecretaryNameInHeader() {
    try {
        const secretaryData = await getLoggedInSecretaryData();
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (secretaryData.name) {
                element.textContent = secretaryData.name;
            }
        });
        
        // Also update welcome message if exists
        const welcomeName = document.getElementById('secretaryName');
        if (welcomeName && secretaryData.name) {
            welcomeName.textContent = secretaryData.name;
        }
    } catch (error) {
        console.error('Error updating secretary name:', error);
    }
}

/**
 * Handle secretary logout
 */
export function handleSecretaryLogout() {
    logout();
}
