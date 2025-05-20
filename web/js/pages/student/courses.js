import { checkStudentAuth, getLoggedInStudentData } from '../../../js/utils/studentAuth.js';

// Check if student is logged in
checkStudentAuth();

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp));
    return date.toISOString().replace('T', ' ').replace('.000Z', 'Z');
}

// Function to get current time with timezone adjustment
function getCurrentTime() {
    const now = new Date();
    // Add 3 hours to match the backend timezone
    now.setHours(now.getHours() + 3);
    return now;
}

// Function to format remaining time
function formatRemainingTime(deadline) {
    if (!deadline) return 'TBA';
    const deadlineDate = new Date(parseInt(deadline));
    const now = getCurrentTime();
    const diff = deadlineDate - now;

    if (diff <= 0) return 'Deadline Passed';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let remainingTime = '';
    if (days > 0) remainingTime += `${days}d `;
    if (hours > 0 || days > 0) remainingTime += `${hours.toString().padStart(2, '0')}h `;
    remainingTime += `${minutes.toString().padStart(2, '0')}m `;
    remainingTime += `${seconds.toString().padStart(2, '0')}s`;

    return remainingTime;
}

// Function to update remaining time for all cards
function updateRemainingTimes() {
    const remainingTimeElements = document.querySelectorAll('.remaining-time');
    remainingTimeElements.forEach(element => {
        const deadline = element.getAttribute('data-deadline');
        if (deadline) {
            const remainingTime = formatRemainingTime(deadline);
            element.textContent = `(${remainingTime})`;
            
            // If deadline has passed, update the button state
            if (remainingTime === 'Deadline Passed') {
                const card = element.closest('.course-card');
                const resitBtn = card?.querySelector('.btn-resit.eligible');
                if (resitBtn) {
                    resitBtn.disabled = true;
                    resitBtn.classList.remove('eligible');
                    resitBtn.classList.add('not-eligible');
                    resitBtn.innerHTML = '<i class="fas fa-redo"></i> Deadline Passed';
                }
            }
        }
    });
}

// Function to fetch student courses
async function fetchStudentCourses() {
    try {
        const studentData = await getLoggedInStudentData();
        const coursesGrid = document.querySelector('.courses-grid');
        coursesGrid.innerHTML = '<div class="loading">Loading courses...</div>';

        // Fetch course details for each course ID
        const coursePromises = studentData.courses.map(async (courseId) => {
            try {
                const response = await fetch(`http://localhost:3000/course/${courseId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch course ${courseId}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Error fetching course ${courseId}:`, error);
                return null;
            }
        });

        const courses = await Promise.all(coursePromises);
        const validCourses = courses.filter(course => course !== null);

        // Clear loading message
        coursesGrid.innerHTML = '';

        if (validCourses.length === 0) {
            coursesGrid.innerHTML = '<div class="no-courses">No courses found</div>';
            return;
        }

        // Display courses
        validCourses.forEach(course => {
            const courseCard = createCourseCard(course);
            coursesGrid.appendChild(courseCard);
        });
    } catch (error) {
        console.error('Error fetching student courses:', error);
        document.querySelector('.courses-grid').innerHTML = 
            '<div class="error">Error loading courses. Please try again later.</div>';
    }
}

