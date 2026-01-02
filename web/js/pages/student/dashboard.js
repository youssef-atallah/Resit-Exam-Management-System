import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Check if student is logged in
checkStudentAuth();

/**
 * Fetch dashboard data using the CONSOLIDATED endpoint
 * 
 * This makes ONE API call instead of multiple calls.
 * The server aggregates all data we need:
 * - profile
 * - stats (activeCourses, resitExams, gradedCourses)
 * - courses (with names, grades already resolved)
 * - upcomingResitExams (with full details)
 */
async function fetchDashboardData() {
    try {
        // ONE API call for everything!
        const response = await authenticatedFetch('/my/dashboard');
        
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error?.message || 'Dashboard fetch failed');
        }
        
        // Data is wrapped in 'data' field from ApiResponse
        const data = result.data;
        
        // Return in the format our existing functions expect
        return {
            student: {
                id: data.profile.id,
                name: data.profile.name,
                email: data.profile.email,
                courses: data.courses.map((c) => c.courseId),
                resitExams: data.upcomingResitExams.map((e) => e.id)
            },
            courseDetails: data.courses,
            stats: data.stats,
            upcomingResitExams: data.upcomingResitExams
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}


// Function to update quick stats (receives data, no API call)
function updateQuickStats(data) {
    if (!data) return;

    const { student, courseDetails } = data;

    // Update active courses count
    const activeCourses = student.courses?.length || 0;
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = activeCourses;

    // Count resit exams
    const resitExams = student.resitExams?.length || 0;
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = resitExams;

    // Count courses with grades
    const gradedCourses = courseDetails.filter(c => c.grade).length;
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = gradedCourses;
}

// Function to update upcoming events (uses pre-enriched data - NO additional API calls!)
function updateUpcomingEvents(data) {
    if (!data) {
        document.querySelector('.event-list').innerHTML = `
            <div class="error-state" style="text-align: center; color: var(--error-color); padding: 1rem;">
                <i class="fas fa-exclamation-circle"></i> Error loading events
            </div>
        `;
        return;
    }

    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';

    // Use pre-enriched resit exam data from consolidated endpoint
    // No need for additional API calls - data is already complete!
    const upcomingResitExams = data.upcomingResitExams || [];
    
    for (const exam of upcomingResitExams.slice(0, 2)) {
        let day = '--';
        let month = '---';
        let timeString = 'Time TBA';
        
        if (exam.examDate) {
            const dateVal = new Date(exam.examDate);
            if (!isNaN(dateVal.getTime())) {
                day = dateVal.getDate();
                month = dateVal.toLocaleString('en-US', { month: 'short' });
                timeString = dateVal.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            }
        }

        // Clean up name
        const nameBase = (exam.name || '').replace(/ - Resit Exam$/i, '');
        const finalTitle = `${nameBase} - Resit Exam`;
        
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="event-details">
                <h3>${finalTitle}</h3>
                <p>${timeString}</p>
            </div>
        `;
        
        // Add click handler for modal
        eventItem.addEventListener('click', () => {
            const eventFullDate = exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'Date TBA';
            openEventModal({
                title: finalTitle,
                date: `${day} ${month}`,
                time: timeString,
                location: exam.location || 'Location TBA',
                description: exam.announcement || 'No additional details provided.',
                fullDate: eventFullDate
            });
        });

        eventList.appendChild(eventItem);
    }


    // If no events, show placeholder
    if (eventList.children.length === 0) {
        eventList.innerHTML = `
            <div class="event-item" style="cursor: default;">
                <div class="event-date">
                    <span class="day">--</span>
                    <span class="month">---</span>
                </div>
                <div class="event-details">
                    <h3>No upcoming events</h3>
                    <p>Check back later for updates</p>
                </div>
            </div>
        `;
    }
}

// Modal functions
function openEventModal(details) {
    const modal = document.getElementById('eventModal');
    const title = document.getElementById('modalTitle');
    const dateBadge = document.getElementById('modalDate');
    const location = document.getElementById('modalLocation');
    const time = document.getElementById('modalTime');
    const description = document.getElementById('modalDescription');

    title.textContent = details.title;
    dateBadge.textContent = details.fullDate;
    location.textContent = details.location;
    time.textContent = details.time;
    description.textContent = details.description;

    modal.style.display = 'block';

    // Close handler
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    // Click outside to close
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
}

// Function to update recent grades (uses pre-enriched data - NO additional API calls!)
function updateRecentGrades(data) {
    if (!data) {
        document.querySelector('.grade-list').innerHTML = `
            <div class="error-state" style="text-align: center; color: var(--error-color); padding: 1rem;">
                <i class="fas fa-exclamation-circle"></i> Error loading grades
            </div>
        `;
        return;
    }

    const { courseDetails } = data;
    const gradeList = document.querySelector('.grade-list');
    gradeList.innerHTML = '';

    // Get courses with grades - courseName is already enriched!
    const coursesWithGrades = courseDetails.filter(course => course.grade || course.gradeLetter);
    const recentGrades = coursesWithGrades.slice(0, 2);

    if (recentGrades.length > 0) {
        // No API calls needed - courseName is already in the data
        recentGrades.forEach((course) => {
            const gradeItem = document.createElement('div');
            gradeItem.className = 'grade-item';
            gradeItem.innerHTML = `
                <div class="course-info">
                    <h3>${course.courseName || course.courseId}</h3>
                    <p>Final Grade</p>
                </div>
                <div class="grade">${course.gradeLetter || course.grade}</div>
            `;
            gradeList.appendChild(gradeItem);
        });
    } else {
        gradeList.innerHTML = `
            <div class="grade-item">
                <div class="course-info">
                    <h3>No grades available</h3>
                    <p>Grades will appear here once posted</p>
                </div>
            </div>
        `;
    }
}



// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Update student name in header
    await updateStudentNameInHeader();

    // Fetch dashboard data with ONE consolidated API call
    const dashboardData = await fetchDashboardData();

    // Update all dashboard sections with the same data
    // All these functions are now SYNCHRONOUS - no additional API calls!
    updateQuickStats(dashboardData);
    updateUpcomingEvents(dashboardData);
    updateRecentGrades(dashboardData);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
