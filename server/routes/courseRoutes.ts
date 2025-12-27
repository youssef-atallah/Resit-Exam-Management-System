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
import { authMiddleware, requireRole } from '../Auth/authHandler';

const router = express.Router();

/**
 * ============================================================================
 * COURSE ROUTES
 * ============================================================================
 * 
 * Route Organization:
 *   1. Secretary Routes - Course CRUD operations
 *   2. Instructor Routes - View course details, students, and statistics
 *   3. Public Routes - View course information
 * ============================================================================
 */


// ============================================================================
// SECRETARY ROUTES - Course Management
// ============================================================================

// POST /course - Create new course
router.post('/course', authMiddleware, requireRole('secretary'), createCourse);

// PUT /course/:id - Update course details (name, department, instructor)
router.put('/course/:id', authMiddleware, requireRole('secretary'), updateCourse);

// DELETE /course/:id - Delete course and all associated data
router.delete('/course/:id', authMiddleware, requireRole('secretary'), deleteCourse);




// ============================================================================
// INSTRUCTOR ROUTES - Course Information
// ============================================================================

// GET /course/students/:id - Get all students enrolled in course
router.get('/course/students/:id', authMiddleware, requireRole('instructor', 'secretary'), getCourseStudents);

// GET /course/statistics/:id - Get course statistics (enrollment, grade distribution)
router.get('/course/statistics/:id', authMiddleware, requireRole('instructor', 'secretary'), getCourseStatistics);

// GET /course/instructor/:id - Get course instructor information
router.get('/course/instructor/:id', authMiddleware, getCourseInstructor);




// ============================================================================
// PUBLIC ROUTES - Course Details
// ============================================================================

// GET /course/:id - Get course details (all authenticated users)
router.get('/course/:id', authMiddleware, getCourse);

export default router;