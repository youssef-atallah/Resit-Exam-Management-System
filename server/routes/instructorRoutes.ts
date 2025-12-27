import express from 'express';
import {
  createInstructor,
  getInstructor,
  deleteInstructor,
  updateInstructorInfo,
  assignInstructorToCourse,
  unassignInstructorFromCourse,
  deleteResitExam,
  getInstructorCourses,
  getInstructorResitExams,
  getInstructorCourseDetails,
  createResitExam,
  updateResitExam,
  updateAStudentResitExamResults,
  getResitExamAllResults,
  updateAllStudentsResitExamResults,
  getResitExam,
  setResitExamAnnouncement,
  setStudentCourseGrades,
  getMyInstructorProfile,
  getMyInstructorCourses,
  getMyInstructorCourseDetails,
  getMyInstructorResitExams,
  updateMyInstructorProfile
} from '../hundlers/instructorHandler';
import { authMiddleware, requireRole, requireOwnerOrRole } from '../Auth/authHandler';

const router = express.Router();

/**
 * ============================================================================
 * INSTRUCTOR ROUTES
 * ============================================================================
 * 
 * Route Organization:
 *   1. JWT-Based Routes - Instructors access their own data (requires JWT auth)
 *   2. Secretary Routes - Instructor CRUD and course assignments
 *   3. Instructor Routes - View courses, manage resit exams, set grades
 *   4. Public Routes - View resit exam information
 * 
 * IMPORTANT: Route order matters! Express matches top-to-bottom.
 *            More specific routes must come before general ones.
 * ============================================================================
 */


// ============================================================================
// JWT-BASED ROUTES - Authenticated Instructor Access
// ============================================================================

// GET /my/instructor/profile - Get authenticated instructor's profile
router.get('/my/instructor/profile', authMiddleware, requireRole('instructor'), getMyInstructorProfile);

// PUT /my/instructor/profile - Update authenticated instructor's profile
router.put('/my/instructor/profile', authMiddleware, requireRole('instructor'), updateMyInstructorProfile);

// GET /my/instructor/courses - Get authenticated instructor's courses
router.get('/my/instructor/courses', authMiddleware, requireRole('instructor'), getMyInstructorCourses);

// GET /my/instructor/course-details - Get authenticated instructor's course details
router.get('/my/instructor/course-details', authMiddleware, requireRole('instructor'), getMyInstructorCourseDetails);

// GET /my/instructor/resit-exams - Get authenticated instructor's resit exams
router.get('/my/instructor/resit-exams', authMiddleware, requireRole('instructor'), getMyInstructorResitExams);




// ============================================================================
// SECRETARY ROUTES - Instructor Management
// ============================================================================

// POST /instructor - Create new instructor account
router.post('/instructor', authMiddleware, requireRole('secretary'), createInstructor);

// GET /instructor/:id - Get instructor information (own data or secretary access)
router.get('/instructor/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructor);

// DELETE /instructor/:id - Delete instructor and all associated data
router.delete('/instructor/:id', authMiddleware, requireRole('secretary'), deleteInstructor);

// PUT /instructor/:id - Update instructor information (name, email, password)
router.put('/instructor/:id', authMiddleware, requireRole('secretary'), updateInstructorInfo);

// POST /instructor/course/:id - Assign instructor to course
router.post('/instructor/course/:id', authMiddleware, requireRole('secretary'), assignInstructorToCourse);

// DELETE /instructor/course/:id - Unassign instructor from course
router.delete('/instructor/course/:id', authMiddleware, requireRole('secretary'), unassignInstructorFromCourse);




// ============================================================================
// INSTRUCTOR ROUTES - View Courses and Students
// ============================================================================

// GET /instructor/courses/:id - Get instructor's course IDs (own data or secretary access)
router.get('/instructor/courses/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourses);

// GET /instructor/cdetails/:id - Get instructor's course details with student counts (own data or secretary access)
router.get('/instructor/cdetails/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourseDetails);

// POST /instructor/course/grades/:courseId - Set grades for multiple students
router.post('/instructor/course/grades/:courseId', authMiddleware, requireRole('instructor'), setStudentCourseGrades);




// ============================================================================
// INSTRUCTOR ROUTES - Resit Exam Management
// ============================================================================

// POST /instructor/r-exam/:id - Create resit exam
router.post('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), createResitExam);

// POST /r-exam/:id - Create resit exam (alternative)
router.post('/r-exam/:id', authMiddleware, requireRole('instructor'), createResitExam);

// PUT /instructor/r-exam/:id - Update resit exam details
router.put('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), updateResitExam);

// DELETE /instructor/r-exam/:id - Delete resit exam
router.delete('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), deleteResitExam);

// GET /instructor/r-exams/:id - Get instructor's resit exams (own data or secretary access)
router.get('/instructor/r-exams/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorResitExams);

// PUT /instructor/r-announcement/:id - Set resit exam announcement
router.put('/instructor/r-announcement/:id', authMiddleware, requireRole('instructor'), setResitExamAnnouncement);




// ============================================================================
// INSTRUCTOR ROUTES - Resit Exam Grading
// ============================================================================

// PUT /instructor/course/:courseId/student/:studentId - Update single student's resit exam grade
router.put('/instructor/course/:courseId/student/:studentId', authMiddleware, requireRole('instructor'), updateAStudentResitExamResults);

// PUT /instructor/resit-results/all/:resitExamId - Update all students' resit exam grades
router.put('/instructor/resit-results/all/:resitExamId', authMiddleware, requireRole('instructor'), updateAllStudentsResitExamResults);

// GET /instructor/resit-results/exam/:resitExamId - Get all results for resit exam
router.get('/instructor/resit-results/exam/:resitExamId', authMiddleware, requireRole('instructor'), getResitExamAllResults);




// ============================================================================
// PUBLIC ROUTES - Resit Exam Information
// ============================================================================

// GET /r-exam/:id - Get resit exam details (all authenticated users)
router.get('/r-exam/:id', authMiddleware, getResitExam);

export default router;