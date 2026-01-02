import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Check if student is logged in
checkStudentAuth();

// Function to calculate GPA
function calculateGPA(courses) {
    const gradePoints = {
        'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0,
        'F': 0.0
    };

    let totalPoints = 0;
    let totalCourses = 0;

    courses.forEach(course => {
        // Use resit grade if available and valid points, otherwise use original grade
        let letterToCheck = course.gradeLetter;
        
        // If there is a resit grade, it typically supersedes the course grade for GPA
        if (course.resitGradeLetter) {
             letterToCheck = course.resitGradeLetter;
        }

        if (letterToCheck && gradePoints[letterToCheck] !== undefined) {
            totalPoints += gradePoints[letterToCheck];
            totalCourses++;
        }
    });

    return totalCourses > 0 ? (totalPoints / totalCourses).toFixed(2) : 0;
}

// Function to get grade color
function getGradeColor(gradeLetter) {
    if (['A', 'A-'].includes(gradeLetter)) return '#10b981';
    if (['B+', 'B', 'B-'].includes(gradeLetter)) return '#3b82f6';
    if (['C+', 'C', 'C-'].includes(gradeLetter)) return '#f59e0b';
    if (['D+', 'D'].includes(gradeLetter)) return '#ef4444';
    return '#6b7280';
}

// Function to create grade card
function createGradeCard(course) {
    const card = document.createElement('div');
    card.className = 'grade-card';
    
    // Check if there's a resit grade
    const hasResitGrade = course.resitGrade !== null && course.resitGrade !== undefined;
    const courseGradeColor = getGradeColor(course.gradeLetter);
    const resitGradeColor = hasResitGrade ? getGradeColor(course.resitGradeLetter) : null;
    
    // Determine if grade improved
    const gradeImproved = hasResitGrade && course.resitGrade > course.grade;

    card.innerHTML = `
        <div class="grade-card-header">
            <div class="course-title">
                <h3>${course.courseName}</h3>
                <span class="course-id">${course.courseId}</span>
            </div>
            ${hasResitGrade ? `
                <span class="status-badge ${gradeImproved ? 'improved' : 'same'}">
                    <i class="fas ${gradeImproved ? 'fa-arrow-up' : 'fa-equals'}"></i>
                    ${gradeImproved ? 'Improved' : 'Resit Taken'}
                </span>
            ` : ''}
        </div>
        
        <div class="grades-list">
            <!-- Course Grade Row -->
            <div class="grade-row">
                <div class="grade-row-label">
                    <i class="fas fa-book"></i>
                    <span>Course Grade</span>
                </div>
                <div class="grade-row-value">
                    <span class="grade-score-text">${course.grade || '--'}</span>
                    <span class="grade-divider">-</span>
                    <span class="grade-letter-text" style="color: ${courseGradeColor};">${course.gradeLetter || 'N/A'}</span>
                </div>
            </div>
            
            ${hasResitGrade ? `
                <!-- Arrow/Divider -->
                <div class="grade-row-divider"></div>
                
                <!-- Resit Grade Row -->
                <div class="grade-row highlight">
                    <div class="grade-row-label">
                        <i class="fas fa-redo"></i>
                        <span>Resit Exam Grade</span>
                    </div>
                    <span class="final-tag">Final Grade</span>
                    <div class="grade-row-value">
                        <span class="grade-score-text">${course.resitGrade || '--'}</span>
                        <span class="grade-divider">-</span>
                        <span class="grade-letter-text" style="color: ${resitGradeColor};">${course.resitGradeLetter || 'N/A'}</span>
                    </div>
                </div>
            ` : `
                 <!-- No Resit Info -->
                 <div class="grade-row-divider"></div>
                 <div class="grade-status-row">
                    ${course.resit_exam ? `
                        <span class="status-text pending">
                            <i class="fas fa-hourglass-half"></i> Resit grade not announced
                        </span>
                    ` : `
                        <span class="status-text final">
                            <i class="fas fa-check-circle"></i> Final Grade
                        </span>
                    `}
                 </div>
            `}
        </div>
    `;

    return card;
}

// Function to load grades
async function loadGrades() {
    const gradesGrid = document.querySelector('.grades-grid');
    
    try {
        const studentId = getUserId();
        if (!studentId) {
            throw new Error('No student ID found');
        }
        
        gradesGrid.innerHTML = '<div class="loading">Loading grades...</div>';

        // Fetch student course details
        const response = await authenticatedFetch(`/student/${studentId}/course-details`);
        if (!response.ok) {
            throw new Error('Failed to fetch grades');
        }
        const courseDetails = await response.json();

        // Fetch course names
        const coursesWithNames = await Promise.all(
            courseDetails.map(async (detail) => {
                try {
                    const courseResponse = await authenticatedFetch(`/course/${detail.courseId}`);
                    if (courseResponse.ok) {
                        const courseData = await courseResponse.json();
                        return {
                            ...detail,
                            courseName: courseData.course?.name || detail.courseId,
                            breakdown: [
                                { name: 'Midterm', score: Math.floor(detail.grade * 0.3), total: 30, weight: 30 },
                                { name: 'Final', score: Math.floor(detail.grade * 0.4), total: 40, weight: 40 },
                                { name: 'Assignments', score: Math.floor(detail.grade * 0.2), total: 20, weight: 20 },
                                { name: 'Participation', score: Math.floor(detail.grade * 0.1), total: 10, weight: 10 }
                            ]
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching course ${detail.courseId}:`, error);
                }
                return { ...detail, courseName: detail.courseId };
            })
        );

        // Use all courses
        const coursesToDisplay = coursesWithNames;

        // Display grades
        gradesGrid.innerHTML = '';
        if (coursesToDisplay.length === 0) {
            gradesGrid.innerHTML = `
                <div class="no-grades">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No grades available</h3>
                    <p>Grades will appear here once posted by your instructors</p>
                </div>
            `;
            return;
        }

        coursesToDisplay.forEach(course => {
            const card = createGradeCard(course);
            gradesGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading grades:', error);
        document.querySelector('.grades-grid').innerHTML = `
            <div class="error">Error loading grades. Please try again later.</div>
        `;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Update student name in header
    await updateStudentNameInHeader();
    
    loadGrades();

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const gradeCards = document.querySelectorAll('.grade-card');
            
            gradeCards.forEach(card => {
                const courseName = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const courseCode = card.querySelector('.course-code')?.textContent?.toLowerCase() || '';
                
                if (courseName.includes(searchTerm) || courseCode.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
