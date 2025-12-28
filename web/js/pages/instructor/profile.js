// Function to fetch instructor data
async function fetchInstructorProfile() {
    try {
        const instructorId = localStorage.getItem('instructorId');
        if (!instructorId) {
            showNotification('Please log in to view your profile', 'error');
            window.location.href = '../../index.html';
            return;
        }

        const response = await fetch(`http://localhost:3000/instructor/${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch instructor data');
        }

        const instructorData = await response.json();
        updateProfileUI(instructorData);
    } catch (error) {
        console.error('Error fetching instructor profile:', error);
        showNotification(error.message, 'error');
    }
}

// Function to update the UI with instructor data
function updateProfileUI(data) {
    // Update header name
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = data.name;
    });

    // Update profile section
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileId').textContent = `Instructor ID: ${data.id}`;
    document.getElementById('profileEmail').textContent = data.email;

    // Update personal information
    document.getElementById('fullName').textContent = data.name;
    document.getElementById('dob').textContent = data.dateOfBirth || 'No information';
    document.getElementById('gender').textContent = data.gender || 'No information';
    document.getElementById('nationality').textContent = data.nationality || 'No information';

    // Update academic information
    document.getElementById('department').textContent = data.department || 'No information';
    document.getElementById('title').textContent = data.title || 'No information';
    document.getElementById('office').textContent = data.office || 'No information';
    document.getElementById('officeHours').textContent = data.officeHours || 'No information';

    // Update contact information
    document.getElementById('email').textContent = data.email || 'No information';
    document.getElementById('phone').textContent = data.phone || 'No information';
    document.getElementById('extension').textContent = data.extension || 'No information';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Fetch instructor profile data
    fetchInstructorProfile();

    // Note: Header functionality (notifications, user menu, logout) is handled by header.js utility
});
 