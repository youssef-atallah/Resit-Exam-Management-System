# 📬 Notification System Documentation

Complete guide for the notification system in the Resit Exam Management System.

---

## Overview

The notification system enables real-time communication with users about important events like grade postings, resit exam announcements, application status changes, and system messages.

### Key Features
- ✅ Real-time notification delivery
- ✅ Mark as read (individual or all)
- ✅ Delete notifications
- ✅ Type-specific icons and colors
- ✅ Pagination support
- ✅ Role-based notification creation

---

## Database Schema

```sql
CREATE TABLE notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),  -- 'course', 'resit_exam', 'application'
    related_entity_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Notification Types

| Type | Description | Icon | Color |
|------|-------------|------|-------|
| `grade_posted` | Course grade has been posted | 🎓 graduation-cap | Green |
| `resit_announced` | Resit exam announced for a course | 📢 bullhorn | Yellow |
| `resit_deadline` | Reminder about resit deadline | ⏰ clock | Red |
| `application_status` | Application approved/rejected | 📄 file-alt | Blue |
| `resit_result` | Resit exam result posted | 📊 chart-bar | Green |
| `system` | System-wide announcement | ℹ️ info-circle | Blue |

---

## API Endpoints

### User Endpoints (All Authenticated Users)

<details>
<summary><b>GET</b> <code>/my/notifications</code> - Fetch notifications</summary>

**Query Parameters:**
- `limit` (optional): Max notifications to return (default: 50)
- `offset` (optional): Skip notifications for pagination (default: 0)

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif-123",
      "userId": "stu-001",
      "type": "grade_posted",
      "title": "Grade Posted",
      "message": "Your grade for Mathematics I has been posted.",
      "relatedEntityType": "course",
      "relatedEntityId": "MATH101",
      "isRead": false,
      "createdAt": "2025-12-28T15:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```
</details>

<details>
<summary><b>GET</b> <code>/my/notifications/unread-count</code> - Get unread count</summary>

**Response:**
```json
{
  "success": true,
  "unreadCount": 5
}
```
</details>

<details>
<summary><b>PUT</b> <code>/my/notifications/:id/read</code> - Mark as read</summary>

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```
</details>

<details>
<summary><b>PUT</b> <code>/my/notifications/read-all</code> - Mark all as read</summary>

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```
</details>

<details>
<summary><b>DELETE</b> <code>/my/notifications/:id</code> - Delete notification</summary>

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```
</details>

### Secretary Endpoints

<details>
<summary><b>POST</b> <code>/notification/system</code> - Create system notification</summary>

**Request Body:**
```json
{
  "title": "System Maintenance",
  "message": "The system will be under maintenance on Sunday.",
  "userIds": ["stu-001", "stu-002", "inst-001"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "System notification sent to 3 users",
  "notificationCount": 3
}
```
</details>

---

## Frontend Integration

### Quick Start

Import and initialize the notification system on any page:

```html
<!-- Add CSS -->
<link rel="stylesheet" href="../../css/components/notifications.css">

<!-- Add JavaScript -->
<script type="module">
    import { initializeNotifications } from '../../js/utils/notifications.js';
    document.addEventListener('DOMContentLoaded', () => {
        initializeNotifications();
    });
</script>
```

### Required HTML Structure

```html
<div class="notifications">
    <button class="notification-btn" id="notificationBtn">
        <i class="fas fa-bell"></i>
        <span class="notification-badge">0</span>
    </button>
    <div class="notification-dropdown">
        <div class="notification-header">
            <h3>Notifications</h3>
            <button class="mark-all-read">Mark all as read</button>
        </div>
        <div class="notification-list">
            <!-- Loaded dynamically -->
        </div>
    </div>
</div>
```

### Available Functions

```javascript
import { 
    fetchNotifications,      // Get notifications (limit, offset)
    fetchUnreadCount,        // Get unread count
    markAsRead,              // Mark single notification as read
    markAllAsRead,           // Mark all as read
    deleteNotification,      // Delete a notification
    initializeNotifications  // Initialize the UI
} from '../../js/utils/notifications.js';
```

---

## Creating Notifications from Backend

The notification handler exports helper functions for creating notifications from other handlers:

```typescript
import { 
    notifyGradePosted, 
    notifyResitAnnounced, 
    notifyApplicationStatus,
    notifyResitResult 
} from './notificationHandler';

// When posting grades
await notifyGradePosted(studentId, courseName, courseId);

// When announcing resit exam
await notifyResitAnnounced(studentIds, courseName, resitExamId);

// When application status changes
await notifyApplicationStatus(studentId, courseName, 'Approved', applicationId);

// When posting resit results
await notifyResitResult(studentId, courseName, resitExamId);
```

---

## File Structure

```
server/
├── datastore/
│   ├── dao/
│   │   └── NotificationDao.ts       # Interface
│   └── sql/
│       ├── index.ts                 # Implementation
│       └── migrations/
│           └── 002-notifications.sql # Schema
├── hundlers/
│   └── notificationHandler.ts       # API handlers
├── routes/
│   └── notificationRoutes.ts        # Route definitions
└── types.ts                         # Type definitions

web/
├── css/
│   └── components/
│       └── notifications.css        # Styles
└── js/
    └── utils/
        └── notifications.js         # Frontend utility
```
