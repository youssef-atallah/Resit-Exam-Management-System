import { RequestHandler } from 'express';
import { db } from '../datastore';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';

/**
 * ============================================================================
 * DASHBOARD HANDLERS - Consolidated Data Aggregation Endpoints
 * ============================================================================
 * 
 * These handlers implement the "Backend For Frontend" (BFF) pattern.
 * Instead of the frontend making multiple API calls, these endpoints
 * return all data needed for a dashboard in a single request.
 * 
 * Benefits:
 *   - Fewer network round-trips
 *   - Server-side data joining (faster than client-side)
 *   - Simpler frontend code
 * ============================================================================
 */


/**
 * GET /my/dashboard - Student Dashboard Aggregation Endpoint
 * 
 * Returns all data needed for the student dashboard in ONE request:
 * - Profile information
 * - Statistics (course count, resit exams, graded courses)
 * - Course details with grades and instructor names
 * - Upcoming resit exams with full details
 */
export const getStudentDashboard: RequestHandler = async (req, res, next): Promise<any> => {
  try {
    const userId = (req as any).userId;
    
    // Using ApiError - cleaner than manual response
    if (!userId) {
      throw ApiError.unauthorized('No user ID in token');
    }

    // Parallel queries for performance
    const [student, courseDetails] = await Promise.all([
      db.getAstudent(userId),
      db.getStudentCourseDetails(userId)
    ]);

    if (!student) {
      throw ApiError.notFound('Student');
    }

    // Enrich resit exams with full details
    const resitExams = student.resitExams || [];
    const upcomingResitExams = await Promise.all(
      resitExams.slice(0, 5).map(async (resitId: string) => {
        try {
          const exam = await db.getResitExam(resitId);
          if (!exam) return null;
          
          const course = await db.getCourseById(exam.course_id);
          
          return {
            id: exam.id,
            name: exam.name,
            courseName: course?.name || 'Unknown Course',
            examDate: exam.examDate || null,
            deadline: exam.deadline || null,
            location: exam.location || null,
            announcement: (exam as any).announcement || null
          };
        } catch {
          return null;
        }
      })
    );

    // Build response data
    const courses = Array.isArray(courseDetails) ? courseDetails : (courseDetails as any)?.courses || [];
    
    // Using ApiResponse.success - standardized format
    return ApiResponse.success(res, {
      profile: {
        id: student.id,
        name: student.name,
        email: student.email
      },
      stats: {
        activeCourses: student.courses?.length || 0,
        resitExams: resitExams.length,
        gradedCourses: courses.filter((c: any) => c.grade).length
      },
      courses: courses.map((c: any) => ({
        courseId: c.courseId,
        courseName: c.courseName || c.courseId,
        instructorName: c.instructorName || 'TBA',
        grade: c.grade || null,
        gradeLetter: c.gradeLetter || null
      })),
      upcomingResitExams: upcomingResitExams.filter(e => e !== null)
    });

  } catch (error) {
    // Let the centralized error handler deal with it
    next(error);
  }
};



/**
 * GET /my/instructor/dashboard - Instructor Dashboard Aggregation Endpoint
 * 
 * Returns all data needed for the instructor dashboard in ONE request:
 * - Profile information
 * - Statistics (courses, students, resit exams)
 * - Course details with student counts
 * - Active resit exams with registration counts
 */
export const getInstructorDashboard: RequestHandler = async (req, res, next): Promise<any> => {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      throw ApiError.unauthorized('No user ID in token');
    }

    // Parallel queries for performance
    const [instructor, courseDetails] = await Promise.all([
      db.getInstructorById(userId),
      db.getInstructorCourseDetails(userId)
    ]);

    if (!instructor) {
      throw ApiError.notFound('Instructor');
    }

    // Compute statistics
    const courses = courseDetails || [];
    const totalStudents = courses.reduce((sum: number, c: any) => 
      sum + (c.student_count || 0), 0
    );
    const activeResitExams = courses.filter((c: any) => c.resit_exam).length;
    const totalResitRegistrations = courses.reduce((sum: number, c: any) => 
      sum + (c.resit_exam?.registered_students?.length || 0), 0
    );

    // Return standardized response
    return ApiResponse.success(res, {
      profile: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        department: instructor.department || null
      },
      stats: {
        activeCourses: courses.length,
        totalStudents,
        activeResitExams,
        resitRegistrations: totalResitRegistrations
      },
      courses: courses.map((c: any) => ({
        id: c.courseId,
        name: c.courseName,
        studentCount: c.student_count || 0,
        hasResitExam: !!c.resit_exam,
        resitExamId: c.resit_exam?.id || null
      })),
      resitExams: courses
        .filter((c: any) => c.resit_exam)
        .map((c: any) => ({
          id: c.resit_exam.id,
          courseName: c.courseName,
          registeredStudents: c.resit_exam.registered_students?.length || 0,
          examDate: c.resit_exam.exam_date || null,
          location: c.resit_exam.location || null
        }))
    });

  } catch (error) {
    next(error);
  }
};
