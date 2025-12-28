// Student authentication and data utilities - JWT based
import { getToken, getUser, logout, authenticatedFetch, requireAuth } from './auth.js';

/**
 * Check if student is authenticated and redirect if not
 */
export function checkStudentAuth() {
    return requireAuth('student');
}

/**
 * Get logged-in student data from API
 * Uses JWT token to fetch from /my/profile endpoint
 */
export async function getLoggedInStudentData() {
    try {
        // First try to get from /my/profile
        const response = await authenticatedFetch('/my/profile');
        
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        
        const data = await response.json();
        
        // Handle different response structures
        // API might return { student: {...} } or just {...}
        const studentData = data.student || data;
        
        // Ensure we have the student ID
        if (!studentData.id) {
            // Fallback to cached user data
            const user = getUser();
            if (user && user.id) {
                return { ...studentData, id: user.id };
            }
        }
        
        return studentData;
    } catch (error) {
        console.error('Error fetching student data:', error);
        // Return cached user data if available
        const user = getUser();
        if (user) {
            return user;
        }
        return { id: 'unknown', name: 'Student', email: 'student@example.com' };
    }
}

/**
 * Update student name in header
 * Fetches real student data and updates all .user-name elements
 */
export async function updateStudentNameInHeader() {
    try {
        const studentData = await getLoggedInStudentData();
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            if (studentData.name) {
                element.textContent = studentData.name;
            }
        });
    } catch (error) {
        console.error('Error updating student name:', error);
    }
}

/**
 * Update UI with student data (for profile page)
 */
export function updateUIWithStudentData(studentData) {
    // Update header name
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = studentData.name || 'Student';
    });
    
    // Update profile page if elements exist
    const profileName = document.getElementById('profileName');
    const profileId = document.getElementById('profileId');
    const profileEmail = document.getElementById('profileEmail');
    const fullName = document.getElementById('fullName');
    
    if (profileName) profileName.textContent = studentData.name || 'N/A';
    if (profileId) profileId.textContent = `Student ID: ${studentData.id || 'N/A'}`;
    if (profileEmail) profileEmail.textContent = studentData.email || 'N/A';
    if (fullName) fullName.textContent = studentData.name || 'N/A';
}

/**
 * Handle student logout
 */
export function handleStudentLogout() {
    logout();
}