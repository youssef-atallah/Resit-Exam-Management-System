-- Notifications table for the notification system
-- This migration adds support for user notifications

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'grade_posted', 
        'resit_announced', 
        'resit_deadline', 
        'application_status', 
        'resit_result', 
        'system'
    )),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50) CHECK (related_entity_type IN ('course', 'resit_exam', 'application') OR related_entity_type IS NULL),
    related_entity_id VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
