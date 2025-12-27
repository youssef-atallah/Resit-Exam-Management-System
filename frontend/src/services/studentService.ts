import api from './api';
import { Course, Grade, ResitExam, ResitApplication } from '../types';

export const studentService = {
  async getProfile(studentId: string) {
    const response = await api.get(`/student/${studentId}`);
    return response.data;
  },

  async getCourses(studentId: string): Promise<Course[]> {
    const response = await api.get(`/student/courses/${studentId}`);
    return response.data || [];
  },

  async getCourseDetails(studentId: string): Promise<Grade[]> {
    const response = await api.get(`/student/c-details/${studentId}`);
    return response.data || [];
  },

  async getResitExams(studentId: string): Promise<ResitExam[]> {
    const response = await api.get(`/student/resit-exams/${studentId}`);
    return response.data || [];
  },

  async applyForResit(studentId: string, resitExamId: string): Promise<ResitApplication> {
    const response = await api.post(`/student/resit-exam/${studentId}`, {
      resitExamId,
    });
    return response.data;
  },

  async getResitApplications(studentId: string): Promise<ResitApplication[]> {
    const response = await api.get(`/student/resit-applications/${studentId}`);
    return response.data || [];
  },
};
