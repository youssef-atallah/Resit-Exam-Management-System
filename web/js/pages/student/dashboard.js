import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Check if student is logged in
checkStudentAuth();

// Function to fetch student dashboard data
async function fetchDashboardData() {
    try {
        // Get student ID from cached user data
        const studentId = getUserId();
        
        if (!studentId) {
            throw new Error('No student ID found');
        }
        
        // Fetch student details with auth
        const studentResponse = await authenticatedFetch(`/student/${studentId}`);
        if (!studentResponse.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentDetails = await studentResponse.json();

        // Fetch student course details with auth
        const courseDetailsResponse = await authenticatedFetch(`/student/c-details/${studentId}`);
        if (!courseDetailsResponse.ok) {
            throw new Error('Failed to fetch course details');
        }
        const courseDetails = await courseDetailsResponse.json();

        return {
            student: studentDetails.student || studentDetails,
            courseDetails: courseDetails.courses || courseDetails
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

// Function to update quick stats
async function updateQuickStats() {
    const data = await fetchDashboardData();
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

// Function to update upcoming events
async function updateUpcomingEvents() {
    const data = await fetchDashboardData();
    if (!data) {
        document.querySelector('.event-list').innerHTML = `
            <div class="error-state" style="text-align: center; color: var(--error-color); padding: 1rem;">
                <i class="fas fa-exclamation-circle"></i> Error loading events
            </div>
        `;
        return;
    }

    const { student } = data;
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';

    // Fetch resit exam details for upcoming events
    if (student.resitExams && student.resitExams.length > 0) {
        for (const resitId of student.resitExams.slice(0, 2)) {
            try {
                const response = await authenticatedFetch(`/r-exam/${resitId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.resitExam) {
                        const exam = data.resitExam;
                        
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

                        // Clean up name: Remove redundant " - Resit Exam" if present to avoid duplication
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
                }
            } catch (error) {
                console.error(`Error fetching resit exam ${resitId}:`, error);
            }
        }
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

// Function to update recent grades
async function updateRecentGrades() {
    const data = await fetchDashboardData();
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

    // Get courses with grades and sort by most recent
    const coursesWithGrades = courseDetails.filter(course => course.grade);
    const recentGrades = coursesWithGrades.slice(0, 2);

    if (recentGrades.length > 0) {
        for (const course of recentGrades) {
            try {
                // Fetch course name
                const courseResponse = await authenticatedFetch(`/course/${course.courseId}`);
                if (courseResponse.ok) {
                    const courseData = await courseResponse.json();
                    const courseName = courseData.course?.name || course.courseId;

                    const gradeItem = document.createElement('div');
                    gradeItem.className = 'grade-item';
                    gradeItem.innerHTML = `
                        <div class="course-info">
                            <h3>${courseName}</h3>
                            <p>Final Grade</p>
                        </div>
                        <div class="grade">${course.grade}</div>
                    `;
                    gradeList.appendChild(gradeItem);
                }
            } catch (error) {
                console.error(`Error fetching course ${course.courseId}:`, error);
            }
        }
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

    // Update all dashboard sections
    await Promise.all([
        updateQuickStats(),
        updateUpcomingEvents(),
        updateRecentGrades()
    ]);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
