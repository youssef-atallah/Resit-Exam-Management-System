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
import { getInstructorDashboard } from '../hundlers/dashboardHandler';
import { authMiddleware, requireRole, requireOwnerOrRole } from '../Auth/authHandler';

const router = express.Router();

/**
 * ============================================================================
 * INSTRUCTOR ROUTES
 * ============================================================================
 * 
 * Naming Convention:
 *   - Use kebab-case for multi-word paths (e.g., course-details, resit-exams)
 *   - Resources are nouns, actions are HTTP verbs
 *   - No abbreviations (cdetails → course-details, r-exam → resit-exam)
 * ============================================================================
 */


// ============================================================================
// JWT-BASED ROUTES - Authenticated Instructor Access (/my/instructor/...)
// ============================================================================

router.get('/my/instructor/dashboard', authMiddleware, requireRole('instructor'), getInstructorDashboard);
router.get('/my/instructor/profile', authMiddleware, requireRole('instructor'), getMyInstructorProfile);
router.put('/my/instructor/profile', authMiddleware, requireRole('instructor'), updateMyInstructorProfile);
router.get('/my/instructor/courses', authMiddleware, requireRole('instructor'), getMyInstructorCourses);
router.get('/my/instructor/course-details', authMiddleware, requireRole('instructor'), getMyInstructorCourseDetails);
router.get('/my/instructor/resit-exams', authMiddleware, requireRole('instructor'), getMyInstructorResitExams);


// ============================================================================
// SECRETARY ROUTES - Instructor Management
// ============================================================================

router.post('/instructor', authMiddleware, requireRole('secretary'), createInstructor);
router.get('/instructor/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructor);
router.delete('/instructor/:id', authMiddleware, requireRole('secretary'), deleteInstructor);
router.put('/instructor/:id', authMiddleware, requireRole('secretary'), updateInstructorInfo);
router.post('/instructor/:id/courses', authMiddleware, requireRole('secretary'), assignInstructorToCourse);
router.delete('/instructor/:id/courses', authMiddleware, requireRole('secretary'), unassignInstructorFromCourse);


// ============================================================================
// INSTRUCTOR ROUTES - View Courses and Students
// ============================================================================

router.get('/instructor/:id/courses', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourses);
router.get('/instructor/:id/course-details', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourseDetails);
router.post('/instructor/course/grades/:courseId', authMiddleware, requireRole('instructor'), setStudentCourseGrades);

// DEPRECATED: Old routes kept for backward compatibility (will be removed in v2)
router.get('/instructor/courses/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourses);
router.get('/instructor/cdetails/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourseDetails);
router.get('/instructor/course-details/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorCourseDetails);


// ============================================================================
// INSTRUCTOR ROUTES - Resit Exam Management
// ============================================================================

router.post('/instructor/:id/resit-exams', authMiddleware, requireRole('instructor'), createResitExam);
router.put('/instructor/resit-exam/:resitExamId', authMiddleware, requireRole('instructor'), updateResitExam);
router.delete('/instructor/resit-exam/:resitExamId', authMiddleware, requireRole('instructor'), deleteResitExam);
router.get('/instructor/:id/resit-exams', authMiddleware, requireOwnerOrRole('secretary'), getInstructorResitExams);
router.put('/instructor/resit-announcement/:resitExamId', authMiddleware, requireRole('instructor'), setResitExamAnnouncement);

// DEPRECATED: Old routes kept for backward compatibility
router.post('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), createResitExam);
router.put('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), updateResitExam);
router.delete('/instructor/r-exam/:id', authMiddleware, requireRole('instructor'), deleteResitExam);
router.get('/instructor/r-exams/:id', authMiddleware, requireOwnerOrRole('secretary'), getInstructorResitExams);
router.put('/instructor/r-announcement/:id', authMiddleware, requireRole('instructor'), setResitExamAnnouncement);


// ============================================================================
// INSTRUCTOR ROUTES - Resit Exam Grading
// ============================================================================

router.put('/instructor/course/:courseId/student/:studentId', authMiddleware, requireRole('instructor'), updateAStudentResitExamResults);
router.put('/instructor/resit-results/all/:resitExamId', authMiddleware, requireRole('instructor'), updateAllStudentsResitExamResults);
router.get('/instructor/resit-results/exam/:resitExamId', authMiddleware, requireRole('instructor'), getResitExamAllResults);


// ============================================================================
// PUBLIC ROUTES - Resit Exam Information
// ============================================================================

router.get('/resit-exam/:id', authMiddleware, getResitExam);

// DEPRECATED: Old route
router.get('/r-exam/:id', authMiddleware, getResitExam);

export default router;