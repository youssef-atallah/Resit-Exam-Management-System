
import { checkInstructorAuth, getLoggedInInstructorData, updateInstructorNameInHeader } from '../../utils/instructorAuth.js';
import { initializePageHeader } from '../../utils/header.js';
import { initializeNotifications } from '../../utils/notifications.js';

// Check auth immediately
checkInstructorAuth();

function getInitials(name) {
    if (!name) return '??';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '??';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function loadProfileData() {
    try {
        const instructor = await getLoggedInInstructorData();
        
        // Update Header Info
        const name = instructor.name || 'Unknown Instructor';
        document.getElementById('profileName').textContent = name;
        document.getElementById('initialsAvatar').textContent = getInitials(name);
        
        document.getElementById('profileId').textContent = `ID: ${instructor.id || 'N/A'}`;
        document.getElementById('profileEmail').textContent = instructor.email || 'N/A';
        
        // Update Academic Info
        // Note: 'title', 'office', 'officeHours' are usually not in simple JWT/DB schema 
        // unless updated, so we default efficiently.
        // We do NOT handle 'dob', 'gender', 'phone' as they are removed.
        
        document.getElementById('department').textContent = instructor.department || 'Not Specified';
        
        // Optional fields - check if elements exist before setting to avoid errors
        const optionalFields = ['office', 'officeHours'];
        optionalFields.forEach(field => {
            const el = document.getElementById(field);
            if (el) el.textContent = instructor[field] || 'Not Specified';
        });

    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profileName').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize common components
    initializePageHeader();
    initializeNotifications();
    await updateInstructorNameInHeader();
    
    // Load profile specific data
    await loadProfileData();
});