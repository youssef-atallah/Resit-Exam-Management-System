import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';
import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Check if student is logged in
checkStudentAuth();

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'not announced';
    let date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        date = new Date(parseInt(timestamp));
    }
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to get current time with timezone adjustment
function getCurrentTime() {
    const now = new Date();
    // Convert to Istanbul time (UTC+3)
    const istanbulTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    return istanbulTime;
}

// Function to format remaining time
function formatRemainingTime(deadline) {
    if (!deadline) return 'no timer';
    
    let deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
        deadlineDate = new Date(parseInt(deadline));
    }
    
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
        if (deadline && deadline !== 'null' && deadline !== 'undefined') {
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
        } else {
            element.textContent = '';
        }
    });
}

// Function to fetch student courses
async function fetchStudentCourses() {
    try {
        const studentId = getUserId();
        if (!studentId) {
            throw new Error('No student ID found');
        }
        
        const coursesGrid = document.querySelector('.courses-grid');
        coursesGrid.innerHTML = '<div class="loading">Loading courses...</div>';

        // Fetch student details including resit exams
        const studentResponse = await authenticatedFetch(`/student/${studentId}`);
        if (!studentResponse.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentDetails = await studentResponse.json();
        const studentResitExams = studentDetails.resitExams || [];

        // First, fetch student course details to get grades and resit exam info
        const studentDetailsResponse = await authenticatedFetch(`/student/${studentId}/course-details`);
        if (!studentDetailsResponse.ok) {
            throw new Error('Failed to fetch student course details');
        }
        const studentCourseDetails = await studentDetailsResponse.json();
        
        // Debug: Log the course details to see if resit_exam is present
        console.log('Student Course Details from API:', studentCourseDetails);

        // Create a map of course details for easy lookup
        const courseDetailsMap = new Map(
            studentCourseDetails.map(detail => [detail.courseId, detail])
        );

        // Get the student object from the response
        const student = studentDetails.student || studentDetails;
        const studentCourses = student.courses || [];

        // Fetch course details for each course ID
        const coursePromises = studentCourses.map(async (courseId) => {
            try {
                const response = await authenticatedFetch(`/course/${courseId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch course ${courseId}`);
                }
                const responseData = await response.json();
                const courseData = responseData.course;
                const studentDetail = courseDetailsMap.get(courseId);
                
                // Check if this course has a resit exam
                const hasResitExam = studentResitExams.some(resitId => resitId.includes(courseId));

                // Fetch instructor details using course/instructor endpoint (accessible to all authenticated users)
                let instructorName = 'Instructor ';
                if (courseData.instructor_id) {
                    try {
                        const instructorResponse = await authenticatedFetch(`/course/instructor/${courseId}`);
                        if (instructorResponse.ok) {
                            const instructorData = await instructorResponse.json();
                            if (instructorData.success && instructorData.instructor) {
                                instructorName = instructorData.instructor.name;
                            }
                        }
                    } catch (error) {
                        console.error(`Error fetching instructor details for course ${courseId}:`, error);
                    }
                }

                // Use resit exam details from the backend (already includes lettersAllowed)
                let resitExamDetails = null;
                if (studentDetail?.resit_exam) {
                    resitExamDetails = {
                        ...studentDetail.resit_exam,
                        // The backend now returns lettersAllowed directly
                        lettersAllowed: studentDetail.resit_exam.lettersAllowed || []
                    };
                    console.log(`Resit exam details for ${courseId}:`, resitExamDetails);
                }
                
                return {
                    courseId: courseData.id,
                    name: courseData.name,
                    code: courseId,
                    department: courseData.department,
                    instructor: instructorName,
                    schedule: studentDetail?.schedule || 'Schedule ',
                    location: studentDetail?.location || 'Location ',
                    grade: studentDetail?.grade,
                    gradeLetter: studentDetail?.gradeLetter,
                    progress: studentDetail?.progress || 85,
                    resit_exam: resitExamDetails,
                    hasAppliedForResit: hasResitExam
                };
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
    
    // Format the grade display - always show the grade box
    const gradeInfo = `
        <div class="grade-info ${!course.grade ? 'no-grade' : ''}">
            <div class="grade-details">
                <div class="grade-letter">${course.gradeLetter || '—'}</div>
                <div class="grade-number">${(course.grade !== null && course.grade !== undefined) ? course.grade : 'Not Graded'}</div>
            </div>
            <div class="grade-status">${(course.grade !== null && course.grade !== undefined) ? 'Final Grade' : 'Pending'}</div>
        </div>
    `;

    // Format the resit exam deadline if available - only show if deadline is set
    // Format the resit exam deadline if available
    let resitDeadline = '';
    if (course.resit_exam) {
        if (course.resit_exam.deadline) {
            resitDeadline = `
                <div class="apply-deadline-info">
                    <i class="fas fa-hourglass-end"></i>
                    Deadline to Apply: 
                    <span class="apply-deadline">${formatDate(course.resit_exam.deadline)}</span>
                    <span class="remaining-time" data-deadline="${course.resit_exam.deadline}">(${formatRemainingTime(course.resit_exam.deadline)})</span>
                </div>
            `;
        } else {
            resitDeadline = `
                <div class="apply-deadline-info">
                    <i class="fas fa-hourglass-start"></i>
                     Deadline to Apply: <span style="color: #6b7280; font-style: italic;">Not Specified Yet</span>
                </div>
            `;
        }
    }

    // Determine resit button state
    console.log('Course:', course.code);
    console.log('Grade Letter:', course.gradeLetter);
    console.log('Resit Exam Details:', course.resit_exam);
    
    const studentGradeLetter = course.gradeLetter?.toUpperCase() || '';
    // Fix: API returns 'lettersAllowed' not 'allowedLetters'
    const allowedLetters = course.resit_exam?.lettersAllowed || [];
    const hasResitExam = !!course.resit_exam;
    const isGradeLetterAllowed = hasResitExam && allowedLetters.length > 0 && allowedLetters.includes(studentGradeLetter);
    
    console.log('Student Grade Letter (uppercase):', studentGradeLetter);
    console.log('Allowed Letters:', allowedLetters);
    console.log('Has Resit Exam:', hasResitExam);
    console.log('Is Grade Letter Allowed:', isGradeLetterAllowed);
    console.log('Has Applied for Resit:', course.hasAppliedForResit);
    
    let resitButton;
    
    // Check if deadline has passed with timezone adjustment
    let isDeadlinePassed = false;
    if (course.resit_exam?.deadline) {
        let deadlineDate = new Date(course.resit_exam.deadline);
        if (isNaN(deadlineDate.getTime())) {
            deadlineDate = new Date(parseInt(course.resit_exam.deadline));
        }
        const currentTime = getCurrentTime();
        isDeadlinePassed = deadlineDate <= currentTime;
    }

    if (course.hasAppliedForResit) {
        // If student has already applied for resit, show View Resit Details and Cancel button (if allowed)
        resitButton = `
            <div class="resit-applied-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a href="resit.html" class="btn btn-resit applied" style="flex: 1;">
                    <i class="fas fa-check"></i>
                    View Resit Details
                </a>
                ${!isDeadlinePassed ? `
                <button class="btn btn-cancel-resit" data-course-id="${course.code}" style="flex: 1; background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
                    <i class="fas fa-times"></i>
                    Cancel
                </button>
                ` : `
                <button class="btn btn-resit not-eligible" disabled style="flex: 1;">
                    <i class="fas fa-clock"></i>
                    Deadline Passed
                </button>
                `}
            </div>
        `;
    } else if (!hasResitExam) {
        // No resit exam has been created for this course
        resitButton = `
            <button class="btn btn-resit no-resit" disabled>
                <i class="fas fa-clock"></i>
                No Resit Available
            </button>
        `;
    } else {
        if (!isGradeLetterAllowed) {
            resitButton = `
                <button class="btn btn-resit not-eligible" disabled>
                    <i class="fas fa-times-circle"></i>
                    Not Eligible (Your grade: ${studentGradeLetter || 'No Grade'})
                </button>
            `;
        } else {
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
        .btn-resit {
            transition: all 0.2s ease;
        }
        .btn-resit.eligible {
            background: #2563eb;
            color: white;
        }
        .btn-resit.eligible:hover {
            background: #1d4ed8;
            transform: translateY(-2px);
        }
        .btn-resit.not-eligible {
            background: #d1d5db;
            color: #6b7280;
            cursor: not-allowed;
        }
        .btn-resit.applied {
            background: #059669;
            color: white;
        }
        .btn-resit.applied:hover {
            background: #047857;
            transform: translateY(-2px);
        }
        .btn-resit.no-resit {
            background: #e5e7eb;
            color: #9ca3af;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);

    card.innerHTML = `
        <div class="course-header">
            <div class="course-title-section">
                <h3>${course.name}</h3>
                <span class="course-code">${course.code}</span>
            </div>
            ${gradeInfo}
        </div>
        
        <div class="course-details">
            <div class="detail-item">
                <i class="fas fa-chalkboard-teacher"></i>
                <span>${course.instructor}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-building"></i>
                <span>${course.department}</span>
            </div>
        </div>

        ${course.resit_exam ? `
        <div class="allowed-grades-info" style="margin: 0.5rem 0; padding: 0.5rem; background: #f0f9ff; border-radius: 6px; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-list-alt" style="color: #3b82f6;"></i>
            <span style="font-size: 0.9rem;">Eligible Grades: <strong>${course.resit_exam.lettersAllowed && course.resit_exam.lettersAllowed.length > 0 ? course.resit_exam.lettersAllowed.join(', ') : 'All Grades'}</strong></span>
        </div>
        ` : ''}

        ${resitDeadline}
        
        <div class="course-actions">
            ${resitButton}
        </div>
    `;

    // Add event listener for resit exam button
    const resitBtn = card.querySelector('.btn-resit.eligible');
    if (resitBtn) {
        resitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const courseId = resitBtn.dataset.courseId;
            const deadline = resitBtn.dataset.applyDeadline;
            
            // Check if deadline has passed
            if (deadline) {
                let deadlineDate;
                if (typeof deadline === 'string' && deadline.includes(' ')) {
                    const [datePart, timePart] = deadline.split(' ');
                    const [year, month, day] = datePart.split('-');
                    const [hours, minutes, seconds] = timePart.split(':');
                    deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
                } else {
                    deadlineDate = new Date(parseInt(deadline));
                }
                
                const currentTime = getCurrentTime();
                if (deadlineDate <= currentTime) {
                    alert('The deadline for applying to the resit exam has passed.');
                    return;
                }
            }

            try {
                const studentId = getUserId();
                const response = await authenticatedFetch(`/my/apply-resit`, {
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
                    showSuccessModal(`Failed to apply for resit exam: ${errorData}`, true);
                }
            } catch (error) {
                console.error('Error applying for resit exam:', error);
                showSuccessModal('An error occurred while applying for the resit exam. Please try again later.', true);
            }
        });
    }

    // Add event listener for cancel resit button (for already applied courses)
    const cancelResitBtn = card.querySelector('.btn-cancel-resit');
    if (cancelResitBtn) {
        cancelResitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const courseId = e.currentTarget.getAttribute('data-course-id');
            
            // Show styled confirmation modal
            showConfirmationModal(
                `Are you sure you want to cancel your resit exam enrollment for ${course.name}?`,
                async () => {
                    try {
                        // Get the resit exam ID from the course's resit exam data
                        const resitExamId = course.resit_exam?.id;
                        if (!resitExamId) {
                            showSuccessModal('Could not find resit exam information.', true);
                            return;
                        }
                        
                        const response = await authenticatedFetch(`/my/cancel-resit`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                resitExamId: resitExamId
                            })
                        });

                        if (response.ok) {
                            showSuccessModal('Successfully cancelled resit exam enrollment!');
                            // Refresh the page to show updated status
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } else {
                            const errorData = await response.json();
                            showSuccessModal(`Failed to cancel: ${errorData.error || 'Unknown error'}`, true);
                        }
                    } catch (error) {
                        console.error('Error cancelling resit exam:', error);
                        showSuccessModal('An error occurred. Please try again later.', true);
                    }
                }
            );
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
    // Update student name
    updateStudentNameInHeader();

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

    // Note: Notification and user menu dropdowns are handled by header.js utility
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

// Show styled confirmation modal
function showConfirmationModal(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal confirmation-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon warning">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <div class="modal-message">${message}</div>
            <div class="modal-buttons">
                <button class="modal-cancel-btn">Cancel</button>
                <button class="modal-confirm-btn">Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles for the confirmation modal
    const style = document.createElement('style');
    style.id = 'confirmation-modal-styles';
    if (!document.getElementById('confirmation-modal-styles')) {
        style.textContent = `
            .confirmation-modal .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                transform: translateY(-20px);
                transition: transform 0.3s ease;
                position: relative;
                margin: 20px;
            }

            .custom-modal.show .modal-content {
                transform: translateY(0);
            }
            
            .confirmation-modal .modal-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #f59e0b;
            }
            
            .confirmation-modal .modal-message {
                font-size: 1.1rem;
                color: #374151;
                margin-bottom: 1.5rem;
                line-height: 1.5;
                word-wrap: break-word;
            }
            
            .confirmation-modal .modal-buttons {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .confirmation-modal .modal-cancel-btn,
            .confirmation-modal .modal-confirm-btn {
                padding: 0.7rem 1.5rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                min-width: 100px;
            }
            
            .confirmation-modal .modal-cancel-btn {
                background: #f3f4f6;
                color: #4b5563;
                border: none;
            }
            
            .confirmation-modal .modal-cancel-btn:hover {
                background: #e5e7eb;
            }
            
            .confirmation-modal .modal-confirm-btn {
                background: #ef4444;
                color: white;
                border: none;
            }
            
            .confirmation-modal .modal-confirm-btn:hover {
                background: #dc2626;
            }

            @media (max-width: 480px) {
                .confirmation-modal .modal-content {
                    width: 95%;
                    margin: 10px;
                    padding: 1.5rem;
                }

                .confirmation-modal .modal-buttons {
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .confirmation-modal .modal-cancel-btn,
                .confirmation-modal .modal-confirm-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
    
    modal.querySelector('.modal-cancel-btn').addEventListener('click', closeModal);
    modal.querySelector('.modal-confirm-btn').addEventListener('click', () => {
        closeModal();
        onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Add this at the beginning of the file, after the existing functions
function showSuccessModal(message, isError = false) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = `custom-modal ${isError ? 'error-modal' : 'success-modal'}`;
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas ${isError ? 'fa-times-circle' : 'fa-check-circle'}"></i>
            </div>
            <div class="modal-message">${message}</div>
            <button class="modal-close-btn ${isError ? 'error-btn' : ''}">OK</button>
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

    .error-modal .modal-icon {
        color: #dc3545;
    }

    .error-modal .modal-close-btn {
        background: #dc3545;
    }

    .error-modal .modal-close-btn:hover {
        background: #c82333;
    }
`;
document.head.appendChild(style); 