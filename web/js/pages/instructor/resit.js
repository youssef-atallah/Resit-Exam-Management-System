// Function to fetch resit exams from the API
async function fetchResitExams() {
    try {
        const instructorId = localStorage.getItem('instructorId') || '12345611'; // Default ID for testing
        const response = await fetch(`http://localhost:3000/instructor/r-exams/${instructorId}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch resit exams');
        }

        return data.data;
    } catch (error) {
        console.error('Error fetching resit exams:', error);
        throw error;
    }
}

// Function to get current time with Istanbul timezone (UTC+3)
function getCurrentIstanbulTime() {
    const now = new Date();
    // Convert to Istanbul time (UTC+3)
    const istanbulTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    return istanbulTime;
}

// Function to determine resit exam status
function getResitStatus(resitExam) {
    // Check if deadline has passed
    if (resitExam.deadline) {
        let deadlineDate;
        if (typeof resitExam.deadline === 'string' && resitExam.deadline.includes(' ')) {
            const [datePart, timePart] = resitExam.deadline.split(' ');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes, seconds] = timePart.split(':');
            deadlineDate = new Date(year, month - 1, day, hours, minutes, seconds);
        } else {
            deadlineDate = new Date(parseInt(resitExam.deadline));
        }
        
        const currentTime = getCurrentIstanbulTime();
        if (deadlineDate <= currentTime) {
            return 'completed';
        }
    }

    // If deadline hasn't passed, check other conditions
    if (resitExam.exam_date && resitExam.location) {
        return 'active';
    } else if (!resitExam.exam_date || !resitExam.location) {
        return 'pending';
    }
    
    return 'pending';
}

// Function to create a resit exam card
function createResitCard(resitExam) {
    const status = getResitStatus(resitExam);
    const card = document.createElement('div');
    card.className = 'card resit-card';
    
    card.innerHTML = `
        <div class="resit-info">
            <h3>${resitExam.name}</h3>
            <span class="course-code">${resitExam.course_id}</span>
            <p><i class="fas fa-calendar"></i> ${formatDate(resitExam.exam_date)}</p>
            <p><i class="fas fa-clock"></i> ${formatTime(resitExam.exam_date)}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${resitExam.location || 'Location Pending'}</p>
            <p><i class="fas fa-hourglass-end"></i> Deadline: ${formatDate(resitExam.deadline)} ${formatTime(resitExam.deadline)}</p>
            <div class="resit-stats">
                <div class="resit-stat">
                    <div class="resit-stat-value">${resitExam.enrolled_count || 0}</div>
                    <div class="resit-stat-label">Students Applied</div>
                </div>
                <!-- <div class="resit-stat">
                    <div class="resit-stat-value">${resitExam.course.department}</div>
                    <div class="resit-stat-label">Department</div>
                </div> -->
            </div>
            <span class="status-badge status-${status}">${formatStatus(status)}</span>
        </div>
        <div class="resit-actions">
            ${status === 'completed' ? `
                <button class="btn btn-primary" onclick="uploadGrades('${resitExam.id}')">
                    <i class="fas fa-upload"></i> Upload Grades
                </button>
            ` : `
                <button class="btn btn-outline" onclick="downloadStudentList('${resitExam.id}', 'excel')">
                    <i class="fas fa-file-excel"></i> Excel
                </button>
                <button class="btn btn-outline" onclick="downloadStudentList('${resitExam.id}', 'pdf')">
                    <i class="fas fa-file-pdf"></i> PDF
                </button>
            `}
        </div>
    `;
    return card;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) {
        return 'Not Set';
    }
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Helper function to format time
function formatTime(dateString) {
    if (!dateString) {
        return '';
    }
    return new Date(dateString).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

// Helper function to format status
function formatStatus(status) {
    switch (status) {
        case 'active':
            return 'Open for Applications';
        case 'pending':
            return 'Pending Confirmation';
        case 'completed':
            return 'Application Closed';
        default:
            return status;
    }
}

// Function to load and display resit exams
async function loadResitExams() {
    try {
        const data = await fetchResitExams();
        const sections = {
            active: document.getElementById('active-resits'),
            pending: document.getElementById('pending-resits'),
            completed: document.getElementById('completed-resits')
        };

        // Clear existing content
        Object.values(sections).forEach(section => {
            section.querySelector('.resit-grid').innerHTML = '';
        });

        // Sort and display resit exams
        data.resitExams.forEach(resitExam => {
            const card = createResitCard(resitExam);
            const status = getResitStatus(resitExam);
            sections[status].querySelector('.resit-grid').appendChild(card);
        });

        // Show empty states if needed
        Object.entries(sections).forEach(([status, section]) => {
            const isEmpty = section.querySelector('.resit-grid').children.length === 0;
            if (isEmpty) {
                section.querySelector('.resit-grid').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No ${status} resit exams found</p>
                    </div>
                `;
            }
        });

    } catch (error) {
        console.error('Error loading resit exams:', error);
        // Show error state
        const sections = document.querySelectorAll('.resit-section');
        sections.forEach(section => {
            section.querySelector('.resit-grid').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load resit exams. Please try again later.</p>
                </div>
            `;
        });
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Set active link in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Initialize header functionality
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

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                localStorage.removeItem('instructorId');
                localStorage.removeItem('instructorName');
                sessionStorage.clear();
                window.location.href = '../../index.html';
            } catch (error) {
                console.error('Logout error:', error);
                showNotification('Error during logout', 'error');
            }
        });
    }

    // Fetch and display instructor name
    const instructorName = localStorage.getItem('instructorName');
    if (instructorName) {
        const userNameElements = document.querySelectorAll('.user-name');
        userNameElements.forEach(element => {
            element.textContent = instructorName;
        });
    }

    // Load resit exams
    loadResitExams();

    // Tab switching functionality
    const tabs = document.querySelectorAll('.resit-tab');
    const sections = {
        active: document.getElementById('active-resits'),
        pending: document.getElementById('pending-resits'),
        completed: document.getElementById('completed-resits')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding section
            const tabName = tab.dataset.tab;
            Object.entries(sections).forEach(([name, section]) => {
                section.style.display = name === tabName ? 'block' : 'none';
            });
        });
    });
});

// Add Toast Notification CSS
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.innerHTML = `
    #toast-container {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .toast {
        min-width: 250px;
        max-width: 350px;
        background: #2ecc71;
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(44, 62, 80, 0.15);
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        opacity: 0;
        transform: translateY(-20px);
        animation: toast-in 0.4s forwards, toast-out 0.4s 2.6s forwards;
    }
    .toast .toast-icon {
        font-size: 1.5rem;
    }
    .toast.error {
        background: #e74c3c;
    }
    @keyframes toast-in {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes toast-out {
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    `;
    document.head.appendChild(style);
}
// Add Toast Container to body if not present
if (!document.getElementById('toast-container')) {
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
}
// Toast function
function showToast(message, isError = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (isError ? ' error' : '');
    toast.innerHTML = `
        <span class="toast-icon">
            <i class="fas ${isError ? 'fa-times-circle' : 'fa-check-circle'}"></i>
        </span>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Upload Grades function
window.uploadGrades = function(resitId) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Read the Excel file
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const data = new Uint8Array(event.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);

                        // Validate the data format
                        if (!jsonData.length || !jsonData[0].hasOwnProperty('Student ID') || !jsonData[0].hasOwnProperty('Grade')) {
                            alert('Invalid file format. Please ensure the file has "Student ID" and "Grade" columns.');
                            return;
                        }

                        // Process each student's grade
                        const grades = jsonData.map(row => ({
                            studentId: row['Student ID'],
                            grade: row['Grade'],
                            gradeLetter: row['Grade Letter']
                        }));

                        // Upload grades to the server
                        const response = await fetch(`http://localhost:3000/instructor/resit-results/all/${resitId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ results: grades })
                        });

                        const result = await response.json();

                        if (result.success) {
                            showToast('Grades uploaded successfully!');
                            loadResitExams();
                        } else {
                            showToast(result.error || 'Failed to upload grades', true);
                        }
                    } catch (error) {
                        console.error('Error processing file:', error);
                        showToast('Error processing the file. Please check the format and try again.', true);
                    }
                };

                reader.onerror = () => {
                    showToast('Error reading the file. Please try again.', true);
                };

                reader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error uploading grades:', error);
                showToast('Failed to upload grades. Please try again.', true);
            }
        }
        document.body.removeChild(fileInput);
    };

    fileInput.click();
};

// Download Student List function
window.downloadStudentList = async function(resitId, format) {
    try {
        // Fetch resit exam details which includes enrolled students
        const response = await fetch(`http://localhost:3000/r-exam/${resitId}`);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch resit exam details');
        }

        const resitExam = result.resitExam;
        console.log('Resit Exam Data:', resitExam); // Debug log

        // Get enrolled students from the correct property 'students'
        const studentIds = resitExam.students || [];
        console.log('Student IDs:', studentIds); // Debug log

        if (studentIds.length === 0) {
            alert('No students enrolled in this resit exam.');
            return;
        }

        // Fetch student details for each student ID
        const studentDetails = [];
        for (const studentId of studentIds) {
            try {
                const studentResponse = await fetch(`http://localhost:3000/student/${studentId}`);
                const studentData = await studentResponse.json();
                console.log(`Student ${studentId} data:`, studentData); // Debug log
                
                if (studentData && studentData.name) {
                    studentDetails.push({
                        id: studentId,
                        name: studentData.name
                    });
                }
            } catch (error) {
                console.error(`Error fetching student ${studentId}:`, error);
            }
        }

        console.log('Final Student Details:', studentDetails); // Debug log

        if (studentDetails.length === 0) {
            alert('No student details could be retrieved.');
            return;
        }
        
        if (format === 'excel') {
            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            
            // Convert student details to array of arrays for Excel
            const excelData = [
                ['Student ID', 'Student Name'], // Header row
                ...studentDetails.map(student => [student.id, student.name])
            ];
            
            console.log('Excel Data:', excelData); // Debug log
            
            // Create worksheet from array of arrays
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);
            
            // Set column widths
            const wscols = [
                {wch: 15}, // Student ID column width
                {wch: 30}  // Student Name column width
            ];
            worksheet['!cols'] = wscols;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
            
            // Generate Excel file
            XLSX.writeFile(workbook, `resit_students_${resitId}.xlsx`);
        } else if (format === 'pdf') {
            try {
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(16);
            doc.text('Resit Exam Students List', 14, 15);
            
            // Add course info
            doc.setFontSize(12);
                doc.text(`Course: ${resitExam.name}`, 14, 25);
                doc.text(`Department: ${resitExam.department}`, 14, 32);
            
                // Add table headers and data
                const headers = [['Student ID', 'Student Name']];
                const data = studentDetails.map(student => [student.id, student.name]);
                
                console.log('PDF Data:', { headers, data }); // Debug log
            
            // Create table
            doc.autoTable({
                head: headers,
                body: data,
                startY: 40,
                theme: 'grid',
                styles: {
                    fontSize: 10,
                    cellPadding: 5
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255
                    },
                    columnStyles: {
                        0: { cellWidth: 60 }, // Student ID column
                        1: { cellWidth: 120 } // Student Name column
                    },
                    margin: { top: 40 }
            });
            
            // Save PDF
            doc.save(`resit_students_${resitId}.pdf`);
            } catch (pdfError) {
                console.error('Error generating PDF:', pdfError);
                alert('Failed to generate PDF. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error downloading student list:', error);
        alert('Failed to download student list. Please try again.');
    }
}; 