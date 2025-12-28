import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createSystemNotification
} from '../hundlers/notificationHandler';
import { authMiddleware, requireRole } from '../Auth/authHandler';

const router = express.Router();

/**
 * ============================================================================
 * NOTIFICATION ROUTES
 * ============================================================================
 * 
 * Route Organization:
 *   1. User Routes - Authenticated users can manage their own notifications
 *   2. Secretary Routes - System-wide notification creation
 * ============================================================================
 */


// ============================================================================
// USER ROUTES - Personal Notification Management
// ============================================================================

// GET /my/notifications - Get authenticated user's notifications
router.get('/my/notifications', authMiddleware, getMyNotifications);

// GET /my/notifications/unread-count - Get unread notification count
router.get('/my/notifications/unread-count', authMiddleware, getUnreadCount);

// PUT /my/notifications/read-all - Mark all notifications as read (must come BEFORE :id route)
router.put('/my/notifications/read-all', authMiddleware, markAllAsRead);

// PUT /my/notifications/:id/read - Mark a specific notification as read
router.put('/my/notifications/:id/read', authMiddleware, markAsRead);

// DELETE /my/notifications/:id - Delete a notification
router.delete('/my/notifications/:id', authMiddleware, deleteNotification);


// ============================================================================
// SECRETARY ROUTES - System Notification Management
// ============================================================================

// POST /notification/system - Create system-wide notification
router.post('/notification/system', authMiddleware, requireRole('secretary'), createSystemNotification);


export default router;
