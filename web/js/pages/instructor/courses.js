import { updateInstructorNameInHeader } from '../../utils/instructorAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Function to fetch courses data
async function fetchCourses() {
    try {
        console.log('Fetching courses...');
        const instructorId = getUserId();
        if (!instructorId) {
            throw new Error('No instructor ID found');
        }
        const response = await authenticatedFetch(`/instructor/cdetails/${instructorId}`, {
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
                `<div class="resit-actions">
                    <button class="action-btn view-resit" onclick="window.location.href='http://localhost:3000/pages/instructor/resit.html'">
                        <i class="fas fa-eye"></i>
                        <span>View Resit</span>
                    </button>
                    <button class="action-btn cancel-resit" onclick="confirmAndCancelResit('${course.courseId}-rId')">
                        <i class="fas fa-times"></i>
                        <span>Delete Resit</span>
                    </button>
                    <button class="action-btn announce-resit" onclick="showAnnounceModal('${course.courseId}')">
                        <i class="fas fa-bullhorn"></i>
                        <span>Announce</span>
                    </button>
                </div>` :
                `<button class="action-btn create-resit" onclick="createResitExam('${course.courseId}', '${course.courseName}', '${course.instructor_id}')">
                    <i class="fas fa-plus"></i>
                    <span>Create Resit</span>
                </button>`
            }
        </div>
    `;

    return card;
}

// Function to confirm and cancel resit exam
async function confirmAndCancelResit(resitExamId) {
    showConfirmationModal('Cancel Resit Exam', 
        'Are you sure you want to cancel this resit exam? This action cannot be undone.',
        async () => {
            try {
                const instructorId = getUserId();
                const response = await authenticatedFetch(`/instructor/r-exam/${instructorId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        resitExamId: resitExamId
                    })
                });

                if (response.ok) {
                    showSuccessModal('Resit exam cancelled successfully');
                    // Refresh the courses to update the UI
                    await populateCourses();
                } else {
                    const errorData = await response.text();
                    showErrorModal(`Failed to cancel resit exam: ${errorData}`);
                }
            } catch (error) {
                console.error('Error cancelling resit exam:', error);
                showErrorModal('An error occurred while cancelling the resit exam. Please try again later.');
            }
        }
    );
}

// Function to show confirmation modal
function showConfirmationModal(title, message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-icon warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary cancel-btn">Cancel</button>
                <button class="btn btn-danger confirm-btn">Yes, Cancel Resit</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.confirm-btn').addEventListener('click', () => {
        closeModal();
        onConfirm();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Function to show success modal
function showSuccessModal(message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-body">
                <div class="modal-icon success">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-success close-btn">OK</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Function to show error modal
function showErrorModal(message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-body">
                <div class="modal-icon error">
                    <i class="fas fa-times-circle"></i>
                </div>
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger close-btn">OK</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Add styles for the modals
const style = document.createElement('style');
style.textContent = `
    .custom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    /* Course card styles */
    .course-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        width: 100%;
        min-width: 380px;
        max-width: 480px;
        margin: 1rem;
    }

    .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .courses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: 2rem;
        padding: 2rem;
        justify-items: center;
    }

    /* Resit actions styles */
    .resit-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
        padding: 0.75rem 0;
        flex-wrap: nowrap;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        flex: 1;
        min-width: 110px;
        justify-content: center;
        white-space: nowrap;
    }

    .action-btn i {
        font-size: 1rem;
    }

    .action-btn.view-resit {
        background-color: #17a2b8;
        color: white;
    }

    .action-btn.view-resit:hover {
        background-color: #138496;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .action-btn.cancel-resit {
        background-color: #dc3545;
        color: white;
    }

    .action-btn.cancel-resit:hover {
        background-color: #c82333;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .action-btn.announce-resit {
        background-color: #ffc107;
        color: #000;
    }

    .action-btn.announce-resit:hover {
        background-color: #e0a800;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .action-btn.create-resit {
        background-color: #28a745;
        color: white;
        width: 100%;
    }

    .action-btn.create-resit:hover {
        background-color: #218838;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .custom-modal.show {
        opacity: 1;
        visibility: visible;
    }

    .modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 400px;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h3 {
        margin: 0;
        color: #333;
    }

    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
    }

    .modal-body {
        padding: 1.5rem;
        text-align: center;
    }

    .modal-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .modal-icon.warning {
        color: #ffc107;
    }

    .modal-icon.success {
        color: #28a745;
    }

    .modal-icon.error {
        color: #dc3545;
    }

    .modal-body p {
        margin: 0;
        color: #333;
        font-size: 1.1rem;
        line-height: 1.5;
    }

    .modal-footer {
        padding: 1rem;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease;
    }

    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }

    .btn-secondary:hover {
        background-color: #5a6268;
    }

    .btn-danger {
        background-color: #dc3545;
        color: white;
    }

    .btn-danger:hover {
        background-color: #c82333;
    }

    .btn-success {
        background-color: #28a745;
        color: white;
    }

    .btn-success:hover {
        background-color: #218838;
    }
`;
document.head.appendChild(style);

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

// Function to fetch instructor details
async function fetchInstructorDetails(instructorId) {
    try {
        const response = await authenticatedFetch(`/instructor/${instructorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch instructor details: ${response.status}`);
        }

        const instructor = await response.json();
        return instructor;
    } catch (error) {
        console.error('Error fetching instructor details:', error);
        return null;
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing courses...');
    
    // Fetch and display instructor name
    const instructorId = localStorage.getItem('instructorId') || '12345611';
    const instructor = await fetchInstructorDetails(instructorId);
    
    if (instructor && instructor.name) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = instructor.name;
        });
        // Store the name in localStorage for other pages
        localStorage.setItem('instructorName', instructor.name);
    }
    
    // Initialize courses
    await populateCourses();
});

// Add showAnnounceModal function
window.showAnnounceModal = function(courseId) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Send Announcement</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-icon" style="color: #17a2b8;">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <textarea id="announcementMsg" rows="4" style="width: 100%; border-radius: 6px; padding: 0.5rem; border: 1px solid #ccc; resize: vertical;" placeholder="Enter your announcement message..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary cancel-btn">Cancel</button>
                <button class="btn btn-success send-btn">Send Announcement</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    };
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.cancel-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    modal.querySelector('.send-btn').addEventListener('click', async () => {
        const announcement = modal.querySelector('#announcementMsg').value.trim();
        if (!announcement) {
            showErrorModal('Please enter an announcement message.');
            return;
        }
        try {
            const instructorId = getUserId();
            const response = await authenticatedFetch(`/instructor/r-announcement/${instructorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseId: courseId,
                    announcement: announcement
                })
            });
            if (response.ok) {
                showSuccessModal('Announcement sent successfully!');
                closeModal();
            } else {
                const errorData = await response.text();
                showErrorModal(`Failed to send announcement: ${errorData}`);
            }
        } catch (error) {
            console.error('Error sending announcement:', error);
            showErrorModal('An error occurred while sending the announcement. Please try again later.');
        }
    });
}; 