import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary } from '../types';





// get all courses
export const getCourses: RequestHandler = async (req, res): Promise<any> => {
  const courses = await db.listCourses();
  res.json(courses);
};


// get all resit exams
export const getResitExams: RequestHandler = async (req, res): Promise<any> => {
  const resitExams = await db.listResitExams();
  res.json(resitExams);
};

// get all students
export const getStudents: RequestHandler = async (req, res): Promise<any> => {
  const students = await db.listStudents();
  res.json(students);
};


// get all instructors
export const getInstructors: RequestHandler = async (req, res): Promise<any> => {
  const instructors = await db.listInstructors();
  res.json(instructors);
};

// confirm and add the resit exam location and date and deadline
export const updateResitExamBySecr: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params; // secretary id
  const { 
    courseId,
    examDate,
    deadline,
    location
  } = req.body;

  // Validate required fields
  if (!courseId || !examDate || !deadline || !location) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      missingFields: {
        courseId: !courseId,
        examDate: !examDate,
        deadline: !deadline,
        location: !location,
      }
    });
  }

  try {
    // Validate secretary exists
    const secretary = await db.getSecretaryById(id);
    if (!secretary) {
      return res.status(404).json({
        success: false,
        error: 'Secretary not found'
      });
    }

    // Get the course to extract resitExamId and other details
    const course = await db.getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Instead, fetch the resit exam for this course
    const resitExam = await db.getResitExamByCourseId(courseId);
    if (!resitExam) {
      return res.status(400).json({
        success: false,
        error: 'Course does not have a resit exam'
      });
    }
    const resitExamId = resitExam.id;

    // Validate dates
    const examDateObj = new Date(examDate);
    const deadlineObj = new Date(deadline);
    const now = new Date();

    if (examDateObj < now) {
      return res.status(400).json({
        success: false,
        error: 'Exam date cannot be in the past'
      });
    }

    if (deadlineObj >= examDateObj) {
      return res.status(400).json({
        success: false,
        error: 'Deadline must be before exam date'
      });
    }
    // Update the resit exam
    await db.updateResitExamBySecretary(
      resitExamId,
      examDateObj,
      deadlineObj,
      location,
      course.department // Adding the missing fifth argument (department)
    );

    // Get the updated resit exam
    const updatedResitExam = await db.getResitExam(resitExamId);
    if (!updatedResitExam) {
      throw new Error('Failed to update resit exam');
    }

    return res.status(200).json({
      success: true,
      message: 'Resit exam updated successfully',
      resitExam: {
        id: updatedResitExam.id,
        name: updatedResitExam.name,
        course_id: updatedResitExam.course_id,
        department: updatedResitExam.department,
        examDate: updatedResitExam.examDate,
        deadline: updatedResitExam.deadline,
        location: updatedResitExam.location,
        instructors: updatedResitExam.instructors,
        lettersAllowed: updatedResitExam.lettersAllowed
      }
    });
  } catch (error) {
    console.error('Error updating resit exam:', error);
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json({
          success: false,
          error: error.message
        });
      } else if (error.message.includes('already taken')) {
        return res.status(409).json({
          success: false,
          error: error.message
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error updating resit exam',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};


// // create a resit exam
// export const createResitExamBySecretary: RequestHandler<{ id: string }> = async (req, res): Promise<any> => {
//   const { id } = req.params; // secretary id
//   const { 
//     courseId,
//     examDate,
//     deadline,
//     location
//   } = req.body;

//   const secr_id = id;

//   // Validate required fields
//   if (!courseId || !examDate || !deadline || !location) {
//     return res.status(400).json({
//       success: false,
//       error: 'Missing required fields',
//       missingFields: {
//         courseId: !courseId,
//         examDate: !examDate,
//         deadline: !deadline,
//         location: !location,
//       }
//     });
//   }

  

//   try {
//     // Validate instructor exists
//     const instructor = await db.getInstructorById(id);
//     if (!instructor) {
//       return res.status(404).json({
//         success: false,
//         error: 'Instructor not found'
//       });
//     }

//     // Validate instructor is assigned to the course
//     if (!instructor.courses.includes(courseId)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Instructor not assigned to this course'
//       });
//     }

//     // Get the course to extract resitExamId
//     const course = await db.getCourseById(courseId);
//     if (!course || !course.resitExamId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Course not found or does not have a resit exam ID'
//       });
//     }

//     const name = course.name;
//     const department = course.department;
//     const resitExamId = course.resitExamId;

//     // Create the resit exam using the resitExamId from the course
//     await db.createResitExamBySecretary(
//       secr_id,
//       resitExamId,
//       courseId,
//       examDate,
//       deadline,
//       location
//     );

//     // Get the created resit exam using the resitExamId from the course
//     const createdResitExam = await db.getResitExam(course.resitExamId);
//     if (!createdResitExam) {
//       throw new Error('Failed to create resit exam');
//     }

//     return res.status(201).json({
//       success: true,
//       message: 'Resit exam created successfully',
//       resitExam: {
//         id: createdResitExam.id,
//         name: createdResitExam.name,
//         courseId: createdResitExam.courseId,
//         department: createdResitExam.department,
//         examDate: createdResitExam.examDate,
//         deadline: createdResitExam.deadline,
//         location: createdResitExam.location
//       }
//     });
//   } catch (error) {
//     console.error('Error creating resit exam:', error);
//     if (error instanceof Error) {
//       if (error.message.includes('Unauthorized')) {
//         return res.status(403).json({
//           success: false,
//           error: error.message
//         });
//       } else if (error.message.includes('already taken')) {
//         return res.status(409).json({
//           success: false,
//           error: error.message
//         });
//       }
//     }
//     return res.status(500).json({
//       success: false,
//       error: 'Error creating resit exam',
//       details: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// };