/**
 * Notification Utility Module
 * 
 * Provides functions to interact with the notification API endpoints.
 * This module handles fetching, marking as read, and displaying notifications.
 */

import { authenticatedFetch } from './auth.js';

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch user's notifications from the server
 * @param {number} limit - Maximum number of notifications to fetch
 * @param {number} offset - Number of notifications to skip (for pagination)
 * @returns {Promise<{notifications: Array, pagination: Object}>}
 */
export async function fetchNotifications(limit = 50, offset = 0) {
    try {
        const response = await authenticatedFetch(`/my/notifications?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
            throw new Error('Failed to fetch notifications');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], pagination: { limit, offset, hasMore: false } };
    }
}

/**
 * Fetch the count of unread notifications
 * @returns {Promise<number>}
 */
export async function fetchUnreadCount() {
    try {
        const response = await authenticatedFetch('/my/notifications/unread-count');
        if (!response.ok) {
            throw new Error('Failed to fetch unread count');
        }
        const data = await response.json();
        return data.unreadCount || 0;
    } catch (error) {
        console.error('Error fetching unread count:', error);
        return 0;
    }
}

/**
 * Mark a specific notification as read
 * @param {string} notificationId - The notification ID
 * @returns {Promise<boolean>}
 */
export async function markAsRead(notificationId) {
    try {
        const response = await authenticatedFetch(`/my/notifications/${notificationId}/read`, {
            method: 'PUT'
        });
        return response.ok;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        return false;
    }
}

/**
 * Mark all notifications as read
 * @returns {Promise<boolean>}
 */
export async function markAllAsRead() {
    try {
        const response = await authenticatedFetch('/my/notifications/read-all', {
            method: 'PUT'
        });
        return response.ok;
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
    }
}

/**
 * Delete a notification
 * @param {string} notificationId - The notification ID
 * @returns {Promise<boolean>}
 */
export async function deleteNotification(notificationId) {
    try {
        const response = await authenticatedFetch(`/my/notifications/${notificationId}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the appropriate icon class for a notification type
 * @param {string} type - Notification type
 * @returns {string} - Font Awesome icon class
 */
export function getNotificationIcon(type) {
    const icons = {
        'grade_posted': 'fa-graduation-cap',
        'resit_announced': 'fa-bullhorn',
        'resit_deadline': 'fa-clock',
        'application_status': 'fa-file-alt',
        'resit_result': 'fa-chart-bar',
        'system': 'fa-info-circle'
    };
    return icons[type] || 'fa-bell';
}

/**
 * Get the color class for a notification type
 * @param {string} type - Notification type
 * @returns {string} - CSS class for color
 */
export function getNotificationColor(type) {
    const colors = {
        'grade_posted': 'notification-success',
        'resit_announced': 'notification-warning',
        'resit_deadline': 'notification-danger',
        'application_status': 'notification-info',
        'resit_result': 'notification-success',
        'system': 'notification-info'
    };
    return colors[type] || 'notification-default';
}

/**
 * Format notification time to human-readable format
 * @param {string|Date} date - The notification date
 * @returns {string} - Human-readable time string
 */
export function formatNotificationTime(date) {
    const notificationDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffMs = now - notificationDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return notificationDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: notificationDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
}

// ============================================================================
// UI FUNCTIONS
// ============================================================================

/**
 * Create notification item HTML
 * @param {Object} notification - Notification object
 * @returns {string} - HTML string for the notification item
 */
export function createNotificationItemHTML(notification) {
    const icon = getNotificationIcon(notification.type);
    const colorClass = getNotificationColor(notification.type);
    const readClass = notification.isRead ? 'read' : '';
    const timeAgo = formatNotificationTime(notification.createdAt);

    return `
        <div class="notification-item ${readClass} ${colorClass}" data-id="${notification.id}">
            <i class="fas ${icon}"></i>
            <div class="notification-content">
                <p class="notification-title">${notification.title}</p>
                <p class="notification-message">${notification.message}</p>
                <span class="notification-time">${timeAgo}</span>
            </div>
            <button class="notification-delete" data-id="${notification.id}" title="Delete notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
}

/**
 * Initialize notification system for a page
 * This function sets up the notification dropdown with real data
 */
export async function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const notificationList = document.querySelector('.notification-list');
    const notificationBadge = document.querySelector('.notification-badge');
    const markAllReadBtn = document.querySelector('.mark-all-read');

    if (!notificationBtn || !notificationDropdown || !notificationList) {
        console.warn('Notification elements not found on page');
        return;
    }

    // Load notifications and update badge
    async function loadNotifications() {
        const data = await fetchNotifications(20);
        const unreadCount = await fetchUnreadCount();

        // Update badge
        if (notificationBadge) {
            if (unreadCount > 0) {
                notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                notificationBadge.style.display = 'flex';
            } else {
                notificationBadge.style.display = 'none';
            }
        }

        // Render notifications
        if (data.notifications && data.notifications.length > 0) {
            notificationList.innerHTML = data.notifications
                .map(n => createNotificationItemHTML(n))
                .join('');

            // Add click handlers for notifications
            notificationList.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', async (e) => {
                    // Don't trigger if clicking delete button
                    if (e.target.closest('.notification-delete')) return;

                    const id = item.dataset.id;
                    if (!item.classList.contains('read')) {
                        await markAsRead(id);
                        item.classList.add('read');
                        loadNotifications(); // Refresh badge
                    }
                });
            });

            // Add delete button handlers
            notificationList.querySelectorAll('.notification-delete').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const success = await deleteNotification(id);
                    if (success) {
                        btn.closest('.notification-item').remove();
                        loadNotifications(); // Refresh badge
                    }
                });
            });
        } else {
            notificationList.innerHTML = `
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications</p>
                </div>
            `;
        }
    }

    // Toggle dropdown
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
        if (notificationDropdown.classList.contains('show')) {
            loadNotifications();
        }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.notifications')) {
            notificationDropdown.classList.remove('show');
        }
    });

    // Mark all as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', async () => {
            await markAllAsRead();
            notificationList.querySelectorAll('.notification-item').forEach(item => {
                item.classList.add('read');
            });
            if (notificationBadge) {
                notificationBadge.style.display = 'none';
            }
        });
    }

    // Initial load of unread count for badge
    const unreadCount = await fetchUnreadCount();
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
}
