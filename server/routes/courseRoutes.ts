import express from 'express';
import {
  getCourseStudents,
  getCourseStatistics,
  updateCourse,
  getCourseInstructor,
  createCourse,
  deleteCourse,
  getCourse
} from '../hundlers/courseHandler';

const router = express.Router();

/* 
 * ============================================================================
 * COURSE ROUTES
 * ============================================================================
 * 
 * Route Organization:
 * - Secretary Dashboard: Course CRUD operations, instructor assignments
 * - Instructor Dashboard: View course details, students, and statistics
 * - Student Dashboard: View course information
 * - Public/Shared: View course details
 * ============================================================================
 */

// ============================================================================
// SECRETARY DASHBOARD - Course Management
// ============================================================================

/**
 * Create a new course
 * @route POST /course
 * @access Secretary
 * @description Create a new course in the system
 */
router.post('/course', createCourse);

/**
 * Update course details
 * @route PUT /course/:id
 * @access Secretary
 * @description Update course name, department, or assign instructor
 * @param {string} id - Course ID
 */
router.put('/course/:id', updateCourse);

/**
 * Delete a course
 * @route DELETE /course/:id
 * @access Secretary
 * @description Delete a course and all associated data (enrollments, grades, resit exams)
 * @param {string} id - Course ID
 */
router.delete('/course/:id', deleteCourse);

// ============================================================================
// INSTRUCTOR DASHBOARD - Course Information
// ============================================================================

/**
 * Get course students
 * @route GET /course/students/:id
 * @access Instructor, Secretary
 * @description Get list of all students enrolled in a course
 * @param {string} id - Course ID
 */
router.get('/course/students/:id', getCourseStudents);

/**
 * Get course statistics
 * @route GET /course/statistics/:id
 * @access Instructor, Secretary
 * @description Get course statistics including enrollment count and grade distribution
 * @param {string} id - Course ID
 */
router.get('/course/statistics/:id', getCourseStatistics);

/**
 * Get course instructor
 * @route GET /course/instructor/:id
 * @access Instructor, Secretary, Student
 * @description Get information about the instructor teaching the course
 * @param {string} id - Course ID
 */
router.get('/course/instructor/:id', getCourseInstructor);

// ============================================================================
// PUBLIC/SHARED - Course Details
// ============================================================================

/**
 * Get course details
 * @route GET /course/:id
 * @access Student, Instructor, Secretary
 * @description Get detailed information about a course
 * @param {string} id - Course ID
 */
router.get('/course/:id', getCourse);

export default router;