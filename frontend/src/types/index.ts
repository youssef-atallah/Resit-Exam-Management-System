export type UserRole = 'student' | 'instructor' | 'secretary';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  department: string;
  enrollmentYear: number;
  gpa?: number;
}

export interface Instructor extends User {
  role: 'instructor';
  instructorId: string;
  department: string;
  title: string;
}

export interface Secretary extends User {
  role: 'secretary';
  secretaryId: string;
  department: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  department: string;
  instructorId: string;
  instructorName?: string;
  semester: string;
  year: number;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  midterm?: number;
  final?: number;
  resit?: number;
  letterGrade?: string;
  isEligibleForResit: boolean;
}

export interface ResitExam {
  id: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  instructorId: string;
  instructorName?: string;
  examDate: string;
  examTime: string;
  location: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  applicationDeadline: string;
}

export interface ResitApplication {
  id: string;
  studentId: string;
  studentName?: string;
  resitExamId: string;
  courseId: string;
  courseName?: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: string;
  grade?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
