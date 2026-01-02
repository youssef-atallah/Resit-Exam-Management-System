import { Router } from 'express';
import { 
  createAstudent, 
  getAstudent, 
  deleteStudent, 
  updateStudentInfo, 
  addCourseToStudent, 
  addRistExamToStudent, 
  removeStudentFromCourse, 
  removeStudentFromResitExam, 
  getStudentResitExams, 
  getStudentCourses,
  getStudentCourseDetails, 
  getStudentAllResitExamResults,
  getStudentResitExamResults,
  getMyProfile,
  getMyCourses,
  getMyCourseDetails,
  getMyResitExams,
  updateMyProfile,
  applyForResitExam,
  cancelResitExamEnrollment
} from '../hundlers/studentHandler';
import { getStudentDashboard } from '../hundlers/dashboardHandler';
import { authMiddleware, requireRole, requireOwnerOrRole } from '../Auth/authHandler';

const router = Router();

/**
 * ============================================================================
 * STUDENT ROUTES
 * ============================================================================
 */


// ============================================================================
// JWT-BASED ROUTES - Authenticated Student Access (/my/...)
// ============================================================================

router.get('/my/dashboard', authMiddleware, requireRole('student'), getStudentDashboard);
router.get('/my/profile', authMiddleware, requireRole('student'), getMyProfile);
router.put('/my/profile', authMiddleware, requireRole('student'), updateMyProfile);
router.get('/my/courses', authMiddleware, requireRole('student'), getMyCourses);
router.get('/my/course-details', authMiddleware, requireRole('student'), getMyCourseDetails);
router.get('/my/resit-exams', authMiddleware, requireRole('student'), getMyResitExams);
router.post('/my/apply-resit', authMiddleware, requireRole('student'), applyForResitExam);
router.delete('/my/cancel-resit', authMiddleware, requireRole('student'), cancelResitExamEnrollment);


// ============================================================================
// SECRETARY ROUTES - Student Management
// ============================================================================

router.post('/student/', authMiddleware, requireRole('secretary'), createAstudent);
router.delete('/student/:id', authMiddleware, requireRole('secretary'), deleteStudent);
router.put('/student/:id', authMiddleware, requireRole('secretary'), updateStudentInfo);
router.post('/student/:id', authMiddleware, requireRole('secretary'), addCourseToStudent);
router.delete('/student/:id/courses', authMiddleware, requireRole('secretary'), removeStudentFromCourse);
router.post('/student/:id/resit-exams', authMiddleware, requireRole('secretary'), addRistExamToStudent);
router.delete('/student/:id/resit-exams', authMiddleware, requireRole('secretary'), removeStudentFromResitExam);


// ============================================================================
// STUDENT ROUTES - View Information by ID
// ============================================================================

router.get('/student/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getAstudent);
router.get('/student/:id/courses', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourses);
router.get('/student/:id/course-details', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourseDetails);
router.get('/student/:id/resit-exams', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentResitExams);

// DEPRECATED: Old routes kept for backward compatibility (will be removed in v2)
router.get('/student/courses/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourses);
router.get('/student/c-details/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourseDetails);
router.get('/student/course-details/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourseDetails);
router.get('/student/resitexams/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentResitExams);


// ============================================================================
// INSTRUCTOR ROUTES - View Student Results
// ============================================================================

router.get('/instructor/resit-results/student/:studentId', authMiddleware, requireRole('instructor'), getStudentAllResitExamResults);
router.get('/instructor/resit-results/:studentId/:resitExamId', authMiddleware, requireRole('instructor'), getStudentResitExamResults);

export default router;
