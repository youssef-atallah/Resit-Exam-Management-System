import { Instructor, ResitExam, Secretary, InstructorCourseDetails } from '../../types';

export interface InstructorDao {

  // instructor management
  createInstructor(instructor: Instructor): Promise<void>;
  getInstructorById(id: string): Promise<Instructor | undefined>;
  
  deleteInstructor(id: string): Promise<void>;
  updateInstructor(id: string, name: string, email: string, password: string): Promise<void>;
  
  // access instructor data
  getInsturctorCourses(id: string): Promise<string[] | undefined>;
  getInstructorCourseDetails(id: string): Promise<InstructorCourseDetails[] | undefined>;
  getInstructorResitExams(id: string): Promise<ResitExam[] | undefined>;
  
  // instructor enrollments
  assignInstructorToCourse(instructorId: string, courseId: string): Promise<boolean>;
  unassignInstructorFromCourse(instructorId: string, courseId: string): Promise<boolean>;
  
}
