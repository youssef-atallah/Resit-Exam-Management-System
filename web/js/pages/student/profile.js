import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Check auth immediately
checkStudentAuth();

async function loadProfileData() {
    try {
        // 1. Get basic profile data from /my/profile (via getLoggedInStudentData helper)
        const student = await getLoggedInStudentData();
        
        // Update Header Info
        document.getElementById('profileName').textContent = student.name;
        document.getElementById('profileEmail').textContent = student.email;
        document.getElementById('profileId').textContent = `ID: ${student.id}`;
        document.getElementById('profileDept').textContent = student.department || 'Department N/A';
        
        // Generate Initials Avatar
        // Generate Initials Avatar
        const getInitials = (name) => {
            if (!name) return '??';
            const parts = name.split(' ').filter(part => part.length > 0);
            if (parts.length === 0) return '??';
            if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        };
        const initials = getInitials(student.name);
        document.getElementById('profileInitials').textContent = initials;

        // 2. Fetch Course & Resit Stats from /my/course-details and /my/resit-exams
        // We need to fetch these to show "Active Courses" and "Resit Exams" counts
        // Since getLoggedInStudentData doesn't return arrays by default unless using specific endpoint? 
        // Wait, getLoggedInStudentData calls /my/profile. 
        // /my/profile endpoint usually returns student object. 
        // Let's verify if it returns courses/resitExams arrays.
        // If not, we might need to fetch /my/courses or use existing dashboard logic.
        
        // Let's fetch dashboard-like data to get counts
        const studentId = getUserId();
        const statsResponse = await authenticatedFetch(`/student/c-details/${studentId}`);
        
        if (statsResponse.ok) {
            // The API returns the array directly properly
            const courseDetailsRaw = await statsResponse.json();
            // Handle both array directly (if API changed) or property
            const courseDetails = Array.isArray(courseDetailsRaw) ? courseDetailsRaw : (courseDetailsRaw.courseDetails || []);
            
            // Calculate Active Courses (courses without final grade or with failing grade? 
            // Usually "Active" means currently enrolled.
            // For this system, let's count all enrolled courses
            const activeCourses = courseDetails.length;
            document.getElementById('activeCoursesCount').textContent = activeCourses;

            // Year Level - Handle potential snake_case from DB
            const year = student.yearLevel || student.year_level;
            document.getElementById('yearLevel').textContent = year ? `Year ${year}` : 'N/A';
        } else {
            console.error('Failed to fetch course stats');
            document.getElementById('activeCoursesCount').textContent = '-';
        }

        // Fetch Resit Exams count
        const resitResponse = await authenticatedFetch(`/student/resitexams/${studentId}`);
        if (resitResponse.ok) {
            const resitData = await resitResponse.json();
            const resitExams = resitData.resitExams || [];
            // "Completed" might mean attended? Or just total count? 
            // Let's show "Total Assinged Resits"
            document.getElementById('resitCount').textContent = resitExams.length; 
            // If user wants "Completed", we'd need to check status. 
            // For now, total count is safer.
        } else {
             document.getElementById('resitCount').textContent = '-';
        }

    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profileName').textContent = 'Error loading profile';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await updateStudentNameInHeader();
    await loadProfileData();
});
