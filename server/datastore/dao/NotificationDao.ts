import { Notification } from '../../types';

/**
 * NotificationDao Interface
 * Defines the contract for notification data access operations
 */
export interface NotificationDao {
  /**
   * Create a single notification
   */
  createNotification(notification: Notification): Promise<void>;

  /**
   * Create multiple notifications at once (for batch operations)
   */
  createNotifications(notifications: Notification[]): Promise<void>;

  /**
   * Get notifications for a specific user
   * @param userId - The user's ID
   * @param limit - Maximum number of notifications to return (default: 50)
   * @param offset - Number of notifications to skip (for pagination)
   */
  getNotificationsByUserId(userId: string, limit?: number, offset?: number): Promise<Notification[]>;

  /**
   * Get count of unread notifications for a user
   */
  getUnreadCount(userId: string): Promise<number>;

  /**
   * Mark a specific notification as read
   */
  markAsRead(notificationId: string, userId: string): Promise<void>;

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Delete a specific notification
   */
  deleteNotification(notificationId: string, userId: string): Promise<void>;

  /**
   * Delete all notifications for a user
   */
  deleteAllNotifications(userId: string): Promise<void>;
}
