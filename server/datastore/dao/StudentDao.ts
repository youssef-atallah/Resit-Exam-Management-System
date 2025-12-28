import { Instructor, ResitExam, Secretary, Student, StudentCourseDetails } from '../../types';

export interface StudentDao {

  // student management
  createStudent(student: Student): Promise<void>;
  deleteStudent(id: string): Promise<void>;
  updateStudentInfo(id: string, name: string, email: string, password: string): Promise<void>;
  updateStudent(student: Student): Promise<void>;
  
  // enrollments
  enrollStudentInCourse(studentId: string, courseId: string, grade?: number, gradeLetter?: string): Promise<boolean>;
  enrollStudentInResitExam(studentId: string, resitExamId: string): Promise<boolean>;
  unenrollStudentFromCourse(studentId: string, courseId: string): Promise<void>;
  unenrollStudentFromResitExam(studentId: string, resitExamId: string): Promise<void>;
  
  // access student data
  // getStudentResitExams(id: string): string[] | undefined;
  getAstudent(id: string): Promise<Student | undefined>;
  getStudentCourses(id: string): Promise<string[] | undefined>;
  getStudentCourseDetails(id: string): Promise<StudentCourseDetails[] | undefined>;
  setStudentCourseGrades(courseId: string, grades: { studentId: string; grade: number; gradeLetter: string }[]): Promise<boolean>;
}
