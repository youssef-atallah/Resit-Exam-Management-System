import express from 'express';
import {getCourses, getInstructors, getResitExams, getStudents, updateResitExamBySecr } from '../hundlers/secretaryHandler';

const router = express.Router();


// get all courses
router.get('/secretary/courses', getCourses);

// get all resit exams
router.get('/secretary/resit-exams', getResitExams);

// get all students
router.get('/secretary/students', getStudents);

// get all instructors
router.get('/secretary/instructors', getInstructors);

// set the resit exam for information: location, date, deadline 
// a resit exam is set by the instructor
router.put('/secretary/confirm/resit-exam/:id', updateResitExamBySecr);



export default router;