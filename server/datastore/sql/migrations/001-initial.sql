-- User table
CREATE TABLE users (
    id       VARCHAR(255) PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Secretary table (inherits from User)
CREATE TABLE secretaries (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

-- Instructor table (inherits from User)
CREATE TABLE instructors (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP
    
);

-- Student table (inherits from User)
CREATE TABLE students (
    id VARCHAR(255) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP
);

-- Course table
CREATE TABLE courses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP,
    resit_exam_id VARCHAR(255),
    FOREIGN KEY (instructor_id) REFERENCES instructors(id),
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE
);

-- ResitExam table
CREATE TABLE resit_exams (
    id VARCHAR(255) PRIMARY KEY,
    course_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    announcement TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- StudentCourseGrade table
CREATE TABLE student_course_grades (
    student_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    grade NUMERIC,
    grade_letter VARCHAR(10),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Join table: course_students (many-to-many)
CREATE TABLE course_students (
    course_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (course_id, student_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Join table: resit_exam_students (many-to-many)
CREATE TABLE resit_exam_students (
    resit_exam_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (resit_exam_id, student_id),
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Join table: resit_exam_instructors (many-to-many)
CREATE TABLE resit_exam_instructors (
    resit_exam_id VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(255) NOT NULL,
    PRIMARY KEY (resit_exam_id, instructor_id),
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE CASCADE
);

-- ResitExam lettersAllowed (as a separate table)
CREATE TABLE resit_exam_letters_allowed (
    resit_exam_id VARCHAR(255) NOT NULL,
    letter VARCHAR(10) NOT NULL,
    PRIMARY KEY (resit_exam_id, letter),
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE
);

-- ResitExamApplication table
CREATE TABLE resit_exam_application (
    id VARCHAR(255) PRIMARY KEY,
    resit_exam_id VARCHAR(255) NOT NULL,
    student_id VARCHAR(255) NOT NULL,
    course_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Mandatory', 'Approved', 'Rejected')),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (resit_exam_id) REFERENCES resit_exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ResitExamEnroll table
CREATE TABLE resit_exam_enroll (
    id VARCHAR(255) PRIMARY KEY,
    resit_exam_application_id VARCHAR(255) NOT NULL UNIQUE,
    grade INTEGER,
    grade_letter VARCHAR(10),
    status VARCHAR(20) DEFAULT 'Not Attended' CHECK (status IN ('Attended', 'Not Attended')),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    FOREIGN KEY (resit_exam_application_id) REFERENCES resit_exam_application(id) ON DELETE CASCADE
);

CREATE TRIGGER delete_user_when_student_deleted
AFTER DELETE ON students
FOR EACH ROW
BEGIN
  DELETE FROM users WHERE id = OLD.id;
END;

CREATE TRIGGER delete_user_when_instructor_deleted
AFTER DELETE ON instructors
FOR EACH ROW
BEGIN
  DELETE FROM users WHERE id = OLD.id;
END;

CREATE TRIGGER delete_user_when_secretary_deleted
AFTER DELETE ON secretaries
FOR EACH ROW
BEGIN
  DELETE FROM users WHERE id = OLD.id;
END; 