// Function to fetch courses data
async function fetchCourses() {
    try {
        console.log('Fetching courses...');
        // Get instructor ID from localStorage or use a default for testing
        const instructorId = localStorage.getItem('instructorId') || '12345611';
        const response = await fetch(`http://localhost:3000/instructor/c-details/${instructorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const courses = await response.json();
        console.log('Fetched courses:', courses);

        if (!courses || courses.length === 0) {
            throw new Error('No courses found');
        }

        return courses;
    } catch (error) {
        console.error('Error in fetchCourses:', error);
        const coursesGrid = document.querySelector('.courses-grid');
        if (coursesGrid) {
            coursesGrid.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
        return [];
    }
}

// Function to create a course card element
function createCourseCard(course) {
    console.log('Creating card for course:', course);
    const card = document.createElement('div');
    card.className = 'course-card';

    // Format the date
    let formattedDate = 'N/A';
    try {
        const createdDate = new Date(course.created_at);
        formattedDate = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
    }

    card.innerHTML = `
        <div class="course-header">
            <h3>${course.courseName || 'Unnamed Course'}</h3>
        </div>
        <div class="course-info">
            <div class="info-row">
                <div class="info-item">
                    <i class="fas fa-building"></i>
                    <span>${course.department || 'No Department'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <span>${course.student_count || 0} Students</span>
                </div>
            </div>
            <div class="info-row">
                <div class="info-item">
                    <i class="fas fa-hashtag"></i>
                    <span> ${course.courseId || 'No ID'}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-redo"></i>
                    <span>${course.resit_exam ? 'Has Resit' : 'No Resit'}</span>
                </div>
            </div>
        </div>
        <div class="course-actions">
            ${course.resit_exam ? 
                `<button class="action-btn view-resit" onclick="window.location.href='http://localhost:3000/pages/instructor/resit.html'">
                    <i class="fas fa-eye"></i>
                    <span>View Resit</span>
                </button>` :
                `<button class="action-btn create-resit" onclick="createResitExam('${course.courseId}', '${course.courseName}', '${course.instructor_id}')">
                    <i class="fas fa-plus"></i>
                    <span>Create Resit</span>
                </button>`
            }
        </div>
    `;

    return card;
}

// Function to populate courses grid
async function populateCourses() {
    const coursesGrid = document.querySelector('.courses-grid');
    if (!coursesGrid) {
        console.error('Courses grid element not found');
        return;
    }

    // Show loading state
    coursesGrid.innerHTML = '<div class="loading">Loading courses...</div>';

    try {
        // Fetch and display courses
        const courses = await fetchCourses();
        console.log('Fetched courses:', courses);
        
        // Clear loading state
        coursesGrid.innerHTML = '';

        if (!courses || courses.length === 0) {
            console.log('No courses found');
            coursesGrid.innerHTML = '<div class="no-courses">No courses found</div>';
            return;
        }

        courses.forEach(course => {
            const card = createCourseCard(course);
            coursesGrid.appendChild(card);
        });

        // Since we don't have year levels in the API response,
        // we'll hide the year level filter
        const yearLevelFilter = document.getElementById('yearLevelFilter');
        if (yearLevelFilter) {
            yearLevelFilter.parentElement.style.display = ''; // Show the year level filter | 'none' to hide it
        }
    } catch (error) {
        console.error('Error populating courses:', error);
        coursesGrid.innerHTML = `<div class="error">Error loading courses: ${error.message}</div>`;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing courses...');
    // Initialize courses
    await populateCourses();
}); 