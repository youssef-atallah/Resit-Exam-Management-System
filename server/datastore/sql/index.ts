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
       VALUES (?, ?, ?, ?, datetime(?, 'localtime', '+3 hours'), ?, datetime(?, 'localtime', '+3 hours'))`,
      [
        course.id,
        course.name,
        course.department,
        course.instructor_id,
        createdAt,
        course.createdBy,
        createdAt
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
    try {
      await this.db.run(`DELETE FROM courses WHERE id = ?`, [id]);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
  async updateCourse(id: string, name: string, instructor: string, department: string, secretaryId: string): Promise<void> {
    await this.db.run(
      `UPDATE courses SET name = ?, instructor_id = ?, department = ?, updated_at = datetime('now', 'localtime', '+3 hours') WHERE id = ?`,
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
      `INSERT INTO students (id, created_at, created_by, updated_at) VALUES (?, datetime(?, 'localtime', '+3 hours'), ?, datetime(?, 'localtime', '+3 hours'))`,
      [student.id, now, student.createdBy, now]
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
  async deleteStudent(id: string): Promise<void> {
    try {
      // First, check if student exists
      const student = await this.db.get('SELECT * FROM students WHERE id = ?', [id]);
      if (!student) {
        throw new Error('Student not found');
      }

      // Delete from all tables that reference students
      await this.db.run('DELETE FROM course_students WHERE student_id = ?', [id]);
      await this.db.run('DELETE FROM student_course_grades WHERE student_id = ?', [id]);
      await this.db.run('DELETE FROM resit_exam_students WHERE student_id = ?', [id]);
      await this.db.run('DELETE FROM resit_exam_application WHERE student_id = ?', [id]);

      // Delete from all tables that might reference users
      await this.db.run('DELETE FROM secretaries WHERE id = ?', [id]);
      await this.db.run('DELETE FROM instructors WHERE id = ?', [id]);
      
      // Delete the user record directly before deleting student
      await this.db.run('DELETE FROM users WHERE id = ?', [id]);

      // Delete the student record
      await this.db.run('DELETE FROM students WHERE id = ?', [id]);

    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
  async updateStudentInfo(id: string, name: string, email: string, password: string): Promise<void> {
    try {
      // Update users table (which has all the columns)
      await this.db.run(
        `UPDATE users SET email = ?, name = ?, password = ? WHERE id = ?`,
        [email, name, password, id]
      );

      // Get current timestamp in UTC+3
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
      
      // Format timestamp with UTC+3 timezone
      const updatedAt = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+03:00`;
      
      // Update students table with the UTC+3 timestamp
      await this.db.run(
        `UPDATE students SET updated_at = datetime(?, 'localtime', '+3 hours') WHERE id = ?`,
        [updatedAt, id]
      );

    } catch (error) {
      console.error('Database error in updateStudentInfo:', error);
      throw error;
    }
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
  async removeStudentFromCourse(studentId: string, courseId: string): Promise<void> {
    try {
      // First get any resit exams associated with this course
      const resitExam = await this.db.get(
        `SELECT resit_exam_id FROM courses WHERE id = ?`,
        [courseId]
      );

      // Remove the student from the course
      await this.db.run(`DELETE FROM course_students WHERE student_id = ? AND course_id = ?`, [studentId, courseId]);

      // Remove the student's grades for this course
      await this.db.run(`DELETE FROM student_course_grades WHERE student_id = ? AND course_id = ?`, [studentId, courseId]);

      // If there's a resit exam for this course, remove the student from it
      if (resitExam && resitExam.resit_exam_id) {
        await this.db.run(
          `DELETE FROM resit_exam_students WHERE student_id = ? AND resit_exam_id = ?`,
          [studentId, resitExam.resit_exam_id]
        );
      }
    } catch (error) {
      console.error('Error removing student from course:', error);
      throw error;
    }
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
    try {
      await this.db.run(`DELETE FROM resit_exam_students WHERE student_id = ? AND resit_exam_id = ?`, [studentId, resitExamId]);
    } catch (error) {
      console.error('Error removing student from resit exam:', error);
      throw error;
    }
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
      `INSERT INTO instructors (id, created_at, created_by, updated_at) VALUES (?, datetime(?, 'localtime', '+3 hours'), ?, datetime(?, 'localtime', '+3 hours'))`,
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
    
    // Get the instructor's resit exams (both created by them and assigned to them)
    const resitExamRows = await this.db.all(`
      SELECT DISTINCT 
        re.id as resit_exam_id 
      FROM resit_exams re
      LEFT JOIN resit_exam_instructors rei ON re.id = rei.resit_exam_id
      WHERE re.created_by = ? OR rei.instructor_id = ?
    `, [id, id]);
    
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
  
  async deleteInstructor(id: string): Promise<void> {
    try {
      // First, check if instructor exists
      const instructor = await this.db.get('SELECT * FROM instructors WHERE id = ?', [id]);
      if (!instructor) {
        throw new Error('Instructor not found');
      }

      // Delete from all tables that reference instructors
      await this.db.run('DELETE FROM course_students WHERE course_id IN (SELECT id FROM courses WHERE instructor_id = ?)', [id]);
      await this.db.run('DELETE FROM student_course_grades WHERE course_id IN (SELECT id FROM courses WHERE instructor_id = ?)', [id]);
      await this.db.run('DELETE FROM resit_exam_students WHERE resit_exam_id IN (SELECT id FROM resit_exams WHERE created_by = ?)', [id]);
      await this.db.run('DELETE FROM resit_exam_application WHERE resit_exam_id IN (SELECT id FROM resit_exams WHERE created_by = ?)', [id]);
      await this.db.run('DELETE FROM resit_exam_letters_allowed WHERE resit_exam_id IN (SELECT id FROM resit_exams WHERE created_by = ?)', [id]);
      await this.db.run('DELETE FROM resit_exam_instructors WHERE instructor_id = ?', [id]);
      
      // Delete courses created by this instructor
      await this.db.run('DELETE FROM courses WHERE instructor_id = ?', [id]);
      
      // Delete resit exams created by this instructor
      await this.db.run('DELETE FROM resit_exams WHERE created_by = ?', [id]);
      
      // Delete from users table (this will also delete from instructors table due to ON DELETE CASCADE)
      await this.db.run('DELETE FROM users WHERE id = ?', [id]);

    } catch (error) {
      console.error('Error deleting instructor:', error);
      throw error;
    }
  }
  async updateInstructor(id: string, name: string, email: string, password: string): Promise<void> {
    // Update the users table with the new user data
    await this.db.run(
      `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`,
      [name, email, password, id]
    );

    // Update the instructors table with the updated_at timestamp and secretary ID
    await this.db.run(
      `UPDATE instructors SET updated_at = datetime('now', 'localtime', '+3 hours') WHERE id = ?`,
      [id]
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
       VALUES (?, ?, ?, ?, datetime(?, 'localtime', '+3 hours'), ?)`,
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
    try {
      // Get the base resit exam details
      const exam = await this.db.get(`
        SELECT 
          id, 
          course_id, 
          name, 
          department, 
          exam_date as examDate, 
          deadline, 
          location, 
          created_at as createdAt, 
          created_by as createdBy, 
          updated_at as updatedAt 
        FROM resit_exams 
        WHERE id = ?`, 
        [id]
      );
      
      if (!exam) {
        throw new Error('Resit exam not found');
      }
      
      // Get the letters allowed for this exam
      const lettersRows = await this.db.all(
        'SELECT letter FROM resit_exam_letters_allowed WHERE resit_exam_id = ?',
        [id]
      );
      const lettersAllowed = lettersRows.map(row => row.letter);
      
      // Get students enrolled in this exam
      const studentsRows = await this.db.all(
        'SELECT student_id FROM resit_exam_students WHERE resit_exam_id = ?',
        [id]
      );
      const students = studentsRows.map(row => row.student_id);
      
      // Get instructors associated with this exam (both creator and assigned)
      const instructorsRows = await this.db.all(`
        SELECT DISTINCT 
          CASE 
            WHEN re.created_by IS NOT NULL THEN re.created_by
            WHEN rei.instructor_id IS NOT NULL THEN rei.instructor_id
          END as instructor_id
        FROM resit_exams re
        LEFT JOIN resit_exam_instructors rei ON re.id = rei.resit_exam_id
        WHERE re.id = ? AND instructor_id IS NOT NULL
        UNION
        SELECT created_by as instructor_id
        FROM resit_exams
        WHERE id = ?`,
        [id, id]
      );
      const instructors = instructorsRows.map(row => row.instructor_id);
      
      // Return a complete ResitExam object
      return {
        ...exam,
        lettersAllowed,
        students,
        instructors
      };
    } catch (error) {
      console.error('Error fetching resit exam details:', error);
      throw error;
    }
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
    const client = await this.db;
    
    try {
      await client.run('BEGIN TRANSACTION');

      // 1. Get the resit exam with course_id for validation
      const resitExam = await client.get(
        'SELECT id, course_id, created_by FROM resit_exams WHERE id = ?',
        [resitExamId]
      );

      if (!resitExam) {
        throw new Error('Resit exam not found');
      }

      // 2. Delete from resit_exam_students
      await client.run(
        'DELETE FROM resit_exam_students WHERE resit_exam_id = ?',
        [resitExamId]
      );
      
      // 3. Delete from resit_exam_letters_allowed
      await client.run(
        'DELETE FROM resit_exam_letters_allowed WHERE resit_exam_id = ?',
        [resitExamId]
      );

      // 4. Delete from resit_exam_application
      await client.run(
        'DELETE FROM resit_exam_application WHERE resit_exam_id = ?',
        [resitExamId]
      );

      // 5. Update the course to remove the resit exam reference if it matches
      await client.run(
        `UPDATE courses 
         SET resit_exam_id = NULL 
         WHERE id = ? AND resit_exam_id = ?`,
        [resitExam.course_id, resitExamId]
      );
      
      // 6. Finally, delete the resit exam itself
      await client.run('DELETE FROM resit_exams WHERE id = ?', [resitExamId]);
      
      await client.run('COMMIT');
    } catch (error) {
      await client.run('ROLLBACK');
      console.error('Error in deleteResitExam transaction:', error);
      throw error;
    }
  }
  async updateResitExamBySecretary(resitExamId: string, examDate: Date, deadline: Date, location: string, secretaryId: string): Promise<void> {
    await this.db.run(
      `UPDATE resit_exams 
       SET exam_date = datetime(?, 'localtime', '+3 hours'), 
           deadline = datetime(?, 'localtime', '+3 hours'), 
           location = ?, 
           updated_at = datetime('now', 'localtime', '+3 hours') 
       WHERE id = ?`,
      [examDate.toISOString(), deadline.toISOString(), location, resitExamId]
    );
  }
  async updateResitExamByInstructor(id: string, name: string, instructorID: string, department: string, letters: string[], courseId: string): Promise<void> {
    await this.db.run(
      `UPDATE resit_exams SET name = ?, department = ?, updated_at = datetime('now', 'localtime', '+3 hours') WHERE id = ?`,
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
      'UPDATE courses SET instructor_id = ?, updated_at = datetime(\'now\', \'localtime\', \'+3 hours\') WHERE id = ?',
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
    try {
      // First, verify the course exists and is assigned to this instructor
      const course = await this.db.get(
        'SELECT * FROM courses WHERE id = ? AND instructor_id = ?',
        [courseId, instructorId]
      );

      if (!course) {
        return false; // No matching course found with this instructor
      }

      // Remove the instructor from the course
      const result = await this.db.run(
        'UPDATE courses SET instructor_id = NULL, updated_at = datetime(\'now\', \'localtime\', \'+3 hours\') WHERE id = ?',
        [courseId]
      );

      return (result.changes ?? 0) > 0;
    } catch (error) {
      console.error('Error unassigning instructor from course:', error);
      throw error;
    }
  }

  // --- Utility/List Methods ---
  async listResitExams(): Promise<ResitExam[] | undefined> {
    const resitExams = await this.db.all('SELECT * FROM resit_exams');
    return resitExams;
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await this.db.run('DELETE FROM users WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getResitExamByCourseId(courseId: string): Promise<ResitExam | undefined> {
    // Get the base resit exam details
    const exam = await this.db.get(
      `SELECT 
        id, 
        course_id as course_id, 
        name, 
        department, 
        exam_date as examDate, 
        deadline, 
        location, 
        created_at as createdAt, 
        created_by as createdBy, 
        updated_at as updatedAt 
      FROM resit_exams 
      WHERE course_id = ?`, 
      [courseId]
    );
    
    if (!exam) {
      return undefined;
    }
    
    // Get the letters allowed for this exam
    const lettersRows = await this.db.all(
      'SELECT letter FROM resit_exam_letters_allowed WHERE resit_exam_id = ?',
      [exam.id]
    );
    const lettersAllowed = lettersRows.map(row => row.letter);
    
    // Get students enrolled in this exam
    const studentsRows = await this.db.all(
      'SELECT student_id FROM resit_exam_students WHERE resit_exam_id = ?',
      [exam.id]
    );
    const students = studentsRows.map(row => row.student_id);
    
    // Get instructors associated with this exam
    const instructorsRows = await this.db.all(
      `SELECT DISTINCT 
        CASE 
          WHEN re.created_by IS NOT NULL THEN re.created_by
          WHEN rei.instructor_id IS NOT NULL THEN rei.instructor_id
        END as instructor_id
      FROM resit_exams re
      LEFT JOIN resit_exam_instructors rei ON re.id = rei.resit_exam_id
      WHERE re.id = ? AND instructor_id IS NOT NULL
      UNION
      SELECT created_by as instructor_id
      FROM resit_exams
      WHERE id = ?`,
      [exam.id, exam.id]
    );
    const instructors = instructorsRows.map(row => row.instructor_id);
    
    // Return a complete ResitExam object
    return {
      ...exam,
      lettersAllowed,
      students,
      instructors
    };
  }
} 
