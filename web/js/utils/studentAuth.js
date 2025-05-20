// Check if student is logged in
function isStudentLoggedIn() {
    return localStorage.getItem('studentId') !== null;
}

// Get logged in student data
async function getLoggedInStudentData() {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        throw new Error('No student logged in');
    }

    try {
        const response = await fetch(`http://localhost:3000/student/${studentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching student data:', error);
        throw error;
    }
}

// Update UI with student data
function updateUIWithStudentData(studentData) {
    // Update user name in header
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = studentData.name;
    });

    // Update profile name if exists
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = studentData.name;
    }

    // Update profile ID if exists
    const profileId = document.getElementById('profileId');
    if (profileId) {
        profileId.textContent = `Student ID: ${studentData.id}`;
    }

    // Update profile email if exists
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = studentData.email;
    }

    // Update full name if exists
    const fullName = document.getElementById('fullName');
    if (fullName) {
        fullName.textContent = studentData.name;
    }
}

// Check authentication and redirect if not logged in
function checkStudentAuth() {
    if (!isStudentLoggedIn()) {
        window.location.href = '../../index.html';
    }
}

// Handle logout
function handleStudentLogout() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentName');
    window.location.href = '../../index.html';
}

export {
    isStudentLoggedIn,
    getLoggedInStudentData,
    updateUIWithStudentData,
    checkStudentAuth,
    handleStudentLogout
}; 