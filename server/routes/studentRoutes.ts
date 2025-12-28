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
import { authMiddleware, requireRole, requireOwnerOrRole } from '../Auth/authHandler';

const router = Router();

/**
 * ============================================================================
 * STUDENT ROUTES
 * ============================================================================
 * 
 * Route Organization:
 *   1. JWT-Based Routes - Students access their own data (requires JWT auth)
 *   2. Secretary Routes - Student CRUD and enrollment management
 *   3. Student Routes - View information via ID parameter
 *   4. Instructor Routes - View student results and grades
 * 
 * IMPORTANT: Route order matters! Express matches top-to-bottom.
 *            More specific routes must come before general ones.
 * ============================================================================
 */


// ============================================================================
// JWT-BASED ROUTES - Authenticated Student Access
// ============================================================================

// GET /my/profile - Get authenticated student's profile
router.get('/my/profile', authMiddleware, requireRole('student'), getMyProfile);

// PUT /my/profile - Update authenticated student's profile
router.put('/my/profile', authMiddleware, requireRole('student'), updateMyProfile);

// GET /my/courses - Get authenticated student's enrolled courses
router.get('/my/courses', authMiddleware, requireRole('student'), getMyCourses);

// GET /my/course-details - Get authenticated student's courses details with grades
router.get('/my/course-details', authMiddleware, requireRole('student'), getMyCourseDetails);

// GET /my/resit-exams - Get authenticated student's resit exams
router.get('/my/resit-exams', authMiddleware, requireRole('student'), getMyResitExams);

// POST /my/apply-resit - Student self-enrollment in resit exam
router.post('/my/apply-resit', authMiddleware, requireRole('student'), applyForResitExam);

// DELETE /my/cancel-resit - Student self-cancellation of resit exam enrollment
router.delete('/my/cancel-resit', authMiddleware, requireRole('student'), cancelResitExamEnrollment);




// ============================================================================
// SECRETARY ROUTES - Student Management
// ============================================================================

// POST /student - Create new student account
router.post('/student/', authMiddleware, requireRole('secretary'), createAstudent);

// DELETE /student/:id - Delete student and all associated data
router.delete('/student/:id', authMiddleware, requireRole('secretary'), deleteStudent);

// PUT /student/:id - Update student information (name, email, password)
router.put('/student/:id', authMiddleware, requireRole('secretary'), updateStudentInfo);

// POST /student/:id - Enroll student in a course
router.post('/student/:id', authMiddleware, requireRole('secretary'), addCourseToStudent);

// DELETE /student-course/:id - Remove student from course
router.delete('/student-course/:id', authMiddleware, requireRole('secretary'), removeStudentFromCourse);

// POST /student/resit-exam/:id - Enroll student in resit exam
router.post('/student/resit-exam/:id', authMiddleware, requireRole('secretary'), addRistExamToStudent);

// DELETE /student/resit-exam/:id - Remove student from resit exam
router.delete('/student/resit-exam/:id', authMiddleware, requireRole('secretary'), removeStudentFromResitExam);




// ============================================================================
// STUDENT ROUTES - View Information by ID
// ============================================================================

// GET /student/:id - Get student information (own data, or secretary/instructor access)
router.get('/student/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getAstudent);

// GET /student/courses/:id - Get student's enrolled course IDs (own data, or secretary/instructor access)
router.get('/student/courses/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourses);

// GET /student/c-details/:id - Get student's course details with grades (own data, or secretary/instructor access)
router.get('/student/c-details/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentCourseDetails);

// GET /student/resitexams/:id - Get student's resit exams (own data, or secretary/instructor access)
router.get('/student/resitexams/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentResitExams);

// GET /student/r-exams/:id - Get student's resit exams (alternative) (own data, or secretary/instructor access)
router.get('/student/r-exams/:id', authMiddleware, requireOwnerOrRole('secretary', 'instructor'), getStudentResitExams);




// ============================================================================
// INSTRUCTOR ROUTES - View Student Results
// ============================================================================

// GET /instructor/resit-results/student/:studentId - Get all resit exam results for student
router.get('/instructor/resit-results/student/:studentId', authMiddleware, requireRole('instructor'), getStudentAllResitExamResults);

// GET /instructor/resit-results/:studentId/:resitExamId - Get specific resit exam result
router.get('/instructor/resit-results/:studentId/:resitExamId', authMiddleware, requireRole('instructor'), getStudentResitExamResults);

export default router;
