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
  getStudentResitExamResults
} from '../hundlers/studentHandler';

const router = Router();

/* 
 * ============================================================================
 * STUDENT ROUTES
 * ============================================================================
 * 
 * IMPORTANT: DO NOT change the order of these routes.
 * Express matches routes from top to bottom. More specific routes must come
 * before general ones to avoid incorrect handler calls.
 * 
 * Route Organization:
 * - Secretary Dashboard: Student CRUD operations, enrollment management
 * - Student Dashboard: View own information, courses, grades, resit exams
 * - Instructor Dashboard: View student results and grades
 * ============================================================================
 */

// ============================================================================
// SECRETARY DASHBOARD - Student Management
// ============================================================================

/**
 * Create a new student
 * @route POST /student/
 * @access Secretary
 * @description Create a new student account in the system
 */
router.post('/student/', createAstudent);

/**
 * Delete a student
 * @route DELETE /student/:id
 * @access Secretary
 * @description Delete a student and all associated data (enrollments, grades, etc.)
 * @param {string} id - Student ID
 */
router.delete('/student/:id', deleteStudent);

/**
 * Update student information
 * @route PUT /student/:id
 * @access Secretary
 * @description Update student's name, email, or password
 * @param {string} id - Student ID
 */
router.put('/student/:id', updateStudentInfo);

/**
 * Enroll student in a course
 * @route POST /student/:id
 * @access Secretary
 * @description Add a student to a course
 * @param {string} id - Student ID
 */
router.post('/student/:id', addCourseToStudent);

/**
 * Remove student from a course
 * @route DELETE /student-course/:id
 * @access Secretary
 * @description Remove a student from a course and delete their grade
 * @param {string} id - Student ID
 */
router.delete('/student-course/:id', removeStudentFromCourse);

/**
 * Enroll student in a resit exam
 * @route POST /student/resit-exam/:id
 * @access Secretary
 * @description Enroll a student in a resit exam
 * @param {string} id - Student ID
 */
router.post('/student/resit-exam/:id', addRistExamToStudent);

/**
 * Remove student from a resit exam
 * @route DELETE /student/resit-exam/:id
 * @access Secretary
 * @description Remove a student from a resit exam
 * @param {string} id - Student ID
 */
router.delete('/student/resit-exam/:id', removeStudentFromResitExam);

// ============================================================================
// STUDENT DASHBOARD - View Own Information
// ============================================================================

/**
 * Get student information
 * @route GET /student/:id
 * @access Student, Secretary
 * @description Get detailed student information including courses and resit exams
 * @param {string} id - Student ID
 */
router.get('/student/:id', getAstudent);

/**
 * Get student's courses
 * @route GET /student/courses/:id
 * @access Student, Secretary
 * @description Get list of course IDs the student is enrolled in
 * @param {string} id - Student ID
 */
router.get('/student/courses/:id', getStudentCourses);

/**
 * Get student's course details with grades
 * @route GET /student/c-details/:id
 * @access Student, Secretary
 * @description Get detailed course information including grades and resit exam status
 * @param {string} id - Student ID
 */
router.get('/student/c-details/:id', getStudentCourseDetails);

/**
 * Get student's resit exams
 * @route GET /student/resitexams/:id
 * @access Student, Secretary
 * @description Get list of resit exams the student is enrolled in
 * @param {string} id - Student ID
 */
router.get('/student/resitexams/:id', getStudentResitExams);

/**
 * Get student's resit exams (alternative endpoint)
 * @route GET /student/r-exams/:id
 * @access Student, Secretary
 * @description Alternative endpoint to get student's resit exams
 * @param {string} id - Student ID
 */
router.get('/student/r-exams/:id', getStudentResitExams);

// ============================================================================
// INSTRUCTOR DASHBOARD - View Student Results
// ============================================================================

/**
 * Get all resit exam results for a student
 * @route GET /instructor/resit-results/student/:studentId
 * @access Instructor
 * @description Get all resit exam results across all courses for a student
 * @param {string} studentId - Student ID
 * @status Not fully tested
 */
router.get('/instructor/resit-results/student/:studentId', getStudentAllResitExamResults);

/**
 * Get specific resit exam result for a student
 * @route GET /instructor/resit-results/:studentId/:resitExamId
 * @access Instructor
 * @description Get a student's result for a specific resit exam
 * @param {string} studentId - Student ID
 * @param {string} resitExamId - Resit Exam ID
 * @status Not fully tested
 */
router.get('/instructor/resit-results/:studentId/:resitExamId', getStudentResitExamResults);

export default router;
