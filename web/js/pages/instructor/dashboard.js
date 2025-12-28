import { updateInstructorNameInHeader } from '../../utils/instructorAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Function to fetch instructor dashboard data
async function fetchInstructorData() {
    try {
        const instructorId = getUserId();
        if (!instructorId) {
            throw new Error('No instructor ID found');
        }
        
        // Fetch instructor details
        const instructorResponse = await authenticatedFetch(`/instructor/${instructorId}`);
        if (!instructorResponse.ok) {
            throw new Error('Failed to fetch instructor details');
        }
        const instructor = await instructorResponse.json();

        // Fetch course details
        const coursesResponse = await authenticatedFetch(`/instructor/cdetails/${instructorId}`);
        if (!coursesResponse.ok) {
            throw new Error('Failed to fetch courses');
        }
        const courses = await coursesResponse.json();

        return { instructor, courses };
    } catch (error) {
        console.error('Error fetching instructor data:', error);
        return null;
    }
}

// Function to update quick stats
async function updateQuickStats() {
    const data = await fetchInstructorData();
    if (!data) return;

    const { courses } = data;

    // Update active courses count
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = courses.length;

    // Count courses with resit exams
    const coursesWithResit = courses.filter(c => c.resit_exam).length;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = coursesWithResit;

    // Total students across all courses
    const totalStudents = courses.reduce((sum, course) => sum + (course.student_count || 0), 0);
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = totalStudents;

    // Count total resit registrations
    const totalResitRegistrations = courses.reduce((sum, course) => {
        return sum + (course.resit_exam?.registered_students?.length || 0);
    }, 0);
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = totalResitRegistrations;
}

// Function to update recent activities
async function updateRecentActivities() {
    const activityList = document.querySelector('.activity-list');
    
    // Sample activities (would come from API in real implementation)
    const activities = [
        {
            icon: 'fa-file-alt',
            text: 'New assignment submission in Database Systems',
            time: '1 hour ago'
        },
        {
            icon: 'fa-user',
            text: 'New student registered for Web Programming',
            time: '2 hours ago'
        }
    ];

    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Function to update upcoming classes
async function updateUpcomingClasses() {
    const data = await fetchInstructorData();
    if (!data) return;

    const { courses } = data;
    const classList = document.querySelector('.class-list');

    if (courses.length > 0) {
        const upcomingClasses = courses.slice(0, 2).map((course, index) => ({
            name: course.courseName,
            location: 'Room ' + (101 + index * 100),
            time: index === 0 ? '10:00 AM' : '2:00 PM',
            status: index === 0 ? 'Today' : 'Tomorrow'
        }));

        classList.innerHTML = upcomingClasses.map(class_ => `
            <div class="class-item">
                <div class="class-info">
                    <h3>${class_.name}</h3>
                    <p>${class_.location}, ${class_.time}</p>
                </div>
                <div class="class-status">
                    <span class="status-badge">${class_.status}</span>
                </div>
            </div>
        `).join('');
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Update instructor name in header
    await updateInstructorNameInHeader();

    // Update all dashboard sections
    await Promise.all([
        updateQuickStats(),
        updateRecentActivities(),
        updateUpcomingClasses()
    ]);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
