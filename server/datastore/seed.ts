import { db } from './index';
import { Course, Instructor, Student, Secretary } from '../types';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create Secretaries
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

    // Create Instructors
    console.log('Creating instructors...');
    const instructors: Instructor[] = [
      {
        id: 'inst-001',
        name: 'Dr. Youssef Atallah',
        email: 'youssef.atallah@uskudar.edu.tr',
        password: 'password123',
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

    // Create Students
    console.log('Creating students...');
    const students: Student[] = [
      {
        id: 'stu-001',
        name: 'Ali Yilmaz',
        email: 'ali.yilmaz@student.uskudar.edu.tr',
        password: 'password123',
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

    // Create Courses
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
      }
    ];

    for (const course of courses) {
      await db.createCourse(course);
    }
    console.log(`✅ Created ${courses.length} courses`);

    // Enroll Students in Courses
    console.log('Enrolling students in courses...');
    const enrollments = [
      // SE302 enrollments
      { studentId: 'stu-001', courseId: 'SE302', grade: 45, gradeLetter: 'F' },
      { studentId: 'stu-002', courseId: 'SE302', grade: 72, gradeLetter: 'B' },
      { studentId: 'stu-003', courseId: 'SE302', grade: 38, gradeLetter: 'F' },
      { studentId: 'stu-004', courseId: 'SE302', grade: 85, gradeLetter: 'A' },
      
      // CS101 enrollments
      { studentId: 'stu-001', courseId: 'CS101', grade: 68, gradeLetter: 'C' },
      { studentId: 'stu-002', courseId: 'CS101', grade: 42, gradeLetter: 'F' },
      { studentId: 'stu-005', courseId: 'CS101', grade: 78, gradeLetter: 'B' },
      { studentId: 'stu-006', courseId: 'CS101', grade: 90, gradeLetter: 'A' },
      
      // MATH201 enrollments
      { studentId: 'stu-003', courseId: 'MATH201', grade: 55, gradeLetter: 'D' },
      { studentId: 'stu-004', courseId: 'MATH201', grade: 48, gradeLetter: 'F' },
      { studentId: 'stu-005', courseId: 'MATH201', grade: 82, gradeLetter: 'A' },
      
      // DS205 enrollments
      { studentId: 'stu-001', courseId: 'DS205', grade: 75, gradeLetter: 'B' },
      { studentId: 'stu-003', courseId: 'DS205', grade: 40, gradeLetter: 'F' },
      { studentId: 'stu-006', courseId: 'DS205', grade: 88, gradeLetter: 'A' },
      
      // DB301 enrollments
      { studentId: 'stu-002', courseId: 'DB301', grade: 65, gradeLetter: 'C' },
      { studentId: 'stu-004', courseId: 'DB301', grade: 92, gradeLetter: 'A' },
      { studentId: 'stu-005', courseId: 'DB301', grade: 44, gradeLetter: 'F' }
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

    // Create Resit Exams for courses with failing students
    console.log('Creating resit exams...');
    
    // Resit exam for SE302
    await db.createResitExamByInstuctor(
      'resit-SE302',
      'SE302',
      'Software Project Management - Resit Exam',
      'Software Engineering',
      'inst-001',
      ['F', 'D'],
      'This is a resit exam for students who failed SE302. Please prepare well!'
    );
    
    // Enroll failing students in SE302 resit
    await db.enrollStudentInResitExam('stu-001', 'resit-SE302');
    await db.enrollStudentInResitExam('stu-003', 'resit-SE302');
    
    // Resit exam for CS101
    await db.createResitExamByInstuctor(
      'resit-CS101',
      'CS101',
      'Introduction to Computer Science - Resit Exam',
      'Computer Science',
      'inst-002',
      ['F'],
      'Resit exam for CS101. Focus on the fundamental concepts covered in class.'
    );
    
    // Enroll failing student in CS101 resit
    await db.enrollStudentInResitExam('stu-002', 'resit-CS101');
    
    console.log(`✅ Created resit exams and enrolled students`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${secretaries.length} secretaries`);
    console.log(`   - ${instructors.length} instructors`);
    console.log(`   - ${students.length} students`);
    console.log(`   - ${courses.length} courses`);
    console.log(`   - ${enrollments.length} course enrollments`);
    console.log(`   - 2 resit exams`);
    console.log('\n🔑 Login credentials (all passwords are "password123"):');
    console.log('   Secretary: sarah.johnson@uskudar.edu.tr');
    console.log('   Instructor: youssef.atallah@uskudar.edu.tr');
    console.log('   Student: ali.yilmaz@student.uskudar.edu.tr');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
