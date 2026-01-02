import { updateInstructorNameInHeader } from '../../utils/instructorAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

/**
 * Fetch dashboard data using the CONSOLIDATED endpoint
 * 
 * This makes ONE API call instead of multiple calls.
 * The server aggregates all data we need:
 * - profile
 * - stats (activeCourses, totalStudents, activeResitExams)
 * - courses (with student counts, resit exam status)
 * - resitExams (with registration counts)
 */
async function fetchInstructorData() {
    try {
        // ONE API call for everything!
        const response = await authenticatedFetch('/my/instructor/dashboard');
        
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error?.message || 'Dashboard fetch failed');
        }
        
        // Data is wrapped in 'data' field from ApiResponse
        const data = result.data;
        
        return {
            instructor: data.profile,
            courses: data.courses,
            stats: data.stats,
            resitExams: data.resitExams
        };
    } catch (error) {
        console.error('Error fetching instructor data:', error);
        return null;
    }
}

// Function to update quick stats (uses pre-computed stats from server)
function updateQuickStats(data) {
    if (!data) return;

    const { stats, courses } = data;

    // Use pre-computed stats from server
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.activeCourses;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.activeResitExams;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.totalStudents;
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = stats.resitRegistrations;
}

// Function to update recent activities (no API call needed - sample data)
function updateRecentActivities() {
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

// Function to update upcoming classes (uses pre-enriched course data)
function updateUpcomingClasses(data) {
    if (!data) return;

    const { courses } = data;
    const classList = document.querySelector('.class-list');

    if (courses.length > 0) {
        const upcomingClasses = courses.slice(0, 2).map((course, index) => ({
            name: course.name,
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

    // Fetch dashboard data with ONE consolidated API call
    const dashboardData = await fetchInstructorData();

    // Update all dashboard sections with the same data
    // All these functions are now SYNCHRONOUS - no additional API calls!
    updateQuickStats(dashboardData);
    updateRecentActivities();
    updateUpcomingClasses(dashboardData);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
