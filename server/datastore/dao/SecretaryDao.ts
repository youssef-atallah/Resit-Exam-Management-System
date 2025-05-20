import { Course, Instructor, ResitExam, Secretary, Student } from '../../types';
export interface SecretaryDao {
  getSecretaryById(id: string): Promise<Secretary | undefined>;
  getSecretaryByEmail(email: string): Promise<Secretary | undefined>;
  
  listCourses(): Promise<Course[] | undefined>;
  listResitExams(): Promise<ResitExam[] | undefined>;
  listStudents(): Promise<Student[] | undefined>;
  listInstructors(): Promise<Instructor[] | undefined>;
  
  deleteUser(id: string): Promise<void>;
} 