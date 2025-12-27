import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { DashboardLayout } from './components/layout';
import { Login } from './pages/auth/Login';
import {
  StudentDashboard,
  StudentCourses,
  StudentGrades,
  StudentResitExams,
  StudentSchedule,
} from './pages/student';
import {
  InstructorDashboard,
  InstructorCourses,
  InstructorResitExams,
  InstructorGrades,
  InstructorSchedule,
} from './pages/instructor';
import {
  SecretaryDashboard,
  SecretaryStudents,
  SecretaryCourses,
  SecretaryResitExams,
} from './pages/secretary';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Student Routes */}
            <Route
              path="/student"
              element={
                <DashboardLayout>
                  <StudentDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/student/courses"
              element={
                <DashboardLayout>
                  <StudentCourses />
                </DashboardLayout>
              }
            />
            <Route
              path="/student/grades"
              element={
                <DashboardLayout>
                  <StudentGrades />
                </DashboardLayout>
              }
            />
            <Route
              path="/student/resit"
              element={
                <DashboardLayout>
                  <StudentResitExams />
                </DashboardLayout>
              }
            />
            <Route
              path="/student/schedule"
              element={
                <DashboardLayout>
                  <StudentSchedule />
                </DashboardLayout>
              }
            />

            {/* Instructor Routes */}
            <Route
              path="/instructor"
              element={
                <DashboardLayout>
                  <InstructorDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/instructor/courses"
              element={
                <DashboardLayout>
                  <InstructorCourses />
                </DashboardLayout>
              }
            />
            <Route
              path="/instructor/resit"
              element={
                <DashboardLayout>
                  <InstructorResitExams />
                </DashboardLayout>
              }
            />
            <Route
              path="/instructor/grades"
              element={
                <DashboardLayout>
                  <InstructorGrades />
                </DashboardLayout>
              }
            />
            <Route
              path="/instructor/schedule"
              element={
                <DashboardLayout>
                  <InstructorSchedule />
                </DashboardLayout>
              }
            />

            {/* Secretary Routes */}
            <Route
              path="/secretary"
              element={
                <DashboardLayout>
                  <SecretaryDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/secretary/students"
              element={
                <DashboardLayout>
                  <SecretaryStudents />
                </DashboardLayout>
              }
            />
            <Route
              path="/secretary/instructors"
              element={
                <DashboardLayout>
                  <SecretaryStudents />
                </DashboardLayout>
              }
            />
            <Route
              path="/secretary/courses"
              element={
                <DashboardLayout>
                  <SecretaryCourses />
                </DashboardLayout>
              }
            />
            <Route
              path="/secretary/resit"
              element={
                <DashboardLayout>
                  <SecretaryResitExams />
                </DashboardLayout>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
