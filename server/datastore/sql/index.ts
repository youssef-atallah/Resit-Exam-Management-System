import { Course, Instructor, ResitExam, ResitExamResponse, Student, StudentCourseDetails, Secretary } from '../../types';
import { InstructorCourseDetails } from '../../types/instructor';
import { Datastore } from '../index';

// sqlite3 is a module for sqlite3 database
import sqlite3 from 'sqlite3'
import { open as sqliteOpen, Database, Statement } from 'sqlite' // open is a function that opens a database
import path from 'path'

export class SqlDatastore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>; // Store the db connection

  public async openDb() {
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'uskudar.sqlite'),
      driver: sqlite3.Database
    });

    // Enable foreign key enforcement
    await this.db.run('PRAGMA foreign_keys = ON');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations')
    });

    return this; // Return the SqlDatastore instance
  }

  // --- Course Methods ---
  async createCourse(course: Course): Promise<void> {
    const createdAt = new Date().toISOString();
    await this.db.run(
      `INSERT INTO courses (id, name, department, instructor_id, created_at, created_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        course.id,
        course.name,
        course.department,
        course.instructor_id,
        createdAt,
        course.createdBy,
        course.updatedAt
      ]
    );
  }
  
  async getCourseById(id: string): Promise<Course | undefined> {
    const course = await this.db.get('SELECT * FROM courses WHERE id = ?', [id]);
    return course;
  }
  async getCourseInstructor(id: string): Promise<string | undefined> {
    const row = await this.db.get('SELECT instructor_id FROM courses WHERE id = ?', [id]);
    return row?.instructor_id;
  }
  async listCourseStudents(id: string): Promise<string[] | undefined> {
    const rows = await this.db.all('SELECT student_id FROM course_students WHERE course_id = ?', [id]);
    return rows.map((row: any) => row.student_id);
  }
  async deleteCourse(id: string, secretaryId: string): Promise<void> {
    await this.db.run(`DELETE FROM courses WHERE id = ?`, [id]);
  }
  async updateCourse(id: string, name: string, instructor: string, department: string, secretaryId: string): Promise<void> {
    await this.db.run(
      `UPDATE courses SET name = ?, instructor_id = ?, department = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, instructor, department, id]
    );
  }
  async listCourses(): Promise<Course[] | undefined> {
    const courses = await this.db.all('SELECT * FROM courses');
    return courses;
  }


  // --- Student Methods ---
  async createStudent(student: Student): Promise<void> {
    await this.db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
      [student.id, student.name, student.email, student.password]
    );
    const now = new Date().toISOString();
    await this.db.run(
      `INSERT INTO students (id, created_at, created_by, updated_at) VALUES (?, ?, ?, ?)`,
      [student.id, now, student.createdBy, student.updatedAt]
    );
  }
  async getAstudent(id: string): Promise<Student | undefined> {
    // Join students and users to get all fields
    const student = await this.db.get(
      `SELECT students.*, users.name, users.email, users.password
       FROM students
       JOIN users ON students.id = users.id
       WHERE students.id = ?`, [id]);
    if (!student) {
      return undefined;
    }
    // Get the student's courses
    const coursesRows = await this.db.all('SELECT course_id FROM course_students WHERE student_id = ?', [id]);
    const courses = coursesRows.map((row: any) => row.course_id);
    // Get the student's resit exams
    const resitExamRows = await this.db.all('SELECT resit_exam_id FROM resit_exam_students WHERE student_id = ?', [id]);
    const resitExams = resitExamRows.map((row: any) => row.resit_exam_id);
    return {
      ...student,
      courses: courses || [],
      resitExams: resitExams || []
    };
  }
  async getStudentCourses(id: string): Promise<string[] | undefined> {
    const rows = await this.db.all('SELECT course_id FROM course_students WHERE student_id = ?', [id]);
    return rows.map((row: any) => row.course_id);
  }
  async getStudentCourseDetails(id: string): Promise<StudentCourseDetails[] | undefined> {
    try {
        const rows = await this.db.all(
            `SELECT 
                c.id as courseId,
                c.name as courseName,
                c.department,
                c.instructor_id,
                scg.grade,
                scg.grade_letter,
                re.id as resit_exam_id,
                re.deadline as resit_deadline
            FROM course_students cs
            JOIN courses c ON cs.course_id = c.id
            LEFT JOIN student_course_grades scg ON cs.student_id = scg.student_id AND cs.course_id = scg.course_id
            LEFT JOIN resit_exams re ON c.id = re.course_id
            WHERE cs.student_id = ?`, [id]);

        if (!rows || rows.length === 0) {
            return undefined;
        }

        return rows.map(row => ({
            courseId: row.courseId,
            courseName: row.courseName,
            department: row.department,
            instructor_id: row.instructor_id,
            schedule: '', // Default empty string since column doesn't exist
            location: '', // Default empty string since column doesn't exist
            grade: row.grade,
            gradeLetter: row.grade_letter,
            resit_exam: row.resit_exam_id ? {
                id: row.resit_exam_id,
                deadline: row.resit_deadline,
                status: 'pending' // Default status since column doesn't exist
            } : undefined
        }));
    } catch (error) {
        console.error('Error in getStudentCourseDetails:', error);
        throw error;
    }
  }
  async deleteStudent(id: string, secretaryID: string): Promise<void> {
    // Delete from students table - this will cascade to users table due to ON DELETE CASCADE
    await this.db.run(`DELETE FROM students WHERE id = ?`, [id]);
  }
  async updateStudentInfo(id: string, name: string, email: string, password: string, secretaryId: string): Promise<void> {
    await this.db.run(
      `UPDATE students SET name = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, email, password, id]
    );
  }
  async addCourseToStudent(studentId: string, courseId: string, grade: number | null, gradeLetter: string | null): Promise<boolean> {
    try {
      // First check if the course is already assigned
      const existingCourse = await this.db.get(
        `SELECT * FROM course_students 
         WHERE student_id = ? AND course_id = ?`,
        [studentId, courseId]
      );

      if (existingCourse) {
        return false;
      }

      // Start a transaction
      await this.db.run('BEGIN TRANSACTION');

      try {
        // Insert into course_students table
        const courseResult = await this.db.run(
          `INSERT INTO course_students (student_id, course_id)
           VALUES (?, ?)`,
          [studentId, courseId]
        );

        // If grade is provided, insert into student_course_grades table
        if (grade !== null || gradeLetter !== null) {
          await this.db.run(
            `INSERT INTO student_course_grades (student_id, course_id, grade, grade_letter)
             VALUES (?, ?, ?, ?)`,
            [studentId, courseId, grade, gradeLetter]
          );
        }

        // Commit the transaction
        await this.db.run('COMMIT');
        return (courseResult.changes ?? 0) > 0;
      } catch (error) {
        // Rollback in case of error
        await this.db.run('ROLLBACK');
        throw error;
      }
    } catch (error) {
      console.error('Error in addCourseToStudent:', error);
      throw error;
    }
  }
  async removeStudentFromCourse(studentId: string, courseId: string, secretaryId: string): Promise<void> {
    await this.db.run(`DELETE FROM course_students WHERE student_id = ? AND course_id = ?`, [studentId, courseId]);
  }
  async addRistExamToStudent(studentId: string, resitExamId: string): Promise<boolean> {
    const result = await this.db.run(
      `INSERT INTO resit_exam_students (student_id, resit_exam_id)
       VALUES (?, ?)`,
      [studentId, resitExamId]
    );
    return (result.changes ?? 0) > 0;
  }
  async removeStudentFromResitExam(studentId: string, resitExamId: string): Promise<void> {
    await this.db.run(`DELETE FROM resit_exam_students WHERE student_id = ? AND resit_exam_id = ?`, [studentId, resitExamId]);
  }
  async listStudents(): Promise<Student[] | undefined> {
    const students = await this.db.all('SELECT * FROM students');
    return students;
  }


  // --- Instructor Methods ---
  async createInstructor(instructor: Instructor): Promise<void> {
    await this.db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
      [instructor.id, instructor.name, instructor.email, instructor.password]
    );
    await this.db.run(
      `INSERT INTO instructors (id, created_at, created_by, updated_at) VALUES (?, ?, ?, ?)`,
      [instructor.id, instructor.createdAt, instructor.createdBy, instructor.updatedAt]
    );
  }
  async getInstructorById(id: string): Promise<Instructor | undefined> {
    // Join instructors and users to get all fields
    const instructor = await this.db.get(
      `SELECT instructors.*, users.name, users.email, users.password
       FROM instructors
       JOIN users ON instructors.id = users.id
       WHERE instructors.id = ?`, [id]);
    if (!instructor) {
      return undefined;
    }
    // Get the instructor's courses
    const coursesRows = await this.db.all('SELECT id FROM courses WHERE instructor_id = ?', [id]);
    const courses = coursesRows.map((row: any) => row.id);
    // Get the instructor's resit exams
    const resitExamRows = await this.db.all('SELECT resit_exam_id FROM resit_exam_instructors WHERE instructor_id = ?', [id]);
    const resitExams = resitExamRows.map((row: any) => row.resit_exam_id);
    return {
      ...instructor,
      courses: courses || [],
      resitExams: resitExams || []
    };
  }
  async getInsturctorCourses(id: string): Promise<string[] | undefined> {
    const rows = await this.db.all('SELECT id FROM courses WHERE instructor_id = ?', [id]);
    return rows.map((row: any) => row.id);
  }

  async getInstructorCourseDetails(id: string): Promise<InstructorCourseDetails[] | undefined> {
    const rows = await this.db.all(
      `SELECT 
        c.id as courseId, 
        c.name as courseName, 
        c.department,
        c.instructor_id,
        c.created_at,
        c.created_by,
        c.updated_at,
        cs.student_id as studentId,
        COUNT(cs.student_id) as student_count,
        re.id as resit_exam_id,
        re.name as resit_exam_name,
        re.department as resit_exam_department,
        re.exam_date,
        re.deadline,
        re.location
       FROM courses c
       LEFT JOIN course_students cs ON c.id = cs.course_id
       LEFT JOIN resit_exams re ON c.id = re.course_id
       WHERE c.instructor_id = ?
       GROUP BY c.id`, [id]);

    // Group students by course
    const detailsMap: { [courseId: string]: InstructorCourseDetails } = {};
    for (const row of rows) {
      if (!detailsMap[row.courseId]) {
        detailsMap[row.courseId] = {
          courseId: row.courseId,
          courseName: row.courseName,
          department: row.department,
          instructor_id: row.instructor_id,
          created_at: row.created_at,
          created_by: row.created_by,
          updated_at: row.updated_at,
          student_count: row.student_count || 0,
          students: [],
          resit_exam: row.resit_exam_id ? {
            id: row.resit_exam_id,
            name: row.resit_exam_name,
            department: row.resit_exam_department,
            exam_date: row.exam_date,
            deadline: row.deadline,
            location: row.location
          } : undefined
        };
      }
      if (row.studentId) detailsMap[row.courseId].students.push(row.studentId);
    }
    return Object.values(detailsMap);
  }
  
  async getInstructorResitExams(id: string): Promise<ResitExam[] | undefined> {
    const rows = await this.db.all(
      `SELECT 
        re.*,
        c.name as course_name,
        c.department as course_department,
        c.id as course_id,
        GROUP_CONCAT(DISTINCT cs.student_id) as enrolled_students,
        COUNT(DISTINCT cs.student_id) as enrolled_count
       FROM resit_exams re
       JOIN courses c ON re.course_id = c.id
       LEFT JOIN resit_exam_students cs ON re.id = cs.resit_exam_id
       WHERE c.instructor_id = ?
       GROUP BY re.id`, [id]);

    // Process the enrolled_students string into an array
    return rows.map(row => ({
      ...row,
      enrolled_students: row.enrolled_students ? row.enrolled_students.split(',') : [],
      course: {
        id: row.course_id,
        name: row.course_name,
        department: row.course_department
      }
    }));
  }
  
  async deleteInstructor(id: string, secretaryID: string): Promise<void> {
    await this.db.run(`DELETE FROM instructors WHERE id = ?`, [id]);
  }
  async updateInstructor(id: string, name: string, email: string, password: string, secretaryID: string): Promise<void> {
    await this.db.run(
      `UPDATE instructors SET name = ?, email = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, email, password, id]
    );
  }
  async listInstructors(): Promise<Instructor[] | undefined> {
    const instructors = await this.db.all('SELECT * FROM instructors');
    return instructors;
  }


  // --- Secretary Methods ---
  async createSecretary(secretary: Secretary): Promise<void> {
    await this.db.run(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`,
      [secretary.id, secretary.name, secretary.email, secretary.password]
    );
    await this.db.run(
      `INSERT INTO secretaries (id) VALUES (?)`,
      [secretary.id]
    );
  }
  async getSecretaryById(id: string): Promise<Secretary | undefined> {
    const secretary = await this.db.get('SELECT * FROM secretaries WHERE id = ?', [id]);
    return secretary;
  }
  async getSecretaryByEmail(email: string): Promise<Secretary | undefined> {
    const secretary = await this.db.get('SELECT * FROM secretaries WHERE email = ?', [email]);
    return secretary;
  }


  // --- ResitExam Methods ---
  async createResitExamByInstuctor(resitExamId: string, courseId: string, name: string, department: string, instructorId: string , lettersAllowed: string[]): Promise<void> {
    const createdAt = new Date().toISOString(); // Get the current timestamp
    const createdBy = instructorId; //  instructor
    if (!createdBy) {
        throw new Error("Instructor ID is required to set the created_by field");
    }
    await this.db.run(
      `INSERT INTO resit_exams (id, course_id, name, department, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [resitExamId, courseId, name, department, createdAt, createdBy]
    );

    
    // delete the letters allowed table for the resit exam if it exists before inserting the new ones
    await this.db.run('DELETE FROM resit_exam_letters_allowed WHERE resit_exam_id = ?', [resitExamId]);
    for (const letter of lettersAllowed) {
      await this.db.run('INSERT INTO resit_exam_letters_allowed (resit_exam_id, letter) VALUES (?, ?)', [resitExamId, letter]);
    }
    // update the course to link it with the resit exam
    await this.db.run('UPDATE courses SET resit_exam_id = ? WHERE id = ?', [resitExamId, courseId]);

  }


  async getResitExam(id: string): Promise<ResitExam> {
    const exam = await this.db.get('SELECT * FROM resit_exams WHERE id = ?', [id]);
    return exam;
  }
  async getResitExamsByInstructorId(instructorID: string): Promise<ResitExam[]> {
    const rows = await this.db.all(
      'SELECT re.* FROM resit_exams re JOIN resit_exam_instructors rei ON re.id = rei.resit_exam_id WHERE rei.instructor_id = ?',
      [instructorID]
    );
    return rows;
  }
  async getStudentResitExams(id: string): Promise<ResitExamResponse[]> {
    const rows = await this.db.all(
      `SELECT re.* FROM resit_exams re
       JOIN resit_exam_students res ON re.id = res.resit_exam_id
       WHERE res.student_id = ?`, [id]);
    return rows;
  }
  async getStudentAllResitExamResults(studentId: string): Promise<{ resitExamId: string; grade: number; gradeLetter: string; submittedAt: Date; }[]> {
    const rows = await this.db.all(
      `SELECT re.id as resitExamId, ree.ResitExamEnrollGrade as grade, 
       ree.ResitExamEnrollLetterGrade as gradeLetter, 
       ree.Status as submittedAt
       FROM resit_exam_enroll ree
       JOIN resit_exam_application rea ON ree.ResitExamApplicationId = rea.ResitExamApplicationId
       JOIN resit_exams re ON rea.ResitExamId = re.id
       WHERE rea.StudentId = ?`, [studentId]);
    return rows;
  }
  async getResitExamAllResults(resitExamId: string): Promise<{ studentId: string; grade: number; gradeLetter: string; submittedAt: Date; }[]> {
    const rows = await this.db.all(
      `SELECT rea.StudentId as studentId, 
       ree.ResitExamEnrollGrade as grade, 
       ree.ResitExamEnrollLetterGrade as gradeLetter, 
       ree.Status as submittedAt
       FROM resit_exam_enroll ree
       JOIN resit_exam_application rea ON ree.ResitExamApplicationId = rea.ResitExamApplicationId
       WHERE rea.ResitExamId = ?`, [resitExamId]);
    return rows;
  }
  async getStudentResitExamResults(studentId: string, resitExamId: string): Promise<{ grade: number; gradeLetter: string; submittedAt: Date; } | undefined> {
    const row = await this.db.get(
      `SELECT ree.ResitExamEnrollGrade as grade, 
       ree.ResitExamEnrollLetterGrade as gradeLetter, 
       ree.Status as submittedAt
       FROM resit_exam_enroll ree
       JOIN resit_exam_application rea ON ree.ResitExamApplicationId = rea.ResitExamApplicationId
       WHERE rea.StudentId = ? AND rea.ResitExamId = ?`, [studentId, resitExamId]);
    return row;
  }
  async updateStudentResitExamResults(studentId: string, resitExamId: string, grade: number, gradeLetter: string): Promise<boolean> {
    const result = await this.db.run(
      `UPDATE resit_exam_enroll 
       SET ResitExamEnrollGrade = ?, ResitExamEnrollLetterGrade = ?
       WHERE ResitExamApplicationId IN (
         SELECT ResitExamApplicationId 
         FROM resit_exam_application 
         WHERE StudentId = ? AND ResitExamId = ?
       )`,
      [grade, gradeLetter, studentId, resitExamId]
    );
    return (result.changes ?? 0) > 0;
  }
  async updateAllStudentsResitExamResults(resitExamId: string, results: { studentId: string; grade: number; gradeLetter: string; }[]): Promise<boolean> {
    let allSuccess = true;
    for (const result of results) {
      const res = await this.db.run(
        `UPDATE resit_exam_enroll 
         SET ResitExamEnrollGrade = ?, ResitExamEnrollLetterGrade = ?
         WHERE ResitExamApplicationId IN (
           SELECT ResitExamApplicationId 
           FROM resit_exam_application 
           WHERE StudentId = ? AND ResitExamId = ?
         )`,
        [result.grade, result.gradeLetter, result.studentId, resitExamId]
      );
      if (res.changes === 0) allSuccess = false;
    }
    return allSuccess;
  }

  async deleteResitExam(resitExamId: string): Promise<void> {
    // First, get the course ID to update it later
    const resitExam = await this.db.get('SELECT course_id FROM resit_exams WHERE id = ?', [resitExamId]);
    if (!resitExam) {
      throw new Error('Resit exam not found');
    }

    // Delete in order of dependencies
    // 1. Delete from resit_exam_applications (if exists)
    // await this.db.run('DELETE FROM resit_exam_applications WHERE resit_exam_id = ?', [resitExamId]);
    
    // 2. Delete from resit_exam_enroll (if exists)
    // await this.db.run('DELETE FROM resit_exam_enroll WHERE resit_exam_id = ?', [resitExamId]);
    
    // 3. Delete from resit_exam_students
    await this.db.run('DELETE FROM resit_exam_students WHERE resit_exam_id = ?', [resitExamId]);
    
    // 4. Delete from resit_exam_letters_allowed
    await this.db.run('DELETE FROM resit_exam_letters_allowed WHERE resit_exam_id = ?', [resitExamId]);
    
    // 5. Update the course to remove the resit exam reference
    await this.db.run('UPDATE courses SET resit_exam_id = NULL WHERE id = ?', [resitExam.course_id]);
    
    // 6. Finally, delete the resit exam itself
    await this.db.run('DELETE FROM resit_exams WHERE id = ?', [resitExamId]);
  }

  async updateResitExamBySecretary(resitExamId: string, examDate: Date, deadline: Date, location: string, secretaryId: string): Promise<void> {
    await this.db.run(
      `UPDATE resit_exams SET exam_date = ?, deadline = ?, location = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [examDate, deadline, location, resitExamId]
    );
  }
  async updateResitExamByInstructor(id: string, name: string, instructorID: string, department: string, letters: string[], courseId: string): Promise<void> {
    await this.db.run(
      `UPDATE resit_exams SET name = ?, department = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [name, department, id]
    );
    // Optionally update lettersAllowed table
    await this.db.run('DELETE FROM resit_exam_letters_allowed WHERE resit_exam_id = ?', [id]);
    for (const letter of letters) {
      await this.db.run('INSERT INTO resit_exam_letters_allowed (resit_exam_id, letter) VALUES (?, ?)', [id, letter]);
    }

    // Update the course to link it with the resit exam
    await this.db.run(
      `UPDATE courses SET resit_exam_id = ? WHERE id = ?`,
      [id, courseId]
    );
  }

  // --- Assignment Methods ---
  async assignInstructorToCourse(instructorId: string, courseId: string): Promise<boolean> {
    // Get instructor
    const instructor = await this.db.get('SELECT * FROM instructors WHERE id = ?', [instructorId]);
    if (!instructor) {
      console.error(`Instructor with ID ${instructorId} not found`);
      return false;
    }

    // Get course
    const course = await this.db.get('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      console.error(`Course with ID ${courseId} not found`);
      return false;
    }

    // Check if course already has an instructor
    if (course.instructor_id) {
      console.error(`Course ${courseId} already has an instructor: ${course.instructor_id}`);
      return false;
    }

    // Check if instructor is already assigned to this course
    const instructorCourses = await this.db.all('SELECT id FROM courses WHERE instructor_id = ? AND id = ?', [instructorId, courseId]);
    if (instructorCourses.length > 0) {
      console.error(`Instructor ${instructorId} is already assigned to course ${courseId}`);
      return false;
    }

    // Assign instructor to course
    const updateResult = await this.db.run(
      'UPDATE courses SET instructor_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [instructorId, courseId]
    );

    // Optionally, you could update a join table or instructor's course list if needed
    // For now, just check if the update was successful
    if ((updateResult.changes ?? 0) === 0) {
      console.error('Failed to update course with instructor');
      return false;
    }

    // Verify the changes were successful
    const updatedCourse = await this.db.get('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!updatedCourse || updatedCourse.instructor_id !== instructorId) {
      console.error('Failed to verify instructor-course relationship');
      return false;
    }

    return true;
  }
  async unassignInstructorFromCourse(instructorId: string, courseId: string): Promise<boolean> {
    const result = await this.db.run(
      `DELETE FROM resit_exam_instructors WHERE resit_exam_id = ? AND instructor_id = ?`,
      [courseId, instructorId]
    );
    return (result.changes ?? 0) > 0;
  }

  // --- Utility/List Methods ---
  async listResitExams(): Promise<ResitExam[] | undefined> {
    const resitExams = await this.db.all('SELECT * FROM resit_exams');
    return resitExams;
  }

  async deleteUser(id: string): Promise<void> {
    await this.db.run('DELETE FROM users WHERE id = ?', [id]);
  }

  async getResitExamByCourseId(courseId: string): Promise<ResitExam | undefined> {
    return await this.db.get('SELECT * FROM resit_exams WHERE course_id = ?', [courseId]);
  }

} 