// Function to create a course card
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    // Format the grade display
    const gradeInfo = course.grade ? `
        <div class="grade-info">
            <div class="grade-details">
                <div class="grade-letter">${course.gradeLetter || 'N/A'}</div>
                <div class="grade-number">${course.grade || 'N/A'}</div>
            </div>
            <div class="grade-status">Final Grade</div>
        </div>
    ` : '<div class="grade-info not-announced"></div>';

    // Format the resit exam deadline if available
    const resitDeadline = course.resit_exam ? `
        <div class="apply-deadline-info">
            <i class="fas fa-hourglass-end"></i>
            Deadline to Apply for Resit Exam: 
            <span class="apply-deadline">${formatDate(course.resit_exam.deadline)}</span>
            <span class="remaining-time" data-deadline="${course.resit_exam.deadline}">(${formatRemainingTime(course.resit_exam.deadline)})</span>
        </div>
    ` : '';

    // Determine resit button state
    const isEligibleForResit = course.grade && course.grade < 60;
    let resitButton;
    
    if (!isEligibleForResit) {
        resitButton = `
            <button class="btn btn-resit not-eligible" disabled>
                <i class="fas fa-redo"></i>
                Not Eligible for Resit
            </button>
        `;
    } else if (course.hasAppliedForResit) {
        resitButton = `
            <a href="http://localhost:3000/pages/student/resit.html" class="btn btn-resit applied">
                <i class="fas fa-check"></i>
                View Resit Details
            </a>
        `;
    } else {
        // Check if deadline has passed with timezone adjustment
        const deadlineDate = course.resit_exam?.deadline ? new Date(parseInt(course.resit_exam.deadline)) : null;
        const currentTime = getCurrentTime();
        const isDeadlinePassed = deadlineDate && deadlineDate <= currentTime;

        resitButton = `
            <button class="btn btn-resit ${isDeadlinePassed ? 'not-eligible' : 'eligible'}" 
                    data-course-id="${course.courseId}" 
                    data-apply-deadline="${course.resit_exam?.deadline || ''}"
                    ${isDeadlinePassed ? 'disabled' : ''}>
                <i class="fas fa-redo"></i>
                ${isDeadlinePassed ? 'Deadline Passed' : 'Apply for Resit Exam'}
            </button>
        `;
    }

    // Add styles for the remaining time
    const style = document.createElement('style');
    style.textContent = `
        .apply-deadline-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 1rem 0;
            padding: 0.5rem;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .remaining-time {
            color: #dc3545;
            font-weight: 600;
            margin-left: 0.5rem;
            min-width: 120px;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

    card.innerHTML = `
        <div class="course-header">
            <div class="course-title">
                <h3>${course.name}</h3>
                <span class="course-code">${course.code}</span>
            </div>
            ${gradeInfo}
        </div>
        <div class="course-info">
            <div class="info-item">
                <i class="fas fa-user"></i>
                <span>${course.instructor || 'Instructor TBA'}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>${course.schedule || 'Schedule TBA'}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${course.location || 'Location TBA'}</span>
            </div>
        </div>
        <div class="course-progress">
            <div class="progress-header">
                <span>Course Progress</span>
                <span class="course-grade">${course.progress || 85}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${course.progress || 80}%"></div>
            </div>
        </div>
        ${resitDeadline}
        <div class="course-actions">
            <a href="#" class="btn btn-secondary btn-assignments">
                <i class="fas fa-tasks"></i>
                Assignments
            </a>
            ${resitButton}
        </div>
    `;

    // Add event listeners
    const assignmentsBtn = card.querySelector('.btn-assignments');
    if (assignmentsBtn) {
        assignmentsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openUnderDevModal();
        });
    }

    // Add event listener for resit exam button
    const resitBtn = card.querySelector('.btn-resit.eligible');
    if (resitBtn) {
        resitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const courseId = resitBtn.dataset.courseId;
            const deadline = resitBtn.dataset.applyDeadline;
            
            // Check if deadline has passed with timezone adjustment
            if (deadline) {
                const deadlineDate = new Date(parseInt(deadline));
                const currentTime = getCurrentTime();
                if (deadlineDate <= currentTime) {
                    alert('The deadline for applying to the resit exam has passed.');
                    return;
                }
            }

            try {
                const response = await fetch(`http://localhost:3000/student/resit-exam/20209958`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId: courseId
                    })
                });

                if (response.ok) {
                    showSuccessModal('Successfully applied for the resit exam!');
                    // Disable the button after successful application
                    resitBtn.disabled = true;
                    resitBtn.classList.remove('eligible');
                    resitBtn.classList.add('applied');
                    resitBtn.innerHTML = '<i class="fas fa-check"></i> Applied for Resit';
                } else {
                    const errorData = await response.text();
                    showSuccessModal(`Failed to apply for resit exam: ${errorData}`);
                }
            } catch (error) {
                console.error('Error applying for resit exam:', error);
                alert('An error occurred while applying for the resit exam. Please try again later.');
            }
        });
    }

    return card;
}

// Function to view course details
function viewCourseDetails(courseId) {
    // Implement course details view
    console.log('Viewing details for course:', courseId);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    fetchStudentCourses();

    // Handle academic year/term changes
    const academicYear = document.getElementById('academicYear');
    const academicTerm = document.getElementById('academicTerm');

    if (academicYear && academicTerm) {
        academicYear.addEventListener('change', fetchStudentCourses);
        academicTerm.addEventListener('change', fetchStudentCourses);
    }

    // Update remaining times every second
    setInterval(updateRemainingTimes, 1000);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Course search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const courseName = card.querySelector('h3').textContent.toLowerCase();
            const courseCode = card.querySelector('.course-code').textContent.toLowerCase();
            
            if (courseName.includes(searchTerm) || courseCode.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Toggle notification dropdown
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('show');
        });
    }

    // Close notification dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationDropdown && !e.target.closest('.notifications')) {
            notificationDropdown.classList.remove('show');
        }
    });

    // Handle mark all as read
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.add('read');
            });
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }

    // Toggle user menu
    const userInfo = document.querySelector('.user-info');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (userInfo && dropdownMenu) {
        userInfo.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdownMenu && !e.target.closest('.user-menu')) {
            dropdownMenu.classList.remove('show');
        }
    });
});

// Under Development Modal Logic
function openUnderDevModal() {
    document.getElementById('underDevModal').classList.add('show');
}

function closeUnderDevModal() {
    document.getElementById('underDevModal').classList.remove('show');
}

// Close modal when clicking the close button
document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        closeUnderDevModal();
    });
});

// Add this at the beginning of the file, after the existing functions
function showSuccessModal(message) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'custom-modal success-modal';
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="modal-message">${message}</div>
            <button class="modal-close-btn">OK</button>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add show class after a small delay for animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Handle close button click
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300); // Match this with CSS transition duration
    });
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Add this CSS to your existing styles
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

    .custom-modal.show {
        opacity: 1;
        visibility: visible;
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 90%;
        width: 400px;
    }

    .custom-modal.show .modal-content {
        transform: translateY(0);
    }

    .modal-icon {
        font-size: 3rem;
        color: #4CAF50;
        margin-bottom: 1rem;
    }

    .modal-message {
        font-size: 1.1rem;
        color: #333;
        margin-bottom: 1.5rem;
        line-height: 1.5;
    }

    .modal-close-btn {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 0.8rem 2rem;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .modal-close-btn:hover {
        background: #45a049;
    }

    .success-modal .modal-icon {
        color: #4CAF50;
    }
`;
document.head.appendChild(style); 