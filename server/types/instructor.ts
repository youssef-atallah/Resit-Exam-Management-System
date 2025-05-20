export interface ResitExamInfo {
  id: string;
  name: string;
  department: string;
  exam_date: string;
  deadline: string;
  location: string;
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