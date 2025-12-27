import api from './api';
import { Course, ResitExam, ResitApplication } from '../types';

export const instructorService = {
  async getProfile(instructorId: string) {
    const response = await api.get(`/instructor/${instructorId}`);
    return response.data;
  },

  async getCourses(instructorId: string): Promise<Course[]> {
    const response = await api.get(`/instructor/courses/${instructorId}`);
    return response.data || [];
  },

  async getResitExams(instructorId: string): Promise<ResitExam[]> {
    const response = await api.get(`/instructor/r-exams/${instructorId}`);
    return response.data || [];
  },

  async createResitExam(data: Partial<ResitExam>): Promise<ResitExam> {
    const response = await api.post('/r-exam', data);
    return response.data;
  },

  async updateResitExam(examId: string, data: Partial<ResitExam>): Promise<ResitExam> {
    const response = await api.put(`/r-exam/${examId}`, data);
    return response.data;
  },

  async getResitApplications(examId: string): Promise<ResitApplication[]> {
    const response = await api.get(`/r-exam/${examId}/applications`);
    return response.data || [];
  },

  async updateStudentGrade(
    examId: string,
    studentId: string,
    grade: number
  ): Promise<void> {
    await api.put(`/r-exam/${examId}/grade`, {
      studentId,
      grade,
    });
  },

  async getStudentsForCourse(courseId: string) {
    const response = await api.get(`/course/${courseId}/students`);
    return response.data || [];
  },
};
