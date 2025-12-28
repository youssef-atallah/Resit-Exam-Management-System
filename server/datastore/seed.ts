import { db } from './index';
import { Course, Instructor, Student, Secretary, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    await db.clearDatabase();
    console.log('🧹 Database cleared');

    // =========================================================================
    // 1. SECRETARIES
    // =========================================================================
    console.log('Creating secretaries...');
    const secretaries: Secretary[] = [
      {
        id: 'sec-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@uskudar.edu.tr',
        password: 'password123'
      }
    ];

    for (const secretary of secretaries) {
      await db.createSecretary(secretary);
    }

    // =========================================================================
    // 2. INSTRUCTORS
    // =========================================================================
    console.log('Creating instructors...');
    const instructors: Instructor[] = [
      {
        id: 'inst-001',
        name: 'Dr. Youssef Atallah', // Primary test instructor
        email: 'youssef.atallah@uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'inst-002',
        name: 'Prof. Emily Watson', // Secondary for diversity
        email: 'emily.watson@uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      }
    ];

    for (const instructor of instructors) {
      await db.createInstructor(instructor);
    }

    // =========================================================================
    // 3. STUDENTS
    // =========================================================================
    console.log('Creating students...');
    const students: Student[] = [
      {
        id: 'stu-001',
        name: 'Ali Yilmaz', // Primary test student
        email: 'ali.yilmaz@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        yearLevel: 3,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-002', // Secondary student for other tests
        name: 'Ayşe Demir',
        email: 'ayse.demir@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        yearLevel: 2,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      }
    ];

    for (const student of students) {
      await db.createStudent(student);
    }

    // =========================================================================
    // 4. COURSES (Designed for Scenario Coverage)
    // =========================================================================
    console.log('Creating courses...');
    // We assign most courses to inst-001 to give him a full dashboard
    const courses: Course[] = [
      { // Scenario: PENDING Resit
        id: 'SE302',
        name: 'Software Project Management',
        department: 'Software Engineering',
        instructor_id: 'inst-001', 
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: ANNOUNCED Resit
        id: 'SE201',
        name: 'Object Oriented Programming',
        department: 'Software Engineering',
        instructor_id: 'inst-001',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: ANNOUNCED Resit (Instructor 2)
        id: 'CS101',
        name: 'Introduction to Computer Science',
        department: 'Computer Science',
        instructor_id: 'inst-002',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: DEADLINE PASSED
        id: 'SE401',
        name: 'Software Architecture',
        department: 'Software Engineering',
        instructor_id: 'inst-001',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: EXAM FINISHED
        id: 'CS301',
        name: 'Operating Systems',
        department: 'Computer Science',
        // Assigned to inst-001 for dashboard variety
        instructor_id: 'inst-001', 
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: GRADED
        id: 'DB301',
        name: 'Database Management Systems',
        department: 'Software Engineering',
        instructor_id: 'inst-001',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { // Scenario: PASSED (No Resit Eligibility)
        id: 'DS205',
        name: 'Data Structures and Algorithms',
        department: 'Computer Science',
        instructor_id: 'inst-002',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const course of courses) {
      await db.createCourse(course);
    }

    // =========================================================================
    // 5. COURSE ENROLLMENTS (Targeting stu-001)
    // =========================================================================
    console.log('Enrolling students...');
    const enrollments = [
      // stu-001 Enrollments
      { studentId: 'stu-001', courseId: 'SE302', grade: 45, gradeLetter: 'FF' }, // Fail
      { studentId: 'stu-001', courseId: 'SE201', grade: 58, gradeLetter: 'FD' }, // Fail
      { studentId: 'stu-001', courseId: 'CS101', grade: 40, gradeLetter: 'FF' }, // Fail
      { studentId: 'stu-001', courseId: 'SE401', grade: 35, gradeLetter: 'FF' }, // Fail
      { studentId: 'stu-001', courseId: 'CS301', grade: 42, gradeLetter: 'FF' }, // Fail
      { studentId: 'stu-001', courseId: 'DB301', grade: 38, gradeLetter: 'FF' }, // Fail
      { studentId: 'stu-001', courseId: 'DS205', grade: 85, gradeLetter: 'BA' }, // Pass!
      
      // stu-002 (Few enrollments for validation)
      { studentId: 'stu-002', courseId: 'CS101', grade: 45, gradeLetter: 'FF' } 
    ];

    for (const enrollment of enrollments) {
      await db.enrollStudentInCourse(
        enrollment.studentId,
        enrollment.courseId,
        enrollment.grade,
        enrollment.gradeLetter
      );
    }

    // =========================================================================
    // 6. RESIT EXAMS
    // =========================================================================
    console.log('Creating resit exams...');

    // 1. SE302 - PENDING (No dates set)
    await db.createResitExamByInstuctor(
      'resit-SE302',
      'SE302',
      'Software Project Management - Resit',
      'Software Engineering',
      'inst-001',
      ['FF', 'FD'],
      'Exam content covering entire semester.'
    );
    // stu-001 APPLIES
    await db.enrollStudentInResitExam('stu-001', 'resit-SE302');

    // 2. SE201 - ANNOUNCED / ACTIVE (Future)
    await db.createResitExamByInstuctor(
      'resit-SE201',
      'SE201',
      'Object Oriented Programming - Resit',
      'Software Engineering',
      'inst-001',
      ['FF', 'FD'],
      'Java OOP concepts.'
    );
    // Secretary Confirms
    const dateSE201 = new Date(); dateSE201.setDate(dateSE201.getDate() + 10);
    const deadlineSE201 = new Date(); deadlineSE201.setDate(deadlineSE201.getDate() + 5);
    await db.updateResitExamBySecretary(
      'resit-SE201', 
      dateSE201, 
      deadlineSE201, 
      'Hall A', 
      'sec-001'
    );
    // stu-001 APPLIES
    await db.enrollStudentInResitExam('stu-001', 'resit-SE201');

    // 3. CS101 - ANNOUNCED / ACTIVE (Future) - NOT APPLIED
    await db.createResitExamByInstuctor(
      'resit-CS101',
      'CS101',
      'Introduction to Computer Science - Resit',
      'Computer Science',
      'inst-002',
      ['FF'],
      'Basics of CS.'
    );
    const dateCS101 = new Date(); dateCS101.setDate(dateCS101.getDate() + 14);
    const deadlineCS101 = new Date(); deadlineCS101.setDate(deadlineCS101.getDate() + 7);
    await db.updateResitExamBySecretary(
      'resit-CS101',
      dateCS101,
      deadlineCS101,
      'Lab 101',
      'sec-001'
    );
    // stu-001 eligible but NOT applied

    // 4. SE401 - DEADLINE PASSED
    await db.createResitExamByInstuctor(
      'resit-SE401',
      'SE401',
      'Software Architecture - Resit',
      'Software Engineering',
      'inst-001',
      ['FF'],
      'Patterns and Styles.'
    );
    const dateSE401 = new Date(); dateSE401.setDate(dateSE401.getDate() + 5); // Exam Future
    const deadlineSE401 = new Date(); deadlineSE401.setDate(deadlineSE401.getDate() - 1); // Deadline Past
    await db.updateResitExamBySecretary(
      'resit-SE401',
      dateSE401,
      deadlineSE401,
      'Main Hall',
      'sec-001'
    );
    // stu-001 APPLIED (before deadline presumably)
    await db.enrollStudentInResitExam('stu-001', 'resit-SE401');

    // 5. CS301 - EXAM FINISHED (Results Pending)
    await db.createResitExamByInstuctor(
      'resit-CS301',
      'CS301',
      'Operating Systems - Resit',
      'Computer Science',
      'inst-001', // Changed to inst-001 for diversity
      ['FF', 'FD'],
      'OS Kernels.'
    );
    const dateCS301 = new Date(); dateCS301.setDate(dateCS301.getDate() - 2); // Exam Past
    const deadlineCS301 = new Date(); deadlineCS301.setDate(deadlineCS301.getDate() - 5);
    await db.updateResitExamBySecretary(
      'resit-CS301',
      dateCS301,
      deadlineCS301,
      'Lab 202',
      'sec-001'
    );
    // stu-001 APPLIED
    await db.enrollStudentInResitExam('stu-001', 'resit-CS301');

    // 6. DB301 - GRADED
    await db.createResitExamByInstuctor(
      'resit-DB301',
      'DB301',
      'DBMS - Resit',
      'Software Engineering',
      'inst-001',
      ['FF'],
      'SQL and Normalization.'
    );
    const dateDB301 = new Date(); dateDB301.setDate(dateDB301.getDate() - 10);
    const deadlineDB301 = new Date(); deadlineDB301.setDate(deadlineDB301.getDate() - 15);
    await db.updateResitExamBySecretary(
      'resit-DB301',
      dateDB301,
      deadlineDB301,
      'Online',
      'sec-001'
    );
    // stu-001 APPLIED and GRADED
    await db.enrollStudentInResitExam('stu-001', 'resit-DB301');
    await db.updateStudentResitExamResults('stu-001', 'resit-DB301', 75, 'CB');

    // =========================================================================
    // 7. NOTIFICATIONS
    // =========================================================================
    console.log('Creating notifications...');
    const notifications: Notification[] = [
      {
        id: uuidv4(),
        userId: 'stu-001',
        type: 'system',
        title: 'Seed Data Ready',
        message: 'Your dashboard is optimized for testing all resit scenarios.',
        isRead: false,
        createdAt: new Date()
      }
    ];

    for (const notif of notifications) {
      await db.createNotification(notif);
    }

    console.log('\n=============================================================');
    console.log('🎉 SEEDING COMPLETE');
    console.log('=============================================================');
    console.log('Login Credentials:');
    console.log('Student:    stu-001 / password123 (Ali Yilmaz)');
    console.log('Instructor: inst-001 / password123 (Dr. Youssef Atallah)');
    console.log('Secretary:  sec-001 / password123 (Sarah Johnson)');
    console.log('=============================================================');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
