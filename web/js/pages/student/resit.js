import { checkStudentAuth, getLoggedInStudentData, updateStudentNameInHeader } from '../../../js/utils/studentAuth.js';

// Check if student is logged in
checkStudentAuth();

// Function to format date
function formatDate(timestamp) {
    if (!timestamp) return 'not announced';
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

// Function to update remaining times for all cards
function updateRemainingTimes() {
    const remainingTimeElements = document.querySelectorAll('.remaining-time');
    remainingTimeElements.forEach(element => {
        const deadline = element.getAttribute('data-deadline');
        if (deadline) {
            const remainingTime = formatRemainingTime(deadline);
            element.textContent = `(${remainingTime})`;
            
            // If deadline has passed, update the button state
            if (remainingTime === 'Deadline Passed') {
                const card = element.closest('.course-item');
                const cancelBtn = card?.querySelector('.cancel-resit');
                if (cancelBtn) {
                    cancelBtn.remove();
                }
            }
        }
    });
}

// Function to fetch student's resit exams
async function fetchStudentResitExams() {
    try {
        const studentData = await getLoggedInStudentData();
        const courseList = document.querySelector('.course-list');
        courseList.innerHTML = '<div class="loading">Loading resit exams...</div>';

        // First fetch student details to get resit exams
        const studentResponse = await fetch(`http://localhost:3000/student/${studentData.id}`);
        if (!studentResponse.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentDetails = await studentResponse.json();
        console.log('Student Details:', studentDetails); // Debug log

        if (!studentDetails.resitExams || studentDetails.resitExams.length === 0) {
            courseList.innerHTML = '<div class="no-exams">No resit exams available</div>';
            return;
        }

        // Fetch details for each resit exam
        const resitPromises = studentDetails.resitExams.map(async (resitId) => {
            try {
                const response = await fetch(`http://localhost:3000/r-exam/${resitId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch resit exam ${resitId}`);
                }
                const data = await response.json();
                
                if (!data.success || !data.resitExam) {
                    throw new Error(`Invalid resit exam data for ${resitId}`);
                }

                const exam = data.resitExam;
                return {
                    id: exam.id,
                    courseId: exam.course_id,
                    courseName: exam.name,
                    courseCode: exam.course_id,
                    deadline: exam.deadline,
                    examDate: exam.examDate,
                    location: exam.location,
                    department: exam.department,
                    announcement: exam.announcement,
                    instructor: exam.instructors?.[0] || 'Instructor TBA'
                };
            } catch (error) {
                console.error(`Error fetching resit exam ${resitId}:`, error);
                return null;
            }
        });

        const resitExamDetails = await Promise.all(resitPromises);
        const validResitExams = resitExamDetails.filter(exam => exam !== null);

        // Clear loading message
        courseList.innerHTML = '';

        if (validResitExams.length === 0) {
            courseList.innerHTML = '<div class="no-exams">No resit exams available</div>';
            return;
        }

        // Display resit exams
        validResitExams.forEach(exam => {
            const examCard = createResitExamCard(exam);
            courseList.appendChild(examCard);
        });
    } catch (error) {
        console.error('Error fetching resit exams:', error);
        document.querySelector('.course-list').innerHTML = 
            '<div class="error">Error loading resit exams. Please try again later.</div>';
    }
}

// Function to show confirmation modal
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
            transition: opacity 0.3s ease;
        }

        .custom-modal.show {
            opacity: 1;
        }
        
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
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            style.remove();
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

