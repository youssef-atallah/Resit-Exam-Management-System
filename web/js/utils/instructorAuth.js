// Instructor authentication and data utilities

export function checkInstructorAuth() {
    const instructorId = localStorage.getItem('instructorId');
    if (!instructorId) {
        window.location.href = '../../index.html';
        return false;
    }
    return true;
}

export async function getLoggedInInstructorData() {
    const instructorId = localStorage.getItem('instructorId') || '12345611';
    
    try {
        const response = await fetch(`http://localhost:3000/instructor/${instructorId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch instructor data');
        }
        const instructorData = await response.json();
        return instructorData;
    } catch (error) {
        console.error('Error fetching instructor data:', error);
        return { id: instructorId, name: 'Instructor', email: 'instructor@example.com' };
    }
}

export async function updateInstructorNameInHeader() {
    try {
        const instructorData = await getLoggedInInstructorData();
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement && instructorData.name) {
            userNameElement.textContent = instructorData.name;
        }
    } catch (error) {
        console.error('Error updating instructor name:', error);
    }
}
