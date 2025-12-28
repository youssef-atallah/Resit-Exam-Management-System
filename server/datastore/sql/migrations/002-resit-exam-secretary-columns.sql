-- Add secretary-confirmable columns to resit_exams table
-- These columns are set by the secretary when confirming a resit exam

ALTER TABLE resit_exams ADD COLUMN exam_date DATETIME;
ALTER TABLE resit_exams ADD COLUMN deadline DATETIME;
ALTER TABLE resit_exams ADD COLUMN location VARCHAR(255);
ALTER TABLE resit_exams ADD COLUMN updated_at TIMESTAMP;
