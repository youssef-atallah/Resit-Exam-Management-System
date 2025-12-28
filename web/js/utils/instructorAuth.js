// Instructor authentication and data utilities - JWT based
import { getToken, getUser, logout, authenticatedFetch, requireAuth } from './auth.js';

/**
 * Check if instructor is authenticated and redirect if not
 */
export function checkInstructorAuth() {
    return requireAuth('instructor');
}

/**
 * Get logged-in instructor data from API
 * Uses JWT token to fetch from /my/instructor/profile endpoint
 */
export async function getLoggedInInstructorData() {
    try {
        const response = await authenticatedFetch('/my/instructor/profile');
        
        if (!response.ok) {
            throw new Error('Failed to fetch instructor data');
        }
        
        const data = await response.json();
        
        // Handle different response structures
        const instructorData = data.instructor || data;
        
        // Ensure we have the instructor ID
        if (!instructorData.id) {
            const user = getUser();
            if (user && user.id) {
                return { ...instructorData, id: user.id };
            }
        }
        
        return instructorData;
    } catch (error) {
        console.error('Error fetching instructor data:', error);
        const user = getUser();
        if (user) {
            return user;
        }
        return { id: 'unknown', name: 'Instructor', email: 'instructor@example.com' };
    }
}

/**
 * Update instructor name in header
 * Fetches real instructor data and updates all .user-name elements
 */
export async function updateInstructorNameInHeader() {
    try {
        const instructorData = await getLoggedInInstructorData();
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (instructorData.name) {
                element.textContent = instructorData.name;
            }
        });
    } catch (error) {
        console.error('Error updating instructor name:', error);
    }
}

/**
 * Handle instructor logout
 */
export function handleInstructorLogout() {
    logout();
}
