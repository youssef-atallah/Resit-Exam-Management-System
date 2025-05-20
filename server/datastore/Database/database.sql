-- SQLITE DATABASE FOR REX
-- faculty secretary table
CREATE TABLE FacultySecretary (
    FacultySecretaryId INTEGER PRIMARY KEY,
    FacultySecretarySpecialId TEXT UNIQUE,
    FacultySecretaryName TEXT NOT NULL,
    FacultySecretaryEmail TEXT NOT NULL UNIQUE,
    FacultySecretaryPassword TEXT NOT NULL
);

-- faculty secretary creates student 
CREATE TABLE Student (
    StudentId INTEGER PRIMARY KEY,
    StudentName TEXT NOT NULL,
    StudentEmail TEXT NOT NULL UNIQUE,
    StudentPassword TEXT NOT NULL,
    StudentCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    StudentUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FacultySecretaryId INTEGER,
    FOREIGN KEY (FacultySecretaryId) REFERENCES FacultySecretary(FacultySecretaryId) ON DELETE CASCADE
);

-- faculty secretary creates instructor 
CREATE TABLE Instructor (
    InstructorId INTEGER PRIMARY KEY,
    InstructorName TEXT NOT NULL,
    InstructorEmail TEXT NOT NULL UNIQUE,
    InstructorPassword TEXT NOT NULL,
    InstructorCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    InstructorUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FacultySecretaryId INTEGER,
    FOREIGN KEY (FacultySecretaryId) REFERENCES FacultySecretary(FacultySecretaryId) ON DELETE CASCADE
);

-- FacultySecretary belongs to a Faculty
CREATE TABLE Faculty (
    FacultyId INTEGER PRIMARY KEY,
    FacultyName TEXT NOT NULL,
    FacultySecretaryId INTEGER,
    FOREIGN KEY (FacultySecretaryId) REFERENCES FacultySecretary(FacultySecretaryId) ON DELETE CASCADE
);

-- Department belongs to a Faculty
CREATE TABLE Department (
    DepartmentId INTEGER PRIMARY KEY,
    DepartmentName TEXT NOT NULL,
    FacultyId INTEGER,
    FOREIGN KEY (FacultyId) REFERENCES Faculty(FacultyId) ON DELETE CASCADE
);

-- course created by faculty secretary and name, code, instructor, department etc..
CREATE TABLE Course (
    CourseId INTEGER PRIMARY KEY,
    CourseCode TEXT NOT NULL,
    CourseName TEXT NOT NULL,
    InstructorId INTEGER,
    DepartmentId INTEGER,
    CourseCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    CourseUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FacultySecretaryId INTEGER,
    FOREIGN KEY (InstructorId) REFERENCES Instructor(InstructorId) ON DELETE CASCADE,
    FOREIGN KEY (DepartmentId) REFERENCES Department(DepartmentId) ON DELETE CASCADE,
    FOREIGN KEY (FacultySecretaryId) REFERENCES FacultySecretary(FacultySecretaryId) ON DELETE CASCADE
);

-- students can enroll in many courses and vice versa, grade is here too.
CREATE TABLE Enroll (
    StudentId INTEGER,
    CourseId INTEGER,
    EnrollGrade INTEGER NULL,
    EnrollLetterGrade TEXT NULL,
    PRIMARY KEY (StudentId, CourseId),
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Course(CourseId) ON DELETE CASCADE
);

-- can be created by Instructor 
CREATE TABLE ResitExam (
    ResitExamId INTEGER PRIMARY KEY,
    ResitExamName TEXT,
    CourseId INTEGER , 
    ResitExamDate DATE,
    ResitExamTime TIME,
    ResitExamDeadline DATETIME,
    ResitExamAllowedLetters TEXT, -- letters separated by commas like "AA,AB,BB,BC,CC,FF"
    ResitExamCreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResitExamUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResitExamCreatedBy INTEGER, -- id of Instructor
    FOREIGN KEY (ResitExamCreatedBy) REFERENCES Instructor(InstructorId) ON DELETE CASCADE
);

-- enroll doesn't have an id, it's a composite key of (studentId, courseId)
CREATE TABLE ResitExamApplication (
    ResitExamApplicationId INTEGER PRIMARY KEY,
    ResitExamApplicationUpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ResitExamId INTEGER,
    StudentId INTEGER,
    CourseId INTEGER,
    Status TEXT DEFAULT 'Pending' CHECK (Status IN ('Pending', 'Mandatory', 'Approved', 'Rejected')),
	UNIQUE (ResitExamId, StudentId, CourseId),
    FOREIGN KEY (StudentId) REFERENCES Student(StudentId) ON DELETE CASCADE,
    FOREIGN KEY (CourseId) REFERENCES Course(CourseId) ON DELETE CASCADE,
    FOREIGN KEY (ResitExamId) REFERENCES ResitExam(ResitExamId) ON DELETE CASCADE
);

