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
        if (course.gradeLetter && gradePoints[course.gradeLetter] !== undefined) {
            totalPoints += gradePoints[course.gradeLetter];
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
    
    const gradeColor = getGradeColor(course.gradeLetter);

    card.innerHTML = `
        <div class="grade-header">
            <div class="course-info">
                <h3>${course.courseName}</h3>
                <p class="course-code">${course.courseId}</p>
            </div>
            <div class="grade-display" style="background: ${gradeColor}20; border-color: ${gradeColor};">
                <div class="grade-letter" style="color: ${gradeColor};">${course.gradeLetter || 'N/A'}</div>
                <div class="grade-number">${course.grade || '--'}/100</div>
            </div>
        </div>
        
        <div class="grade-breakdown">
            <h4>Grade Breakdown</h4>
            <div class="breakdown-items">
                ${course.breakdown ? course.breakdown.map(item => `
                    <div class="breakdown-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-score">${item.score}/${item.total}</span>
                        <span class="item-weight">(${item.weight}%)</span>
                    </div>
                `).join('') : '<p class="no-breakdown">No breakdown available</p>'}
            </div>
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
        const response = await authenticatedFetch(`/student/c-details/${studentId}`);
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

        // Filter courses with grades
        const coursesWithGrades = coursesWithNames.filter(c => c.grade);

        // Display grades
        gradesGrid.innerHTML = '';
        if (coursesWithGrades.length === 0) {
            gradesGrid.innerHTML = `
                <div class="no-grades">
                    <i class="fas fa-graduation-cap"></i>
                    <h3>No grades available</h3>
                    <p>Grades will appear here once posted by your instructors</p>
                </div>
            `;
            return;
        }

        coursesWithGrades.forEach(course => {
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
