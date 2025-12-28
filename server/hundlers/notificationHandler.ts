import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Notification, NotificationType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// ============================================================================
// NOTIFICATION HANDLERS
// ============================================================================

/**
 * Get authenticated user's notifications
 * GET /my/notifications?limit=50&offset=0
 */
export const getMyNotifications: RequestHandler = async (req, res): Promise<any> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const notifications = await db.getNotificationsByUserId(userId, limit, offset);

    return res.status(200).json({
      success: true,
      notifications,
      pagination: {
        limit,
        offset,
        hasMore: notifications.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get unread notification count
 * GET /my/notifications/unread-count
 */
export const getUnreadCount: RequestHandler = async (req, res): Promise<any> => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    const count = await db.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount: count
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Mark a notification as read
 * PUT /my/notifications/:id/read
 */
export const markAsRead: RequestHandler = async (req, res): Promise<any> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    await db.markAsRead(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Mark all notifications as read
 * PUT /my/notifications/read-all
 */
export const markAllAsRead: RequestHandler = async (req, res): Promise<any> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    await db.markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete a notification
 * DELETE /my/notifications/:id
 */
export const deleteNotification: RequestHandler = async (req, res): Promise<any> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    await db.deleteNotification(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Create a system notification for all users or specific users
 * POST /notification/system
 * Body: { title, message, userIds?: string[] }
 * Secretary only
 */
export const createSystemNotification: RequestHandler = async (req, res): Promise<any> => {
  try {
    const { title, message, userIds } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    // If specific user IDs provided, notify those users
    // Otherwise, this would need to fetch all users
    if (userIds && Array.isArray(userIds)) {
      const notifications: Notification[] = userIds.map(userId => ({
        id: uuidv4(),
        userId,
        type: 'system' as NotificationType,
        title,
        message,
        isRead: false,
        createdAt: new Date()
      }));

      await db.createNotifications(notifications);

      return res.status(201).json({
        success: true,
        message: `System notification sent to ${userIds.length} users`,
        notificationCount: userIds.length
      });
    }

    return res.status(400).json({
      success: false,
      error: 'userIds array is required to specify notification recipients'
    });
  } catch (error) {
    console.error('Error creating system notification:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create system notification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// HELPER FUNCTIONS FOR CREATING NOTIFICATIONS FROM OTHER HANDLERS
// ============================================================================

/**
 * Helper function to create a notification when a grade is posted
 */
export async function notifyGradePosted(studentId: string, courseName: string, courseId: string): Promise<void> {
  const notification: Notification = {
    id: uuidv4(),
    userId: studentId,
    type: 'grade_posted',
    title: 'Grade Posted',
    message: `Your grade for ${courseName} has been posted.`,
    relatedEntityType: 'course',
    relatedEntityId: courseId,
    isRead: false,
    createdAt: new Date()
  };
  await db.createNotification(notification);
}

/**
 * Helper function to create a notification when a resit exam is announced
 */
export async function notifyResitAnnounced(studentIds: string[], courseName: string, resitExamId: string): Promise<void> {
  const notifications: Notification[] = studentIds.map(studentId => ({
    id: uuidv4(),
    userId: studentId,
    type: 'resit_announced' as NotificationType,
    title: 'Resit Exam Announced',
    message: `A resit exam has been announced for ${courseName}.`,
    relatedEntityType: 'resit_exam' as const,
    relatedEntityId: resitExamId,
    isRead: false,
    createdAt: new Date()
  }));
  await db.createNotifications(notifications);
}

/**
 * Helper function to create a notification when application status changes
 */
export async function notifyApplicationStatus(studentId: string, courseName: string, status: string, applicationId: string): Promise<void> {
  const notification: Notification = {
    id: uuidv4(),
    userId: studentId,
    type: 'application_status',
    title: 'Application Status Updated',
    message: `Your resit exam application for ${courseName} has been ${status.toLowerCase()}.`,
    relatedEntityType: 'application',
    relatedEntityId: applicationId,
    isRead: false,
    createdAt: new Date()
  };
  await db.createNotification(notification);
}

/**
 * Helper function to create a notification when resit exam result is posted
 */
export async function notifyResitResult(studentId: string, courseName: string, resitExamId: string): Promise<void> {
  const notification: Notification = {
    id: uuidv4(),
    userId: studentId,
    type: 'resit_result',
    title: 'Resit Exam Result Posted',
    message: `Your resit exam result for ${courseName} has been posted.`,
    relatedEntityType: 'resit_exam',
    relatedEntityId: resitExamId,
    isRead: false,
    createdAt: new Date()
  };
  await db.createNotification(notification);
}
