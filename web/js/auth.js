// Function to validate form data
function validateForm(formData) {
    const errors = {};
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username) {
        errors.username = 'ID is required';
    }
    if (!password) {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Function to show notification
function showNotification(message, type = 'error') {
    console.log('Showing notification:', message, type); // Debug log

    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        console.log('Removing existing notification'); // Debug log
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('data-notification-id', Date.now()); // Add unique ID
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
            </div>
            <div class="notification-message">
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;

    // Add styles with higher specificity to prevent overrides
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            width: 380px !important;
            background: white !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
            z-index: 999999 !important;
            overflow: hidden !important;
            animation: notificationSlideIn 0.3s ease-out !important;
            pointer-events: auto !important;
        }

        .notification-content {
            display: flex !important;
            align-items: center !important;
            padding: 16px !important;
            gap: 12px !important;
        }

        .notification-icon {
            flex-shrink: 0 !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .notification-icon i {
            font-size: 1.25rem !important;
        }

        .notification.error .notification-icon i {
            color: #dc3545 !important;
        }

        .notification.success .notification-icon i {
            color: #28a745 !important;
        }

        .notification-message {
            flex-grow: 1 !important;
            font-size: 0.95rem !important;
            color: #2d3748 !important;
            line-height: 1.4 !important;
        }

        .notification-close {
            flex-shrink: 0 !important;
            background: none !important;
            border: none !important;
            padding: 4px !important;
            cursor: pointer !important;
            color: #718096 !important;
            transition: color 0.2s !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 24px !important;
            height: 24px !important;
            border-radius: 6px !important;
        }

        .notification-close:hover {
            color: #2d3748 !important;
            background: #f7fafc !important;
        }

        .notification-progress {
            height: 3px !important;
            background: #e2e8f0 !important;
            width: 100% !important;
        }

        .notification.error .notification-progress {
            background: #dc3545 !important;
            animation: notificationProgress 60s linear forwards !important;
        }

        .notification.success .notification-progress {
            background: #28a745 !important;
            animation: notificationProgress 60s linear forwards !important;
        }

        @keyframes notificationSlideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes notificationSlideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        @keyframes notificationProgress {
            from {
                width: 100%;
            }
            to {
                width: 0%;
            }
        }

        @media (max-width: 480px) {
            .notification {
                width: calc(100% - 32px) !important;
                margin: 0 16px !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to document
    document.body.appendChild(notification);
    console.log('Notification added to DOM'); // Debug log

    // Handle close button click
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        console.log('Close button clicked'); // Debug log
        notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
                console.log('Notification removed by close button'); // Debug log
            }
        }, 300);
    });

    // Auto-remove after 60 seconds
    const timeoutId = setTimeout(() => {
        console.log('Timeout reached, removing notification'); // Debug log
        if (document.body.contains(notification)) {
            notification.style.animation = 'notificationSlideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                    console.log('Notification removed by timeout'); // Debug log
                }
            }, 300);
        }
    }, 60000);

    // Store the timeout ID on the notification element
    notification.dataset.timeoutId = timeoutId;

    // Prevent other scripts from removing this notification
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.contains(notification)) {
                console.log('Notification was removed by another script, adding it back'); // Debug log
                // If the notification was removed by another script, add it back
                if (!document.body.contains(notification)) {
                    document.body.appendChild(notification);
                }
            }
        });
    });

    observer.observe(document.body, { childList: true });

    // Clean up observer when notification is removed
    const cleanup = () => {
        console.log('Cleaning up notification resources'); // Debug log
        observer.disconnect();
        clearTimeout(timeoutId);
    };

    notification.addEventListener('remove', cleanup);

    // Add global event listener to prevent other scripts from removing notifications
    window.addEventListener('DOMNodeRemoved', (e) => {
        if (e.target === notification) {
            console.log('Prevented notification removal'); // Debug log
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);

    return notification; // Return the notification element for external reference
}

// Function to handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const selectedRole = document.querySelector('.role-option.active')?.dataset.role;

    if (!selectedRole) {
        showNotification('Please select a role', 'error');
        return;
    }

    const { isValid, errors } = validateForm(formData);
    if (!isValid) {
        Object.entries(errors).forEach(([field, message]) => {
            showNotification(message, 'error');
        });
        return;
    }

    try {
        let response;
        let userData;

        // Check if user exists and verify password
        if (selectedRole === 'instructor') {
            response = await fetch(`http://localhost:3000/instructor/${username}`);
            if (!response.ok) {
                throw new Error('Invalid instructor ID');
            }
            userData = await response.json();
            if (userData.password !== password) {
                throw new Error('Invalid password');
            }
            // Store instructor data
            localStorage.setItem('instructorId', userData.id);
            localStorage.setItem('instructorName', userData.name);
            window.location.href = 'pages/instructor/dashboard.html';
        } else if (selectedRole === 'student') {
            response = await fetch(`http://localhost:3000/student/${username}`);
            if (!response.ok) {
                throw new Error('Invalid student ID');
            }
            userData = await response.json();
            if (userData.password !== password) {
                throw new Error('Invalid password');
            }
            // Store student data
            localStorage.setItem('studentId', userData.id);
            localStorage.setItem('studentName', userData.name);
            window.location.href = 'pages/student/dashboard.html';
        }

        showNotification('Login successful!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Handle role selection
    document.querySelectorAll('.role-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.role-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            document.querySelector('.login-btn').disabled = false;
        });
    });

    // Handle form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}); 