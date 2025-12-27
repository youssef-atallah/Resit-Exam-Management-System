// Student authentication and data utilities

export function checkStudentAuth() {
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

export async function getLoggedInStudentData() {
    const studentId = localStorage.getItem('studentId') || '12345678';
    
    try {
        const response = await fetch(`http://localhost:3000/student/${studentId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        const studentData = await response.json();
        return studentData;
    } catch (error) {
        console.error('Error fetching student data:', error);
        return { id: studentId, name: 'Student', email: 'student@example.com' };
    }
}

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

export function handleStudentLogout() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    sessionStorage.clear();
    window.location.href = '../../index.html';
}