-- if the ResitExamApplication status is "Mandatory" or "Approved", student gets to attend the exam
CREATE TABLE ResitExamEnroll (
    ResitExamEnrollId INTEGER PRIMARY KEY,
    ResitExamApplicationId INTEGER UNIQUE, -- a student can apply only once prevents duplication
    ResitExamEnrollGrade INTEGER,
    ResitExamEnrollLetterGrade TEXT,
    Status TEXT DEFAULT 'Not Attended' CHECK (Status IN ('Attended', 'Not Attended')),
    FOREIGN KEY (ResitExamApplicationId) REFERENCES ResitExamApplication(ResitExamApplicationId) ON DELETE CASCADE
);

-- name of the exam hall
CREATE TABLE ExamHall (
    ExamHallId INTEGER PRIMARY KEY,
    ExamHallName TEXT NOT NULL UNIQUE
);

-- links exam halls and resit exams
CREATE TABLE AssignedExamHall (
    AssignedExamHallId INTEGER PRIMARY KEY,
    ExamHallId INTEGER,
    ResitExamId INTEGER,
    FOREIGN KEY (ExamHallId) REFERENCES ExamHall(ExamHallId) ON DELETE CASCADE,
    FOREIGN KEY (ResitExamId) REFERENCES ResitExam(ResitExamId) ON DELETE CASCADE
);


	
-- TRIGGERS 

    -- UPDATED AT TRIGGERS

-- update trigger for Student table
CREATE TRIGGER UpdateStudentUpdatedAt
AFTER UPDATE ON Student
FOR EACH ROW
BEGIN
    UPDATE Student
    SET StudentUpdatedAt = CURRENT_TIMESTAMP
    WHERE StudentId = OLD.StudentId;
END;

-- update trigger for Instructor table
CREATE TRIGGER UpdateInstructorUpdatedAt
AFTER UPDATE ON Instructor
FOR EACH ROW
BEGIN
    UPDATE Instructor
    SET InstructorUpdatedAt = CURRENT_TIMESTAMP
    WHERE InstructorId = OLD.InstructorId;
END;

-- update trigger ffor Course table
CREATE TRIGGER UpdateCourseUpdatedAt
AFTER UPDATE ON Course
FOR EACH ROW
BEGIN
    UPDATE Course
    SET CourseUpdatedAt = CURRENT_TIMESTAMP
    WHERE CourseId = OLD.CourseId;
END;

-- update trigger for ResitExam table
CREATE TRIGGER UpdateResitExamUpdatedAt
AFTER UPDATE ON ResitExam
FOR EACH ROW
BEGIN
    UPDATE ResitExam
    SET ResitExamUpdatedAt = CURRENT_TIMESTAMP
    WHERE ResitExamId = OLD.ResitExamId;
END;

-- update trigger f ResitExamApplication table
CREATE TRIGGER UpdateResitExamApplicationUpdatedAt
AFTER UPDATE ON ResitExamApplication
FOR EACH ROW
BEGIN
    UPDATE ResitExamApplication
    SET ResitExamApplicationUpdatedAt = CURRENT_TIMESTAMP
    WHERE ResitExamApplicationId = OLD.ResitExamApplicationId;
END;

    -- AUTO ASSIGN LETTER GRADE TRIGGERS

-- Trigger for Enroll table (INSERT)
CREATE TRIGGER SetEnrollLetterGradeInsert
AFTER INSERT ON Enroll
FOR EACH ROW
WHEN NEW.EnrollGrade IS NOT NULL
BEGIN
    UPDATE Enroll
    SET EnrollLetterGrade = 
        CASE 
            WHEN NEW.EnrollGrade >= 90 THEN 'AA'
            WHEN NEW.EnrollGrade >= 85 THEN 'AB'
            WHEN NEW.EnrollGrade >= 80 THEN 'BB'
            WHEN NEW.EnrollGrade >= 75 THEN 'BC'
            WHEN NEW.EnrollGrade >= 70 THEN 'CC'
            WHEN NEW.EnrollGrade >= 60 THEN 'DC'
            WHEN NEW.EnrollGrade >= 50 THEN 'DD'
            WHEN NEW.EnrollGrade >= 40 THEN 'FD'
            ELSE 'FF'
        END
    WHERE StudentId = NEW.StudentId AND CourseId = NEW.CourseId;
END;

