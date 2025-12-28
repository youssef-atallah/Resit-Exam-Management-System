# 🗄️ Database Schema Documentation

Complete database schema for the Resit Exam Management System.

---

## Table of Contents

- [Overview](#overview)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tables](#tables)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Sample Data](#sample-data)

---

## Overview

The system uses **SQLite** as the database engine with a normalized relational schema.

### Key Characteristics

- **Normalized Design** - Minimizes data redundancy
- **Referential Integrity** - Foreign key constraints
- **Audit Trail** - Created/updated timestamps
- **Flexible Schema** - Easy to extend

---

## Entity Relationship Diagram

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │
│ name        │
│ email       │
│ password    │
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
┌──────▼──────┐  ┌────────▼────────┐  ┌──▼──────────┐
│  students   │  │  instructors    │  │ secretaries │
│─────────────│  │─────────────────│  │─────────────│
│ id (PK,FK)  │  │ id (PK,FK)      │  │ id (PK,FK)  │
│ created_at  │  │ created_at      │  └─────────────┘
│ created_by  │  │ created_by      │
│ updated_at  │  │ updated_at      │
└──────┬──────┘  └────────┬────────┘
       │                  │
       │         ┌────────▼────────┐
       │         │    courses      │
       │         │─────────────────│
       │         │ id (PK)         │
       │         │ name            │
       │         │ department      │
       │         │ instructor_id   │
       │         │ created_at      │
       │         │ created_by      │
       │         └────────┬────────┘
       │                  │
       │         ┌────────▼────────┐
       │         │  resit_exams    │
       │         │─────────────────│
       │         │ id (PK)         │
       │         │ course_id (FK)  │
       │         │ instructor_id   │
       │         │ date            │
       │         │ location        │
       │         │ deadline        │
       │         │ announcement    │
       │         └────────┬────────┘
       │                  │
       └──────────────────┴────────────────┐
                                           │
       ┌───────────────────────────────────┤
       │                                   │
┌──────▼──────────────┐  ┌────────────────▼──────────┐
│ course_students     │  │ resit_exam_students       │
│─────────────────────│  │───────────────────────────│
│ course_id (PK,FK)   │  │ resit_exam_id (PK,FK)     │
│ student_id (PK,FK)  │  │ student_id (PK,FK)        │
└─────────────────────┘  └───────────────────────────┘

┌─────────────────────────┐
│ student_course_grades   │
│─────────────────────────│
│ student_id (PK,FK)      │
│ course_id (PK,FK)       │
│ grade                   │
│ letter_grade            │
└─────────────────────────┘
```

---

## Tables

### users

Base table for all system users.

```sql
CREATE TABLE users (
    id       VARCHAR(255) PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique user identifier |
| name | VARCHAR(255) | NOT NULL | User's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password | VARCHAR(255) | NOT NULL | User's password (plain text - recommend bcrypt) |

**Notes:**
- All user types (students, instructors, secretaries) have an entry here
- Email must be unique across all users
- ⚠️ Passwords are currently plain text - implement bcrypt hashing

---

### students

Student-specific information.

```sql
CREATE TABLE students (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | References users.id |
| created_at | TIMESTAMP | NOT NULL | When student was created |
| created_by | VARCHAR(255) | NOT NULL | Who created the student |
| updated_at | TIMESTAMP | NULL | Last update timestamp |

---

### instructors

Instructor-specific information.

```sql
CREATE TABLE instructors (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | References users.id |
| created_at | TIMESTAMP | NOT NULL | When instructor was created |
| created_by | VARCHAR(255) | NOT NULL | Who created the instructor |
| updated_at | TIMESTAMP | NULL | Last update timestamp |

---

### secretaries

Secretary-specific information.

```sql
CREATE TABLE secretaries (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | References users.id |

---

### courses

Course information.

```sql
CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique course identifier (e.g., CS101) |
| name | VARCHAR(255) | NOT NULL | Course name |
| department | VARCHAR(255) | NOT NULL | Department offering the course |
| instructor_id | VARCHAR(255) | FOREIGN KEY | Assigned instructor |
| created_at | TIMESTAMP | NOT NULL | When course was created |
| created_by | VARCHAR(255) | NOT NULL | Who created the course |

---

### resit_exams

Resit exam information.

```sql
CREATE TABLE resit_exams (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(255) NOT NULL,
    date TIMESTAMP,
    location VARCHAR(255),
    deadline TIMESTAMP,
    announcement TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id)
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(255) | PRIMARY KEY | Unique resit exam identifier |
| course_id | VARCHAR(255) | FOREIGN KEY, NOT NULL | Associated course |
| instructor_id | VARCHAR(255) | FOREIGN KEY, NOT NULL | Instructor managing the exam |
| date | TIMESTAMP | NULL | Exam date and time |
| location | VARCHAR(255) | NULL | Exam location |
| deadline | TIMESTAMP | NULL | Registration deadline |
| announcement | TEXT | NULL | Exam announcement/instructions |

---

### course_students

Many-to-many relationship between courses and students.

```sql
CREATE TABLE course_students (
    course_id VARCHAR(255),
    student_id VARCHAR(255),
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| course_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Course identifier |
| student_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Student identifier |

---

### resit_exam_students

Many-to-many relationship between resit exams and students.

```sql
CREATE TABLE resit_exam_students (
    resit_exam_id VARCHAR(255),
    student_id VARCHAR(255),
    PRIMARY KEY (resit_exam_id, student_id),
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| resit_exam_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Resit exam identifier |
| student_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Student identifier |

---

### student_course_grades

Student grades for courses.

```sql
CREATE TABLE student_course_grades (
    student_id VARCHAR(255),
    course_id VARCHAR(255),
    grade INTEGER,
    letter_grade VARCHAR(2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| student_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Student identifier |
| course_id | VARCHAR(255) | PRIMARY KEY, FOREIGN KEY | Course identifier |
| grade | INTEGER | NULL | Numeric grade (0-100) |
| letter_grade | VARCHAR(2) | NULL | Letter grade (A, B, C, D, F) |

**Grade Mapping:**
- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: 0-59

---

## Relationships

### One-to-Many

- **users → students**: One user entry per student
- **users → instructors**: One user entry per instructor
- **users → secretaries**: One user entry per secretary
- **instructors → courses**: One instructor can teach multiple courses
- **courses → resit_exams**: One course can have multiple resit exams
- **instructors → resit_exams**: One instructor can manage multiple resit exams

### Many-to-Many

- **courses ↔ students**: Students can enroll in multiple courses, courses can have multiple students
- **resit_exams ↔ students**: Students can register for multiple resit exams, resit exams can have multiple students

---

## Indexes

### Primary Keys (Automatic Indexes)

- `users.id`
- `students.id`
- `instructors.id`
- `secretaries.id`
- `courses.id`
- `resit_exams.id`
- `(course_students.course_id, course_students.student_id)`
- `(resit_exam_students.resit_exam_id, resit_exam_students.student_id)`
- `(student_course_grades.student_id, student_course_grades.course_id)`

### Foreign Keys (Automatic Indexes)

- `students.id → users.id`
- `instructors.id → users.id`
- `secretaries.id → users.id`
- `courses.instructor_id → instructors.id`
- `resit_exams.course_id → courses.id`
- `resit_exams.instructor_id → instructors.id`

### Recommended Additional Indexes

```sql
-- For faster email lookups
CREATE INDEX idx_users_email ON users(email);

-- For faster course lookups by instructor
CREATE INDEX idx_courses_instructor ON courses(instructor_id);

-- For faster resit exam lookups by course
CREATE INDEX idx_resit_exams_course ON resit_exams(course_id);
```

---

## Sample Data

### Users

```sql
INSERT INTO users VALUES
('stu-001', 'John Doe', 'john@university.edu', 'password123'),
('stu-002', 'Jane Smith', 'jane@university.edu', 'password123'),
('inst-001', 'Dr. Alice Johnson', 'alice@university.edu', 'password123'),
('inst-002', 'Prof. Bob Williams', 'bob@university.edu', 'password123'),
('sec-001', 'Admin User', 'admin@university.edu', 'password123');
```

### Students

```sql
INSERT INTO students VALUES
('stu-001', '2024-01-01 10:00:00', 'sec-001', NULL),
('stu-002', '2024-01-01 10:05:00', 'sec-001', NULL);
```

### Instructors

```sql
INSERT INTO instructors VALUES
('inst-001', '2024-01-01 09:00:00', 'sec-001', NULL),
('inst-002', '2024-01-01 09:05:00', 'sec-001', NULL);
```

### Secretaries

```sql
INSERT INTO secretaries VALUES
('sec-001');
```

### Courses

```sql
INSERT INTO courses VALUES
('CS101', 'Introduction to Programming', 'Computer Science', 'inst-001', '2024-01-01 08:00:00', 'sec-001'),
('CS102', 'Data Structures', 'Computer Science', 'inst-001', '2024-01-01 08:05:00', 'sec-001'),
('MATH201', 'Calculus I', 'Mathematics', 'inst-002', '2024-01-01 08:10:00', 'sec-001');
```

### Course Enrollments

```sql
INSERT INTO course_students VALUES
('CS101', 'stu-001'),
('CS102', 'stu-001'),
('CS101', 'stu-002'),
('MATH201', 'stu-002');
```

### Grades

```sql
INSERT INTO student_course_grades VALUES
('stu-001', 'CS101', 45, 'F'),
('stu-001', 'CS102', 85, 'B'),
('stu-002', 'CS101', 92, 'A'),
('stu-002', 'MATH201', 55, 'F');
```

### Resit Exams

```sql
INSERT INTO resit_exams VALUES
('resit-CS101-001', 'CS101', 'inst-001', '2024-06-15 10:00:00', 'Room 101', '2024-06-10 23:59:59', 'Bring your student ID'),
('resit-MATH201-001', 'MATH201', 'inst-002', '2024-06-16 14:00:00', 'Room 202', '2024-06-11 23:59:59', 'Calculator allowed');
```

### Resit Exam Enrollments

```sql
INSERT INTO resit_exam_students VALUES
('resit-CS101-001', 'stu-001'),
('resit-MATH201-001', 'stu-002');
```

---

## Database Migrations

### Initial Setup

```bash
# Run migrations
npm run migrate

# Or manually
sqlite3 resit.db < datastore/sql/migrations/001-initial.sql
```

### Backup

```bash
# Backup database
sqlite3 resit.db ".backup resit_backup.db"

# Or
cp resit.db resit_backup_$(date +%Y%m%d).db
```

### Reset Database

```bash
# Delete and recreate
rm resit.db
npm run migrate
```

---

## Query Examples

### Get all students in a course

```sql
SELECT u.id, u.name, u.email
FROM users u
JOIN students s ON u.id = s.id
JOIN course_students cs ON s.id = cs.student_id
WHERE cs.course_id = 'CS101';
```

### Get student's courses with grades

```sql
SELECT c.id, c.name, c.department, scg.grade, scg.letter_grade
FROM courses c
JOIN student_course_grades scg ON c.id = scg.course_id
WHERE scg.student_id = 'stu-001';
```

### Get instructor's resit exams

```sql
SELECT re.id, c.name as course_name, re.date, re.location
FROM resit_exams re
JOIN courses c ON re.course_id = c.id
WHERE re.instructor_id = 'inst-001';
```

### Get students enrolled in resit exam

```sql
SELECT u.id, u.name, u.email
FROM users u
JOIN students s ON u.id = s.id
JOIN resit_exam_students res ON s.id = res.student_id
WHERE res.resit_exam_id = 'resit-CS101-001';
```

---

**For more information, see:**
- [API Documentation](./README.md)
- [Quick Reference](./QUICK_REFERENCE.md)
