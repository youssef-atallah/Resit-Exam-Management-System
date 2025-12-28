import { Request, Response, RequestHandler } from 'express';
import { db } from '../datastore';
import { Secretary, Notification, Student, Instructor } from '../types';
import { v4 as uuidv4 } from 'uuid';




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

    // =====================================================
    // CREATE NOTIFICATIONS FOR STUDENTS AND INSTRUCTORS
    // =====================================================
    const notifications: Notification[] = [];
    const formattedDate = examDateObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const formattedDeadline = deadlineObj.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Notify enrolled students
    if (updatedResitExam.students && Array.isArray(updatedResitExam.students)) {
      for (const studentId of updatedResitExam.students) {
        notifications.push({
          id: uuidv4(),
          userId: studentId,
          type: 'resit_confirmed',
          title: `Resit Exam Confirmed: ${course.name}`,
          message: `The resit exam for ${course.name} has been scheduled for ${formattedDate} at ${location}. Registration deadline: ${formattedDeadline}`,
          relatedEntityType: 'resit_exam',
          relatedEntityId: resitExamId,
          isRead: false,
          createdAt: new Date()
        });
      }
    }

    // Notify the course instructor
    if (course.instructor_id) {
      notifications.push({
        id: uuidv4(),
        userId: course.instructor_id,
        type: 'resit_confirmed',
        title: `Resit Exam Confirmed: ${course.name}`,
        message: `The resit exam for ${course.name} has been scheduled for ${formattedDate} at ${location}. Registration deadline: ${formattedDeadline}`,
        relatedEntityType: 'resit_exam',
        relatedEntityId: resitExamId,
        isRead: false,
        createdAt: new Date()
      });
    }

    // Save all notifications
    if (notifications.length > 0) {
      try {
        await db.createNotifications(notifications);
        console.log(`Created ${notifications.length} notifications for resit exam confirmation`);
      } catch (notifError) {
        console.error('Error creating notifications:', notifError);
        // Don't fail the whole request if notifications fail
      }
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
      },
      notificationsSent: notifications.length
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

export const updateStudent: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  const { name, email, department, yearLevel } = req.body;

  try {
    const student = await db.getAstudent(id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.department = department || student.department;
    student.yearLevel = yearLevel || student.yearLevel;

    await db.updateStudent(student);
    
    return res.json({ success: true, message: 'Student updated successfully' });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ success: false, error: 'Failed to update student' });
  }
};

export const deleteStudent: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  
  try {
    await db.deleteStudent(id);
    return res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete student' });
  }
};

export const createStudent: RequestHandler = async (req, res): Promise<any> => {
  const { id, name, email, password, department, yearLevel } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    
    // Check ID existence?
    // db.createStudent will fail if ID exists (PK).

    const student: Student = {
      id,
      name,
      email,
      password,
      department,
      yearLevel: yearLevel ? parseInt(yearLevel) : undefined,
      courses: [],
      resitExams: [],
      createdAt: new Date(),
      createdBy: (req as any).user?.id || 'secretary',
      updatedAt: null
    };

    await db.createStudent(student);
    
    return res.status(201).json({ success: true, message: 'Student created successfully' });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ success: false, error: 'Failed to create student' });
  }
};

export const updateInstructor: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  const { name, email, password, department } = req.body;

  try {
    const instructor = await db.getInstructorById(id);
    if (!instructor) {
      return res.status(404).json({ success: false, error: 'Instructor not found' });
    }

    instructor.name = name || instructor.name;
    instructor.email = email || instructor.email;
    if (password) instructor.password = password; 
    instructor.department = department || instructor.department;

    await db.updateInstructor(instructor);
    
    return res.json({ success: true, message: 'Instructor updated successfully' });
  } catch (error) {
    console.error('Error updating instructor:', error);
    return res.status(500).json({ success: false, error: 'Failed to update instructor' });
  }
};

export const deleteInstructor: RequestHandler = async (req, res): Promise<any> => {
  const { id } = req.params;
  
  try {
    await db.deleteInstructor(id);
    return res.json({ success: true, message: 'Instructor deleted successfully' });
  } catch (error) {
    console.error('Error deleting instructor:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete instructor' });
  }
};

export const createInstructor: RequestHandler = async (req, res): Promise<any> => {
  const { id, name, email, password, department } = req.body;

  if (!id || !name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({ success: false, error: 'Email already exists' });
    }
    
    const instructor: Instructor = {
      id,
      name,
      email,
      password,
      courses: [],
      resitExams: [],
      department,
      createdAt: new Date(),
      createdBy: (req as any).user?.id || 'secretary',
      updatedAt: null
    };

    await db.createInstructor(instructor);
    
    return res.status(201).json({ success: true, message: 'Instructor created successfully' });
  } catch (error) {
    console.error('Error creating instructor:', error);
    return res.status(500).json({ success: false, error: 'Failed to create instructor' });
  }
};