import { db } from './index';
import { Course, Instructor, Student, Secretary, Notification } from '../types';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    await db.clearDatabase();
    console.log('🧹 Database cleared');
    // =========================================================================
    // SECRETARIES
    // =========================================================================
    console.log('Creating secretaries...');
    const secretaries: Secretary[] = [
      {
        id: 'sec-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@uskudar.edu.tr',
        password: 'password123'
      },
      {
        id: 'sec-002',
        name: 'Michael Chen',
        email: 'michael.chen@uskudar.edu.tr',
        password: 'password123'
      }
    ];

    for (const secretary of secretaries) {
      await db.createSecretary(secretary);
    }
    console.log(`✅ Created ${secretaries.length} secretaries`);

    // =========================================================================
    // INSTRUCTORS
    // =========================================================================
    console.log('Creating instructors...');
    const instructors: Instructor[] = [
      {
        id: 'inst-001',
        name: 'Dr. Youssef Atallah',
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
        name: 'Prof. Emily Watson',
        email: 'emily.watson@uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'inst-003',
        name: 'Dr. Ahmed Hassan',
        email: 'ahmed.hassan@uskudar.edu.tr',
        password: 'password123',
        department: 'Mathematics',
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'inst-004',
        name: 'Dr. Maria Garcia',
        email: 'maria.garcia@uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'inst-005',
        name: 'Prof. John Smith',
        email: 'john.smith@uskudar.edu.tr',
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
    console.log(`✅ Created ${instructors.length} instructors`);

    // =========================================================================
    // STUDENTS
    // =========================================================================
    console.log('Creating students...');
    const students: Student[] = [
      {
        id: 'stu-001',
        name: 'Ali Yilmaz',
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
        id: 'stu-002',
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
      },
      {
        id: 'stu-003',
        name: 'Mehmet Kaya',
        email: 'mehmet.kaya@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        yearLevel: 4,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-004',
        name: 'Fatma Özdemir',
        email: 'fatma.ozdemir@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        yearLevel: 3,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-005',
        name: 'Can Arslan',
        email: 'can.arslan@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        yearLevel: 2,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-006',
        name: 'Zeynep Şahin',
        email: 'zeynep.sahin@student.uskudar.edu.tr',
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
        id: 'stu-007',
        name: 'Emre Çelik',
        email: 'emre.celik@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        yearLevel: 4,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-008',
        name: 'Elif Yıldız',
        email: 'elif.yildiz@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Engineering',
        yearLevel: 1,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-009',
        name: 'Burak Koç',
        email: 'burak.koc@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Software Engineering',
        yearLevel: 2,
        courses: [],
        resitExams: [],
        createdAt: new Date(),
        createdBy: 'sec-001',
        updatedAt: new Date()
      },
      {
        id: 'stu-010',
        name: 'Selin Aktaş',
        email: 'selin.aktas@student.uskudar.edu.tr',
        password: 'password123',
        department: 'Computer Science',
        yearLevel: 3,
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
    console.log(`✅ Created ${students.length} students`);

    // =========================================================================
    // COURSES
    // =========================================================================
    console.log('Creating courses...');
    const courses: Course[] = [
      {
        id: 'SE302',
        name: 'Software Project Management',
        department: 'Software Engineering',
        instructor_id: 'inst-001',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CS101',
        name: 'Introduction to Computer Science',
        department: 'Computer Science',
        instructor_id: 'inst-002',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'MATH201',
        name: 'Calculus II',
        department: 'Mathematics',
        instructor_id: 'inst-003',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'DS205',
        name: 'Data Structures and Algorithms',
        department: 'Computer Science',
        instructor_id: 'inst-002',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'DB301',
        name: 'Database Management Systems',
        department: 'Software Engineering',
        instructor_id: 'inst-004',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'SE201',
        name: 'Object Oriented Programming',
        department: 'Software Engineering',
        instructor_id: 'inst-001',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'CS301',
        name: 'Operating Systems',
        department: 'Computer Science',
        instructor_id: 'inst-005',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'SE401',
        name: 'Software Architecture',
        department: 'Software Engineering',
        instructor_id: 'inst-004',
        students: [],
        createdBy: 'sec-001',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const course of courses) {
      await db.createCourse(course);
    }
    console.log(`✅ Created ${courses.length} courses`);

    // =========================================================================
    // STUDENT ENROLLMENTS WITH GRADES
    // =========================================================================
    console.log('Enrolling students in courses...');
    const enrollments = [
      // SE302 - Software Project Management (inst-001)
      { studentId: 'stu-001', courseId: 'SE302', grade: 45, gradeLetter: 'FF' },
      { studentId: 'stu-002', courseId: 'SE302', grade: 72, gradeLetter: 'CC' },
      { studentId: 'stu-003', courseId: 'SE302', grade: 38, gradeLetter: 'FF' },
      { studentId: 'stu-004', courseId: 'SE302', grade: 85, gradeLetter: 'BA' },
      { studentId: 'stu-007', courseId: 'SE302', grade: 52, gradeLetter: 'FD' },
      { studentId: 'stu-008', courseId: 'SE302', grade: 60, gradeLetter: 'DD' },
      
      // CS101 - Intro to CS (inst-002)
      { studentId: 'stu-001', courseId: 'CS101', grade: 68, gradeLetter: 'DC' },
      { studentId: 'stu-002', courseId: 'CS101', grade: 42, gradeLetter: 'FF' },
      { studentId: 'stu-005', courseId: 'CS101', grade: 78, gradeLetter: 'CB' },
      { studentId: 'stu-006', courseId: 'CS101', grade: 90, gradeLetter: 'AA' },
      { studentId: 'stu-009', courseId: 'CS101', grade: 35, gradeLetter: 'FF' },
      { studentId: 'stu-010', courseId: 'CS101', grade: 55, gradeLetter: 'FD' },
      
      // MATH201 - Calculus II (inst-003)
      { studentId: 'stu-003', courseId: 'MATH201', grade: 55, gradeLetter: 'FD' },
      { studentId: 'stu-004', courseId: 'MATH201', grade: 48, gradeLetter: 'FF' },
      { studentId: 'stu-005', courseId: 'MATH201', grade: 82, gradeLetter: 'BB' },
      { studentId: 'stu-007', courseId: 'MATH201', grade: 40, gradeLetter: 'FF' },
      { studentId: 'stu-008', courseId: 'MATH201', grade: 65, gradeLetter: 'DC' },
      
      // DS205 - Data Structures (inst-002)
      { studentId: 'stu-001', courseId: 'DS205', grade: 75, gradeLetter: 'CB' },
      { studentId: 'stu-003', courseId: 'DS205', grade: 40, gradeLetter: 'FF' },
      { studentId: 'stu-006', courseId: 'DS205', grade: 88, gradeLetter: 'BA' },
      { studentId: 'stu-009', courseId: 'DS205', grade: 30, gradeLetter: 'FF' },
      { studentId: 'stu-010', courseId: 'DS205', grade: 70, gradeLetter: 'CC' },
      
      // DB301 - Database Systems (inst-004)
      { studentId: 'stu-002', courseId: 'DB301', grade: 65, gradeLetter: 'DC' },
      { studentId: 'stu-004', courseId: 'DB301', grade: 92, gradeLetter: 'AA' },
      { studentId: 'stu-005', courseId: 'DB301', grade: 44, gradeLetter: 'FF' },
      { studentId: 'stu-008', courseId: 'DB301', grade: 38, gradeLetter: 'FF' },
      
      // SE201 - OOP (inst-001)
      { studentId: 'stu-001', courseId: 'SE201', grade: 58, gradeLetter: 'FD' },
      { studentId: 'stu-002', courseId: 'SE201', grade: 80, gradeLetter: 'BB' },
      { studentId: 'stu-006', courseId: 'SE201', grade: 45, gradeLetter: 'FF' },
      { studentId: 'stu-007', courseId: 'SE201', grade: 72, gradeLetter: 'CC' },
      { studentId: 'stu-009', courseId: 'SE201', grade: 25, gradeLetter: 'FF' },
      
      // CS301 - Operating Systems (inst-005)
      { studentId: 'stu-003', courseId: 'CS301', grade: 55, gradeLetter: 'FD' },
      { studentId: 'stu-004', courseId: 'CS301', grade: 42, gradeLetter: 'FF' },
      { studentId: 'stu-005', courseId: 'CS301', grade: 78, gradeLetter: 'CB' },
      { studentId: 'stu-010', courseId: 'CS301', grade: 35, gradeLetter: 'FF' },
      
      // SE401 - Software Architecture (inst-004)
      { studentId: 'stu-001', courseId: 'SE401', grade: 62, gradeLetter: 'DD' },
      { studentId: 'stu-002', courseId: 'SE401', grade: 48, gradeLetter: 'FF' },
      { studentId: 'stu-006', courseId: 'SE401', grade: 85, gradeLetter: 'BA' },
      { studentId: 'stu-007', courseId: 'SE401', grade: 40, gradeLetter: 'FF' }
    ];

    for (const enrollment of enrollments) {
      await db.enrollStudentInCourse(
        enrollment.studentId,
        enrollment.courseId,
        enrollment.grade,
        enrollment.gradeLetter
      );
    }
    console.log(`✅ Enrolled students in courses (${enrollments.length} enrollments)`);

    // =========================================================================
    // RESIT EXAMS
    // =========================================================================
    console.log('Creating resit exams with diverse scenarios...');
    
    // 1. SE302 - PENDING (Awaiting Details)
    await db.createResitExamByInstuctor(
      'resit-SE302',
      'SE302',
      'Software Project Management - Resit Exam',
      'Software Engineering',
      'inst-001',
      ['FF', 'FD'],
      'This is a resit exam for students who failed SE302. Please prepare well! The exam will cover all topics from the semester.'
    );
    await db.enrollStudentInResitExam('stu-001', 'resit-SE302');
    await db.enrollStudentInResitExam('stu-003', 'resit-SE302');
    
    // 2. CS101 - ANNOUNCED (Future)
    await db.createResitExamByInstuctor(
      'resit-CS101',
      'CS101',
      'Introduction to Computer Science - Resit Exam',
      'Computer Science',
      'inst-002',
      ['FF'],
      'Resit exam for CS101. Focus on programming fundamentals, algorithms, and problem-solving techniques.'
    );
    // Secretary confirms it for the future
    const threeDaysAfter = new Date(); threeDaysAfter.setDate(threeDaysAfter.getDate() + 3);
    const sevenDaysAfter = new Date(); sevenDaysAfter.setDate(sevenDaysAfter.getDate() + 7);
    await db.updateResitExamBySecretary('resit-CS101', sevenDaysAfter, threeDaysAfter, 'Building A, Lab 102', 'sec-001');
    await db.enrollStudentInResitExam('stu-002', 'resit-CS101');
    
    // 3. MATH201 - DEADLINE PASSED (Exam is in future)
    await db.createResitExamByInstuctor(
      'resit-MATH201',
      'MATH201',
      'Calculus II - Resit Exam',
      'Mathematics',
      'inst-003',
      ['FF', 'FD'],
      'Resit exam covering integrals, series, and differential equations. Bring your calculators!'
    );
    // Secretary confirms it with a past deadline
    const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const fiveDaysAfter = new Date(); fiveDaysAfter.setDate(fiveDaysAfter.getDate() + 5);
    await db.updateResitExamBySecretary('resit-MATH201', fiveDaysAfter, twoDaysAgo, 'Room 305', 'sec-001');
    await db.enrollStudentInResitExam('stu-004', 'resit-MATH201');
    
    // 4. DS205 - EXAM FINISHED (Results Pending)
    await db.createResitExamByInstuctor(
      'resit-DS205',
      'DS205',
      'Data Structures and Algorithms - Resit Exam',
      'Computer Science',
      'inst-002',
      ['FF'],
      'The resit exam will include implementation questions. You may use pseudocode for algorithms.'
    );
    const fourDaysAgo = new Date(); fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const oneDayAgo = new Date(); oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    await db.updateResitExamBySecretary('resit-DS205', oneDayAgo, fourDaysAgo, 'CS Lab 1', 'sec-001');
    await db.enrollStudentInResitExam('stu-003', 'resit-DS205');
    await db.enrollStudentInResitExam('stu-009', 'resit-DS205');
    
    // 5. DB301 - RESULTS AVAILABLE
    await db.createResitExamByInstuctor(
      'resit-DB301',
      'DB301',
      'Database Management Systems - Resit Exam',
      'Software Engineering',
      'inst-004',
      ['FF'],
      'SQL queries, normalization, and ER diagrams will be covered.'
    );
    const tenDaysAgo = new Date(); tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const eightDaysAgo = new Date(); eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    await db.updateResitExamBySecretary('resit-DB301', eightDaysAgo, tenDaysAgo, 'Room 201', 'sec-001');
    await db.enrollStudentInResitExam('stu-005', 'resit-DB301');
    await db.enrollStudentInResitExam('stu-008', 'resit-DB301');
    // Add results
    await db.updateStudentResitExamResults('stu-005', 'resit-DB301', 75, 'CB');
    await db.updateStudentResitExamResults('stu-008', 'resit-DB301', 82, 'BB');
    
    // 6. SE201 - ANNOUNCED (Active)
    await db.createResitExamByInstuctor(
      'resit-SE201',
      'SE201',
      'Object Oriented Programming - Resit Exam',
      'Software Engineering',
      'inst-001',
      ['FF', 'FD'],
      'OOP concepts, design patterns, and Java programming. Bring your A-game!'
    );
    const fiveDaysFuture = new Date(); fiveDaysFuture.setDate(fiveDaysFuture.getDate() + 5);
    const tenDaysFuture = new Date(); tenDaysFuture.setDate(tenDaysFuture.getDate() + 10);
    await db.updateResitExamBySecretary('resit-SE201', tenDaysFuture, fiveDaysFuture, 'Main Auditorium', 'sec-001');
    await db.enrollStudentInResitExam('stu-001', 'resit-SE201');
    
    // 7. CS301 - PENDING
    await db.createResitExamByInstuctor(
      'resit-CS301',
      'CS301',
      'Operating Systems - Resit Exam',
      'Computer Science',
      'inst-005',
      ['FF', 'FD'],
      'Process management, memory management, and file systems.'
    );
    
    // 8. SE401 - DEADLINE PASSED (Exam today!)
    await db.createResitExamByInstuctor(
      'resit-SE401',
      'SE401',
      'Software Architecture - Resit Exam',
      'Software Engineering',
      'inst-004',
      ['FF'],
      'Architecture patterns, design decisions, and system design.'
    );
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const today = new Date(); // Exam is today
    await db.updateResitExamBySecretary('resit-SE401', today, sevenDaysAgo, 'Upper Hall', 'sec-001');
    await db.enrollStudentInResitExam('stu-002', 'resit-SE401');

    console.log(`✅ Created 8 resit exams with diverse states`);

    // =========================================================================
    // SAMPLE NOTIFICATIONS
    // =========================================================================
    console.log('Creating sample notifications...');
    
    const notifications: Notification[] = [
      {
        id: uuidv4(),
        userId: 'stu-001',
        type: 'system',
        title: 'Welcome to Resit Exam System',
        message: 'Welcome Ali! You can view your grades and apply for resit exams from your dashboard.',
        isRead: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        userId: 'stu-001',
        type: 'resit_announced',
        title: 'New Resit Exam: CS101',
        message: 'A resit exam has been created for Introduction to Computer Science. You are eligible!',
        relatedEntityType: 'resit_exam',
        relatedEntityId: 'resit-CS101',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        userId: 'stu-005',
        type: 'grade_posted',
        title: 'Resit Result Available: DB301',
        message: 'Your resit exam result for Database Management Systems is now available. You got a CB!',
        relatedEntityType: 'resit_exam',
        relatedEntityId: 'resit-DB301',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: uuidv4(),
        userId: 'inst-001',
        type: 'application_status',
        title: 'New Resit Application',
        message: 'Ali Yilmaz has enrolled in the SE201 resit exam.',
        relatedEntityType: 'resit_exam',
        relatedEntityId: 'resit-SE201',
        isRead: false,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    for (const notification of notifications) {
      await db.createNotification(notification);
    }
    console.log(`✅ Created ${notifications.length} sample notifications`);

    // =========================================================================
    // SUMMARY
    // =========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   👔 ${secretaries.length} secretaries`);
    console.log(`   👨‍🏫 ${instructors.length} instructors`);
    console.log(`   🎓 ${students.length} students`);
    console.log(`   📚 ${courses.length} courses`);
    console.log(`   📝 ${enrollments.length} course enrollments`);
    console.log(`   📋 8 resit exams (Pending, Announced, Past Deadline, Finished)`);
    console.log(`   🔔 ${notifications.length} notifications`);
    
    console.log('\n🔑 Login Credentials (all passwords are "password123"):');
    console.log('   ┌─────────────┬────────────────────────────────────────────────┐');
    console.log('   │ Role        │ ID / Email                                     │');
    console.log('   ├─────────────┼────────────────────────────────────────────────┤');
    console.log('   │ Secretary   │ sec-001 / sarah.johnson@uskudar.edu.tr         │');
    console.log('   │ Instructor  │ inst-001 / youssef.atallah@uskudar.edu.tr      │');
    console.log('   │ Student     │ stu-001 / ali.yilmaz@student.uskudar.edu.tr    │');
    console.log('   └─────────────┴────────────────────────────────────────────────┘');
    
    console.log('\n💡 Testing Tips:');
    console.log('   • Login as stu-001: See "Awaiting Details" (SE302) and "Announced" (SE201)');
    console.log('   • Login as stu-004: See "Deadline Passed" (MATH201)');
    console.log('   • Login as stu-005: See "Resit Results" (DB301)');
    console.log('   • Login as sec-001: See pending resits waiting for details');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
