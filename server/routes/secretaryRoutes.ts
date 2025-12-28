import express from 'express';
import {
  getCourses,
  getInstructors,
  getResitExams,
  getStudents,
  updateResitExamBySecr,
  updateStudent,
  deleteStudent,
  createStudent,
  updateInstructor,
  deleteInstructor,
  createInstructor
} from '../hundlers/secretaryHandler';
import { authMiddleware, requireRole } from '../Auth/authHandler';

const router = express.Router();

/**
 * ============================================================================
 * SECRETARY ROUTES
 * ============================================================================
 * 
 * Route Organization:
 *   1. System-Wide Queries - View all entities in the system
 *   2. Resit Exam Management - Confirm and update resit exam details
 *   3. Student Management - Edit and delete student records
 * 
 * These routes provide secretaries with administrative access to manage
 * courses, students, instructors, and resit exams.
 * ============================================================================
 */


// ============================================================================
// SECRETARY ROUTES - System-Wide Queries
// ============================================================================

// GET /secretary/courses - Get all courses
router.get('/secretary/courses', authMiddleware, requireRole('secretary'), getCourses);

// GET /secretary/students - Get all students
router.get('/secretary/students', authMiddleware, requireRole('secretary'), getStudents);

// GET /secretary/instructors - Get all instructors
router.get('/secretary/instructors', authMiddleware, requireRole('secretary'), getInstructors);

// GET /secretary/resit-exams - Get all resit exams
router.get('/secretary/resit-exams', authMiddleware, requireRole('secretary'), getResitExams);




// ============================================================================
// SECRETARY ROUTES - Resit Exam Management
// ============================================================================

// PUT /secretary/confirm/resit-exam/:id - Confirm/update resit exam details
router.put('/secretary/confirm/resit-exam/:id', authMiddleware, requireRole('secretary'), updateResitExamBySecr);


// ============================================================================
// SECRETARY ROUTES - Student Management
// ============================================================================

// PUT /secretary/students/:id - Update student details
router.put('/secretary/students/:id', authMiddleware, requireRole('secretary'), updateStudent);

// POST /secretary/students - Create a new student
router.post('/secretary/students', authMiddleware, requireRole('secretary'), createStudent);

// DELETE /secretary/students/:id - Delete a student
router.delete('/secretary/students/:id', authMiddleware, requireRole('secretary'), deleteStudent);


// ============================================================================
// SECRETARY ROUTES - Instructor Management
// ============================================================================

// PUT /secretary/instructors/:id - Update instructor details
router.put('/secretary/instructors/:id', authMiddleware, requireRole('secretary'), updateInstructor);

// POST /secretary/instructors - Create a new instructor
router.post('/secretary/instructors', authMiddleware, requireRole('secretary'), createInstructor);

// DELETE /secretary/instructors/:id - Delete a instructor
router.delete('/secretary/instructors/:id', authMiddleware, requireRole('secretary'), deleteInstructor);

export default router;