// Function to create a resit exam card
function createResitExamCard(exam) {
    const card = document.createElement('div');
    card.className = 'course-item improved-resit-card';
    
    const deadline = new Date(exam.deadline);
    const now = new Date();
    const isDeadlinePassed = now > deadline;

    card.innerHTML = `
        <div class="course-header">
            <h3>${exam.courseName}</h3>
            <span class="course-code">${exam.courseCode}</span>
        </div>
        <div class="course-info">
            <p><i class="fas fa-calendar"></i> Exam Date: ${formatDate(exam.examDate)}</p>
            <p><i class="fas fa-clock"></i> Deadline: ${formatDate(exam.deadline)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${exam.location || 'Location TBA'}</p>
            <p><i class="fas fa-user"></i> ${exam.instructor || 'Instructor TBA'}</p>
            ${exam.announcement ? `<p><i class="fas fa-bullhorn"></i> ${exam.announcement}</p>` : ''}
        </div>
        <div class="course-actions">
            ${isDeadlinePassed ? 
                '<button class="btn btn-danger btn-disabled" disabled>Deadline Passed</button>' :
                `<button class="btn btn-danger cancel-resit-btn" data-resit-id="${exam.id}">
                    <i class="fas fa-times"></i> Cancel Registration
                </button>`
            }
        </div>
    `;

    // Add event listener for cancel button
    const cancelBtn = card.querySelector('.cancel-resit-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            showConfirmationModal(
                `Are you sure you want to cancel your registration for ${exam.courseName}?`,
                () => cancelResitExam(exam.id)
            );
        });
    }

    // Add styles for the card
    const style = document.createElement('style');
    style.textContent = `
        .course-list {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            width: 100%;
            justify-content: center;
            padding: 1rem;
        }

        .improved-resit-card {
            box-sizing: border-box;
            border-left: 6px solid #2563eb;
            background: linear-gradient(90deg, #f0f4ff 0%, #fff 100%);
            box-shadow: 0 4px 24px rgba(37,99,235,0.07);
            padding: 1.5rem 1.5rem 1.5rem 2rem;
            border-radius: 14px;
            margin-bottom: 0;
            transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-width: 300px;
            max-width: 600px;
            width: 100%;
        }

        .improved-resit-card:hover {
            box-shadow: 0 8px 32px rgba(37,99,235,0.13);
            border-left: 6px solid #174ea6;
            transform: translateY(-4px) scale(1.02);
        }

        .improved-resit-card .course-header {
            margin-bottom: 0.7rem;
        }

        .improved-resit-card .course-header h3 {
            font-size: 1.35rem;
            font-weight: 700;
            color: #174ea6;
        }

        .improved-resit-card .course-code {
            background: #e3f0ff;
            color: #2563eb;
            padding: 0.25em 0.75em;
            border-radius: 8px;
            font-size: 1em;
            font-weight: 600;
        }

        .improved-resit-card .course-info p {
            margin: 0.15em 0;
            color: #374151;
            font-size: 1.05em;
            display: flex;
            align-items: center;
            gap: 0.5em;
        }

        .improved-resit-card .course-actions {
            margin-top: 1.2em;
            display: flex;
            gap: 1em;
        }

        .cancel-resit-btn {
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .cancel-resit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        @media (max-width: 768px) {
            .improved-resit-card {
                max-width: 100%;
                min-width: 280px;
            }
        }
    `;
    document.head.appendChild(style);

    // Add styles for the remaining time
    const remainingTimeStyle = document.createElement('style');
    remainingTimeStyle.textContent = `
        .course-info p {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin: 0.5rem 0;
        }
        .remaining-time {
            color: #dc3545;
            font-weight: 600;
            margin-left: 0.5rem;
            min-width: 120px;
            display: inline-block;
        }
    `;
    document.head.appendChild(remainingTimeStyle);

    return card;
}

// Function to format time remaining
function formatTimeRemaining(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) {
        return 'Deadline passed';
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
        return `${days} days, ${hours} hours remaining`;
    } else if (hours > 0) {
        return `${hours} hours, ${minutes} minutes remaining`;
    } else {
        return `${minutes} minutes remaining`;
    }
}

// Function to cancel resit exam registration
async function cancelResitExam(resitId) {
    try {
        const studentData = await getLoggedInStudentData();
        const response = await fetch(`http://localhost:3000/student/resit-exam/${studentData.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resitExamId: resitId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to cancel resit exam registration');
        }

        // Show success message
        showSuccessModal('Successfully cancelled resit exam registration');

        // Refresh the resit exams list
        fetchStudentResitExams();
    } catch (error) {
        console.error('Error canceling resit exam:', error);
        showSuccessModal('Failed to cancel resit exam registration. Please try again later.', true);
    }
}

// Function to show success modal
function showSuccessModal(message) {
    const modal = document.createElement('div');
    modal.className = 'custom-modal success-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="modal-message">${message}</div>
            <button class="modal-close-btn">OK</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    const closeBtn = modal.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load resit exams
    fetchStudentResitExams();

    // Update remaining times every second
    setInterval(() => {
        const timeElements = document.querySelectorAll('.course-info p:nth-child(2)');
        timeElements.forEach(element => {
            const deadline = element.getAttribute('data-deadline');
            if (deadline) {
                element.innerHTML = `<i class="fas fa-clock"></i> ${formatTimeRemaining(deadline)}`;
            }
        });
    }, 1000);

    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}); 