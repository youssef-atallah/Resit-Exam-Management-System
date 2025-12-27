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
  setStudentCourseGrades
} from '../hundlers/instructorHandler';

const router = express.Router();

/* 
 * ============================================================================
 * INSTRUCTOR ROUTES
 * ============================================================================
 * 
 * IMPORTANT: DO NOT change the order of these routes.
 * Express matches routes in the order they are defined.
 * More specific routes must come BEFORE general ones to avoid incorrect
 * handler calls.
 * 
 * Route Organization:
 * - Secretary Dashboard: Instructor CRUD operations, course assignments
 * - Instructor Dashboard: View courses, manage resit exams, set grades
 * - Public/Shared: View resit exam information
 * ============================================================================
 */

// ============================================================================
// SECRETARY DASHBOARD - Instructor Management
// ============================================================================

/**
 * Create a new instructor
 * @route POST /instructor
 * @access Secretary
 * @description Create a new instructor account in the system
 */
router.post('/instructor', createInstructor);

/**
 * Get instructor information
 * @route GET /instructor/:id
 * @access Secretary, Instructor
 * @description Get detailed instructor information including courses and resit exams
 * @param {string} id - Instructor ID
 */
router.get('/instructor/:id', getInstructor);

/**
 * Delete an instructor
 * @route DELETE /instructor/:id
 * @access Secretary
 * @description Delete an instructor and all associated data
 * @param {string} id - Instructor ID
 */
router.delete('/instructor/:id', deleteInstructor);

/**
 * Update instructor information
 * @route PUT /instructor/:id
 * @access Secretary
 * @description Update instructor's name, email, or password
 * @param {string} id - Instructor ID
 */
router.put('/instructor/:id', updateInstructorInfo);

/**
 * Assign instructor to a course
 * @route POST /instructor/course/:id
 * @access Secretary
 * @description Assign an instructor to teach a course
 * @param {string} id - Instructor ID
 */
router.post('/instructor/course/:id', assignInstructorToCourse);

/**
 * Unassign instructor from a course
 * @route DELETE /instructor/course/:id
 * @access Secretary
 * @description Remove an instructor from a course
 * @param {string} id - Instructor ID
 */
router.delete('/instructor/course/:id', unassignInstructorFromCourse);

// ============================================================================
// INSTRUCTOR DASHBOARD - View Courses and Students
// ============================================================================

/**
 * Get instructor's courses
 * @route GET /instructor/courses/:id
 * @access Instructor
 * @description Get list of course IDs taught by the instructor
 * @param {string} id - Instructor ID
 */
router.get('/instructor/courses/:id', getInstructorCourses);

/**
 * Get instructor's course details
 * @route GET /instructor/cdetails/:id
 * @access Instructor
 * @description Get detailed information about courses including student counts and resit exams
 * @param {string} id - Instructor ID
 */
router.get('/instructor/cdetails/:id', getInstructorCourseDetails);

/**
 * Set student course grades
 * @route POST /instructor/course/grades/:courseId
 * @access Instructor
 * @description Set grades for multiple students in a course
 * @param {string} courseId - Course ID
 */
router.post('/instructor/course/grades/:courseId', setStudentCourseGrades);

// ============================================================================
// INSTRUCTOR DASHBOARD - Resit Exam Management
// ============================================================================

/**
 * Create a resit exam
 * @route POST /instructor/r-exam/:id
 * @access Instructor
 * @description Create a new resit exam for a course
 * @param {string} id - Instructor ID
 */
router.post('/instructor/r-exam/:id', createResitExam);

/**
 * Create a resit exam (alternative endpoint)
 * @route POST /r-exam/:id
 * @access Instructor
 * @description Alternative endpoint to create a resit exam
 * @param {string} id - Instructor ID
 */
router.post('/r-exam/:id', createResitExam);

/**
 * Update resit exam details
 * @route PUT /instructor/r-exam/:id
 * @access Instructor
 * @description Update resit exam date, location, or deadline
 * @param {string} id - Resit Exam ID
 */
router.put('/instructor/r-exam/:id', updateResitExam);

/**
 * Delete a resit exam
 * @route DELETE /instructor/r-exam/:id
 * @access Instructor
 * @description Delete a resit exam and all associated data
 * @param {string} id - Resit Exam ID
 */
router.delete('/instructor/r-exam/:id', deleteResitExam);

/**
 * Get instructor's resit exams
 * @route GET /instructor/r-exams/:id
 * @access Instructor
 * @description Get all resit exams created by or assigned to the instructor
 * @param {string} id - Instructor ID
 */
router.get('/instructor/r-exams/:id', getInstructorResitExams);

/**
 * Set resit exam announcement
 * @route PUT /instructor/r-announcement/:id
 * @access Instructor
 * @description Update the announcement message for a resit exam
 * @param {string} id - Resit Exam ID
 */
router.put('/instructor/r-announcement/:id', setResitExamAnnouncement);

// ============================================================================
// INSTRUCTOR DASHBOARD - Resit Exam Grading
// ============================================================================

/**
 * Update single student's resit exam grade
 * @route PUT /instructor/course/:courseId/student/:studentId
 * @access Instructor
 * @description Update the grade for a single student in a resit exam
 * @param {string} courseId - Course ID
 * @param {string} studentId - Student ID
 */
router.put('/instructor/course/:courseId/student/:studentId', updateAStudentResitExamResults);

/**
 * Update all students' resit exam grades
 * @route PUT /instructor/resit-results/all/:resitExamId
 * @access Instructor
 * @description Update grades for all students in a resit exam at once
 * @param {string} resitExamId - Resit Exam ID
 */
router.put('/instructor/resit-results/all/:resitExamId', updateAllStudentsResitExamResults);

/**
 * Get all results for a resit exam
 * @route GET /instructor/resit-results/exam/:resitExamId
 * @access Instructor
 * @description Get all student results for a specific resit exam
 * @param {string} resitExamId - Resit Exam ID
 * @status Experimental - not fully tested
 */
router.get('/instructor/resit-results/exam/:resitExamId', getResitExamAllResults);

// ============================================================================
// PUBLIC/SHARED - Resit Exam Information
// ============================================================================

/**
 * Get resit exam details
 * @route GET /r-exam/:id
 * @access Student, Instructor, Secretary
 * @description Get detailed information about a resit exam
 * @param {string} id - Resit Exam ID
 */
router.get('/r-exam/:id', getResitExam);

export default router;