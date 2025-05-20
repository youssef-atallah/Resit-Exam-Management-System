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

// Function to determine resit exam status
function getResitStatus(resitExam) {
    if (resitExam.exam_date && resitExam.location) {
        return 'active';
    } else if (!resitExam.exam_date || !resitExam.location) {
        return 'pending';
    }
    return 'completed';
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
        return 'Date Pending';
    }
    return new Date(dateString).toLocaleDateString();
}

// Helper function to format time
function formatTime(dateString) {
    if (!dateString) {
        return 'Time Pending';
    }
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

// Upload Grades function
window.uploadGrades = function(resitId) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx,.xls,.csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // TODO: Implement file upload and processing
            console.log(`Uploading grades for resit exam ${resitId}`);
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
        const students = resitExam.enrolled_students || [];
        
        if (format === 'excel') {
            // Create Excel workbook
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(students.map(id => ({ 'Student ID': id })));
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
            
            // Generate Excel file
            XLSX.writeFile(workbook, `resit_students_${resitId}.xlsx`);
        } else if (format === 'pdf') {
            // Initialize jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add title
            doc.setFontSize(16);
            doc.text('Resit Exam Students List', 14, 15);
            
            // Add course info
            doc.setFontSize(12);
            doc.text(`Course: ${resitExam.course.name}`, 14, 25);
            doc.text(`Department: ${resitExam.course.department}`, 14, 32);
            
            // Add table headers
            const headers = [['Student ID']];
            const data = students.map(id => [id]);
            
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
                }
            });
            
            // Save PDF
            doc.save(`resit_students_${resitId}.pdf`);
        }
    } catch (error) {
        console.error('Error downloading student list:', error);
        alert('Failed to download student list. Please try again.');
    }
}; 