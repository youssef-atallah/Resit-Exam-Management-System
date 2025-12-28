-- Add department and year_level to students table
ALTER TABLE students ADD COLUMN department VARCHAR(255);
ALTER TABLE students ADD COLUMN year_level INTEGER;
