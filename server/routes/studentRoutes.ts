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



/* IMPORTANT: DO NOT change the order of these routes.

Express matches routes from top to bottom. If a general route like `/student/:id`
comes before a more specific route like `/student/resit-exam-remove/:id`,
it will incorrectly capture those requests, leading to unexpected handler calls. */


// Create a new student
router.post('/student/', createAstudent);

// unassign a student from a resit exam
router.delete('/student/resit-exam/:id', removeStudentFromResitExam);

// assign a resit exam to a student
router.post('/student/resit-exam/:id', addRistExamToStudent);

// Get student's resit exams by ID
router.get('/student/resitexams/:id', getStudentResitExams);

// Get student's courses by ID
router.get('/student/courses/:id', getStudentCourses);

// Get student's courses details with grades 
router.get('/student/c-details/:id', getStudentCourseDetails);

// Delete a student by ID
router.delete('/student/:id', deleteStudent);

// Update student information
router.put('/student/:id', updateStudentInfo);

// Add a course to a student
router.post('/student/:id', addCourseToStudent);

// Get a student by ID
router.get('/student/:id', getAstudent);

// Remove a student from a course
router.delete('/student-course/:id', removeStudentFromCourse);


// Get a student's resit exams
router.get('/student/r-exams/:id', getStudentResitExams);


router.get('/instructor/resit-results/student/:studentId', getStudentAllResitExamResults); // still not tested

router.get('/instructor/resit-results/:studentId/:resitExamId', getStudentResitExamResults); // still not tested


export default router;
