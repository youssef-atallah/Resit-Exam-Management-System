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

    // Initialize header functionality
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
    }

    // Close notification dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationDropdown && !e.target.closest('.notifications')) {
            notificationDropdown.classList.remove('show');
        }
    });

    // Handle mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.add('read');
            });
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }

    // Toggle user menu
    const userInfo = document.querySelector('.user-info');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (userInfo && dropdownMenu) {
        userInfo.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdownMenu && !e.target.closest('.user-menu')) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                localStorage.removeItem('instructorId');
                localStorage.removeItem('instructorName');
                sessionStorage.clear();
                window.location.href = '../../index.html';
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Error during logout', 'error');
            }
        });
    }
}); 