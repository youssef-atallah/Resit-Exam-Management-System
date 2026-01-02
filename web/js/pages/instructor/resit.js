import { authenticatedFetch, getUserId } from '../../utils/auth.js';

// Function to fetch resit exams from the API
async function fetchResitExams() {
    try {
        const instructorId = getUserId();
        if (!instructorId) {
            throw new Error('No instructor ID found');
        }
        const response = await authenticatedFetch(`/instructor/${instructorId}/resit-exams`);
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
    // Check if EXAM DATE has passed (not deadline)
    if (resitExam.exam_date) {
        let examDate;
        if (typeof resitExam.exam_date === 'string' && resitExam.exam_date.includes(' ')) {
            const [datePart, timePart] = resitExam.exam_date.split(' ');
            const [year, month, day] = datePart.split('-');
            const [hours, minutes, seconds] = timePart.split(':');
            examDate = new Date(year, month - 1, day, hours, minutes, seconds);
        } else {
            examDate = new Date(resitExam.exam_date);
        }
        
        const currentTime = getCurrentIstanbulTime();
        if (examDate <= currentTime) {
            return 'completed';
        }
    }

    // If exam date hasn't passed (or isn't set), check other conditions
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
            </div>
            <p><i class="fas fa-list-alt"></i> Allowed Grades: ${resitExam.lettersAllowed && resitExam.lettersAllowed.length > 0 ? resitExam.lettersAllowed.join(', ') : 'All Grades'}</p>
            <span class="status-badge status-${status}">${formatStatus(status)}</span>
        </div>
        <div class="resit-actions">
            ${status === 'completed' ? `
                <button class="btn btn-outline" onclick="downloadStudentList('${resitExam.id}', 'grades-template')">
                    <i class="fas fa-file-excel"></i> Download Template
                </button>
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

    // Auto-switch to pending tab if active is empty and pending has items
    const activeSection = document.getElementById('active-resits');
    const pendingSection = document.getElementById('pending-resits');
    const activeCount = activeSection?.querySelector('.resit-grid')?.children?.length || 0;
    const pendingCount = pendingSection?.querySelector('.resit-grid')?.children?.length || 0;

    // Check if active items are actually cards (not empty state div)
    const activeHasCards = activeCount > 0 && !activeSection.querySelector('.empty-state');
    const pendingHasCards = pendingCount > 0 && !pendingSection.querySelector('.empty-state');

    if (!activeHasCards && pendingHasCards) {
        // Find pending tab and click it
        const pendingTab = document.querySelector('.resit-tab[data-tab="pending"]');
        if (pendingTab) {
            pendingTab.click();
            showToast('Switched to Pending view as you have pending requests', false);
        }
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

    // Note: Header functionality (notifications, user menu, logout) is handled by header.js utility

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
    
    // Add search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const resitCards = document.querySelectorAll('.resit-card');
            
            resitCards.forEach(card => {
                const courseName = card.querySelector('.resit-header h3')?.textContent.toLowerCase() || '';
                const department = card.querySelector('.resit-info')?.textContent.toLowerCase() || '';
                
                const matches = courseName.includes(searchTerm) || department.includes(searchTerm);
                
                card.style.display = matches ? '' : 'none';
            });
        });
    }
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
                        const response = await authenticatedFetch(`/instructor/resit-results/all/${resitId}`, {
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
        const response = await authenticatedFetch(`/resit-exam/${resitId}`);
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
                const studentResponse = await authenticatedFetch(`/student/${studentId}`);
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
        
        if (format === 'excel' || format === 'grades-template') {
            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            
            // Define headers based on format
            const headers = format === 'grades-template' 
                ? ['Student ID', 'Student Name', 'Grade', 'Grade Letter']
                : ['Student ID', 'Student Name'];

            // Convert student details to array of arrays for Excel
            const excelData = [
                headers, // Header row
                ...studentDetails.map(student => {
                    const row = [student.id, student.name];
                    if (format === 'grades-template') {
                        row.push('', ''); // Empty columns for Grade and Grade Letter
                    }
                    return row;
                })
            ];
            
            console.log('Excel Data:', excelData); // Debug log
            
            // Create worksheet from array of arrays
            const worksheet = XLSX.utils.aoa_to_sheet(excelData);
            
            // Set column widths
            const wscols = [
                {wch: 15}, // Student ID column width
                {wch: 30}  // Student Name column width
            ];
            if (format === 'grades-template') {
                wscols.push({wch: 10}, {wch: 12}); // Widths for Grade and Grade Letter
            }
            worksheet['!cols'] = wscols;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
            
            // Generate Excel file
            const filename = format === 'grades-template' 
                ? `resit_grades_template_${resitId}.xlsx`
                : `resit_students_${resitId}.xlsx`;
            XLSX.writeFile(workbook, filename);
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