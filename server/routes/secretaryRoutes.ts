import express from 'express';
import {
  getCourses,
  getInstructors,
  getResitExams,
  getStudents,
  updateResitExamBySecr
} from '../hundlers/secretaryHandler';

const router = express.Router();

/* 
 * ============================================================================
 * SECRETARY ROUTES
 * ============================================================================
 * 
 * Route Organization:
 * - Secretary Dashboard: Administrative operations and system-wide queries
 * 
 * These routes provide secretaries with access to view and manage all
 * entities in the system (courses, students, instructors, resit exams).
 * ============================================================================
 */

// ============================================================================
// SECRETARY DASHBOARD - System-Wide Queries
// ============================================================================

/**
 * Get all courses
 * @route GET /secretary/courses
 * @access Secretary
 * @description Get a list of all courses in the system
 */
router.get('/secretary/courses', getCourses);

/**
 * Get all students
 * @route GET /secretary/students
 * @access Secretary
 * @description Get a list of all students in the system
 */
router.get('/secretary/students', getStudents);

/**
 * Get all instructors
 * @route GET /secretary/instructors
 * @access Secretary
 * @description Get a list of all instructors in the system
 */
router.get('/secretary/instructors', getInstructors);

/**
 * Get all resit exams
 * @route GET /secretary/resit-exams
 * @access Secretary
 * @description Get a list of all resit exams in the system
 */
router.get('/secretary/resit-exams', getResitExams);

// ============================================================================
// SECRETARY DASHBOARD - Resit Exam Management
// ============================================================================

/**
 * Confirm/Update resit exam details
 * @route PUT /secretary/confirm/resit-exam/:id
 * @access Secretary
 * @description Update resit exam information (location, date, deadline)
 * @description This allows secretary to confirm or modify resit exam details set by instructor
 * @param {string} id - Resit Exam ID
 */
router.put('/secretary/confirm/resit-exam/:id', updateResitExamBySecr);

export default router;