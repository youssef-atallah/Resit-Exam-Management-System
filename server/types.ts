import { RequestHandler } from "express";



export interface User {
  id: string;
  name: string;
  email: string;
  password: string;

}


export interface Secretary extends User {
  // especialId: string;
  // examId: string;
  // courseId: string;
  // studentId: string;
  // instructorId: string;
}

export interface InstructorCourseDetails {
  courseId: string;
  courseName: string;
  department: string;
  students: string[];
}

export interface Instructor extends User {
  courses: string[]; // must be added not created | added from Course students
  resitExams: string[]; // must be added not created | added from ResitExam students
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}

export interface Student extends User {
  courses: string[]; // must be added not created | added from Course students
  resitExams: string[]; // must be added not created | added from ResitExam students
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}



export interface Course {
  id: string;
  name: string;
  department: string;
  students: string[];  // Array of student IDs
  instructor_id: string | undefined; // only one instructor
  // courseRoom: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}

export interface ResitExamInfo {
  id: string;
  name: string;
  department: string;
  exam_date: string | null;
  deadline: string | null;
  location: string | null;
}

export interface InstructorCourseDetails {
  courseId: string;
  courseName: string;
  department: string;
  instructor_id: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  student_count: number;
  students: string[];
  resit_exam?: ResitExamInfo;
}

export interface CourseWithResitExam extends Course {
  resitExamLettersAllowed: string[];
}

export interface ResitExam {
  id: string;
  course_id: string; 
  name: string | undefined;
  department: string | undefined;
  instructors: string[] | undefined;  // Changed from instructor: string to instructors: string[]
  lettersAllowed: string[] | undefined;
  examDate: Date | undefined; 
  deadline: Date | undefined;
  location: string | undefined;
  students: string[];
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}

export interface ResitExamResponse {
  id: string;
  courseId: string; 
  name: string;
  department: string;
  instructors: string[];
  lettersAllowed: string[];
  examDate: Date | null;
  deadline: Date | null;
  location: string | null;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
}




export interface StudentCourseGrade {
  studentId: string;
  courseId: string;
  grade: number;
  gradeLetter: string;
}

export interface StudentCourseDetails {
  courseId: string;
  courseName: string;
  department: string;
  instructor_id: string;
  schedule: string;
  location: string;
  grade?: number;
  gradeLetter?: string;
  resit_exam?: {
    id: string;
    deadline: string | null;
    status: string;
  };
}

export type MyExpressHandler<Req, Res> = RequestHandler<string, Partial<Res>, Partial<Req>, any>;

export interface JWTObject {
  id: string;
  role: 'student' | 'instructor' | 'secretary';
}