-- Trigger for Enroll table (UPDATE)
CREATE TRIGGER SetEnrollLetterGradeUpdate
AFTER UPDATE OF EnrollGrade ON Enroll
FOR EACH ROW
WHEN NEW.EnrollGrade IS NOT NULL
BEGIN
    UPDATE Enroll
    SET EnrollLetterGrade = 
        CASE 
            WHEN NEW.EnrollGrade >= 90 THEN 'AA'
            WHEN NEW.EnrollGrade >= 85 THEN 'AB'
            WHEN NEW.EnrollGrade >= 80 THEN 'BB'
            WHEN NEW.EnrollGrade >= 75 THEN 'BC'
            WHEN NEW.EnrollGrade >= 70 THEN 'CC'
            WHEN NEW.EnrollGrade >= 60 THEN 'DC'
            WHEN NEW.EnrollGrade >= 50 THEN 'DD'
            WHEN NEW.EnrollGrade >= 40 THEN 'FD'
            ELSE 'FF'
        END
    WHERE StudentId = NEW.StudentId AND CourseId = NEW.CourseId;
END;

-- Trigger for ResitExamEnroll table (INSERT)
CREATE TRIGGER SetResitExamEnrollLetterGradeInsert
AFTER INSERT ON ResitExamEnroll
FOR EACH ROW
WHEN NEW.ResitExamEnrollGrade IS NOT NULL
BEGIN
    UPDATE ResitExamEnroll
    SET ResitExamEnrollLetterGrade = 
        CASE 
            WHEN NEW.ResitExamEnrollGrade >= 90 THEN 'AA'
            WHEN NEW.ResitExamEnrollGrade >= 85 THEN 'AB'
            WHEN NEW.ResitExamEnrollGrade >= 80 THEN 'BB'
            WHEN NEW.ResitExamEnrollGrade >= 75 THEN 'BC'
            WHEN NEW.ResitExamEnrollGrade >= 70 THEN 'CC'
            WHEN NEW.ResitExamEnrollGrade >= 60 THEN 'DC'
            WHEN NEW.ResitExamEnrollGrade >= 50 THEN 'DD'
            WHEN NEW.ResitExamEnrollGrade >= 40 THEN 'FD'
            ELSE 'FF'
        END
    WHERE ResitExamEnrollId = NEW.ResitExamEnrollId;
END;

-- Trigger for ResitExamEnroll table (UPDATE)
CREATE TRIGGER SetResitExamEnrollLetterGradeUpdate
AFTER UPDATE OF ResitExamEnrollGrade ON ResitExamEnroll
FOR EACH ROW
WHEN NEW.ResitExamEnrollGrade IS NOT NULL
BEGIN
    UPDATE ResitExamEnroll
    SET ResitExamEnrollLetterGrade = 
        CASE 
            WHEN NEW.ResitExamEnrollGrade >= 90 THEN 'AA'
            WHEN NEW.ResitExamEnrollGrade >= 85 THEN 'AB'
            WHEN NEW.ResitExamEnrollGrade >= 80 THEN 'BB'
            WHEN NEW.ResitExamEnrollGrade >= 75 THEN 'BC'
            WHEN NEW.ResitExamEnrollGrade >= 70 THEN 'CC'
            WHEN NEW.ResitExamEnrollGrade >= 60 THEN 'DC'
            WHEN NEW.ResitExamEnrollGrade >= 50 THEN 'DD'
            WHEN NEW.ResitExamEnrollGrade >= 40 THEN 'FD'
            ELSE 'FF'
        END
    WHERE ResitExamEnrollId = NEW.ResitExamEnrollId;
END;

-- triggers for auto apply to resit exam if the grade letter is ff or fd
-- Insert Enroll FD or FF
CREATE TRIGGER AutoApplyResitAfterEnrollInsert
AFTER INSERT ON Enroll
FOR EACH ROW
WHEN NEW.EnrollGrade IS NOT NULL AND 
    (
        (NEW.EnrollGrade >= 40 AND NEW.EnrollGrade < 50) OR 
        (NEW.EnrollGrade < 40)
    )
BEGIN
    -- Insert application if it doesn’t already exist
    INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
    SELECT ResitExamId, NEW.StudentId, NEW.CourseId, 'Mandatory'
    FROM ResitExam
    WHERE CourseId = NEW.CourseId
    AND NOT EXISTS (
        SELECT 1
        FROM ResitExamApplication A
        WHERE A.StudentId = NEW.StudentId 
          AND A.CourseId = NEW.CourseId
    )
    ORDER BY ResitExamDeadline DESC
    LIMIT 1;

    -- Insert enroll if application exists and no enroll record yet
    INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
    SELECT ResitExamApplicationId, 'Not Attended'
    FROM ResitExamApplication
    WHERE StudentId = NEW.StudentId
      AND CourseId = NEW.CourseId
      AND Status = 'Mandatory'
    AND NOT EXISTS (
        SELECT 1 FROM ResitExamEnroll
        WHERE ResitExamApplicationId = ResitExamApplication.ResitExamApplicationId
    )
    ORDER BY ResitExamApplicationId DESC
    LIMIT 1;
