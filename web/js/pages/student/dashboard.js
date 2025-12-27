import { checkStudentAuth, getLoggedInStudentData } from '../../../js/utils/studentAuth.js';

// Check if student is logged in
checkStudentAuth();

// Function to fetch student dashboard data
async function fetchDashboardData() {
    try {
        const studentData = await getLoggedInStudentData();
        
        // Fetch student details
        const studentResponse = await fetch(`http://localhost:3000/student/${studentData.id}`);
        if (!studentResponse.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentDetails = await studentResponse.json();

        // Fetch student course details
        const courseDetailsResponse = await fetch(`http://localhost:3000/student/c-details/${studentData.id}`);
        if (!courseDetailsResponse.ok) {
            throw new Error('Failed to fetch course details');
        }
        const courseDetails = await courseDetailsResponse.json();

        return {
            student: studentDetails,
            courseDetails: courseDetails
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
}

// Function to calculate GPA
function calculateGPA(courseDetails) {
    if (!courseDetails || courseDetails.length === 0) return 0;
    
    const gradePoints = {
        'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0,
        'F': 0.0
    };

    let totalPoints = 0;
    let totalCourses = 0;

    courseDetails.forEach(course => {
        if (course.gradeLetter && gradePoints[course.gradeLetter] !== undefined) {
            totalPoints += gradePoints[course.gradeLetter];
            totalCourses++;
        }
    });

    return totalCourses > 0 ? (totalPoints / totalCourses).toFixed(2) : 0;
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

    // Calculate and display GPA
    const gpa = calculateGPA(courseDetails);
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = gpa;
}

// Function to update upcoming events
async function updateUpcomingEvents() {
    const data = await fetchDashboardData();
    if (!data) return;

    const { student } = data;
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';

    // Fetch resit exam details for upcoming events
    if (student.resitExams && student.resitExams.length > 0) {
        for (const resitId of student.resitExams.slice(0, 2)) {
            try {
                const response = await fetch(`http://localhost:3000/r-exam/${resitId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.resitExam) {
                        const exam = data.resitExam;
                        const examDate = new Date(parseInt(exam.examDate));
                        
                        const eventItem = document.createElement('div');
                        eventItem.className = 'event-item';
                        eventItem.innerHTML = `
                            <div class="event-date">
                                <span class="day">${examDate.getDate()}</span>
                                <span class="month">${examDate.toLocaleString('en-US', { month: 'short' })}</span>
                            </div>
                            <div class="event-details">
                                <h3>${exam.name} - Resit Exam</h3>
                                <p>${exam.location || 'Location TBA'}, ${examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        `;
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
            <div class="event-item">
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

// Function to update recent grades
async function updateRecentGrades() {
    const data = await fetchDashboardData();
    if (!data) return;

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
                const courseResponse = await fetch(`http://localhost:3000/course/${course.courseId}`);
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

// Function to update course progress
async function updateCourseProgress() {
    const data = await fetchDashboardData();
    if (!data) return;

    const { student, courseDetails } = data;
    const progressList = document.querySelector('.progress-list');
    progressList.innerHTML = '';

    // Get first 2 courses
    const courses = student.courses?.slice(0, 2) || [];

    if (courses.length > 0) {
        for (const courseId of courses) {
            try {
                const courseResponse = await fetch(`http://localhost:3000/course/${courseId}`);
                if (courseResponse.ok) {
                    const courseData = await courseResponse.json();
                    const courseName = courseData.course?.name || courseId;
                    
                    // Get course detail for progress
                    const detail = courseDetails.find(d => d.courseId === courseId);
                    const progress = detail?.progress || 75;

                    const progressItem = document.createElement('div');
                    progressItem.className = 'progress-item';
                    progressItem.innerHTML = `
                        <div class="course-info">
                            <h3>${courseName}</h3>
                            <p>${progress}% Complete</p>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress}%"></div>
                        </div>
                    `;
                    progressList.appendChild(progressItem);
                }
            } catch (error) {
                console.error(`Error fetching course ${courseId}:`, error);
            }
        }
    } else {
        progressList.innerHTML = `
            <div class="progress-item">
                <div class="course-info">
                    <h3>No courses enrolled</h3>
                    <p>Course progress will appear here</p>
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
        updateRecentGrades(),
        updateCourseProgress()
    ]);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
});