END;

-- Update enroll FD or FF
CREATE TRIGGER AutoApplyResitAfterEnrollUpdate
AFTER UPDATE OF EnrollGrade ON Enroll
FOR EACH ROW
WHEN NEW.EnrollGrade IS NOT NULL AND 
    (
        (NEW.EnrollGrade >= 40 AND NEW.EnrollGrade < 50) OR 
        (NEW.EnrollGrade < 40)
    )
BEGIN
    -- Insert application if it doesn’t already exist
    INSERT INTO ResitExamApplication (ResitExamId, StudentId, CourseId, Status)
    SELECT ResitExamId, NEW.StudentId, NEW.CourseId, 'Mandatory'
    FROM ResitExam
    WHERE CourseId = NEW.CourseId
    AND NOT EXISTS (
        SELECT 1
        FROM ResitExamApplication A
        WHERE A.StudentId = NEW.StudentId 
          AND A.CourseId = NEW.CourseId
    )
    ORDER BY ResitExamDeadline DESC
    LIMIT 1;

    -- Insert enroll if application exists and no enroll record yet
    INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
    SELECT ResitExamApplicationId, 'Not Attended'
    FROM ResitExamApplication
    WHERE StudentId = NEW.StudentId
      AND CourseId = NEW.CourseId
      AND Status = 'Mandatory'
    AND NOT EXISTS (
        SELECT 1 FROM ResitExamEnroll
        WHERE ResitExamApplicationId = ResitExamApplication.ResitExamApplicationId
    )
    ORDER BY ResitExamApplicationId DESC
    LIMIT 1;
END;


-- when ResitExamApplication is accepted, add Student to ResitExamEnroll
-- insert
CREATE TRIGGER AutoEnrollAfterApplicationInsert
AFTER INSERT ON ResitExamApplication
FOR EACH ROW
WHEN NEW.Status IN ('Approved', 'Mandatory')
BEGIN
    INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
    VALUES (NEW.ResitExamApplicationId, 'Not Attended');
END;

-- update
CREATE TRIGGER AutoEnrollAfterApplicationUpdate
AFTER UPDATE OF Status ON ResitExamApplication
FOR EACH ROW
WHEN NEW.Status IN ('Approved', 'Mandatory')
     AND NOT EXISTS (
         SELECT 1 FROM ResitExamEnroll
         WHERE ResitExamApplicationId = NEW.ResitExamApplicationId
     )
BEGIN
    INSERT INTO ResitExamEnroll (ResitExamApplicationId, Status)
    VALUES (NEW.ResitExamApplicationId, 'Not Attended');
END;

--when removed from the ResitExamEnroll reject the application from ResitExamApplication
CREATE TRIGGER RejectApplicationOnEnrollDelete
AFTER DELETE ON ResitExamEnroll
FOR EACH ROW
BEGIN
    UPDATE ResitExamApplication
    SET Status = 'Rejected'
    WHERE ResitExamApplicationId = OLD.ResitExamApplicationId;
END;

-- remove student's ResitExamEnroll and ResitExamApplication after updating student's grade above 50 (means its not ff or fd anymore || not mandatory for student anymore) 
CREATE TRIGGER DeleteResitApplicationAfterPassing
AFTER UPDATE OF EnrollGrade ON Enroll
FOR EACH ROW
WHEN NEW.EnrollGrade > 50
BEGIN
    DELETE FROM ResitExamApplication -- on delete cascade will delete RestExamEnroll too
    WHERE StudentId = NEW.StudentId
      AND CourseId = NEW.CourseId
      AND Status = 'Mandatory';
END;

-- after creating inserting grade informating to ResitExamEnroll which means Student attended to resitExam make status: 'Not Attended' to 'Attended'
CREATE TRIGGER UpdateResitExamEnrollStatusAfterUpdateGrade
AFTER UPDATE OF ResitExamEnrollGrade ON ResitExamEnroll
FOR EACH ROW
WHEN NEW.ResitExamEnrollGrade IS NOT NULL
BEGIN
    UPDATE ResitExamEnroll 
    SET Status = 'Attended' 
    WHERE ResitExamEnrollId = NEW.ResitExamEnrollId;
END;
