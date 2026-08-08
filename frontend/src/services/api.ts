import axios from 'axios';
import type { Semester, Course, Assessment, User } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gradvia_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==== AUTH ====
export const registerUser = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};

// ==== SEMESTERS ====
export const createSemester = async (data: { userId: string; isCurrent: boolean; number?: number }): Promise<Semester> => {
  const response = await api.post('/semesters', data);
  return response.data;
};

export const getSemestersByUserId = async (userId: string): Promise<Semester[]> => {
  const response = await api.get(`/semesters/user/${userId}`);
  return response.data;
};

export const getSemesterById = async (id: string): Promise<Semester> => {
  const response = await api.get(`/semesters/${id}`);
  return response.data;
};

export const updateSemester = async (id: string, data: any): Promise<Semester> => {
  const response = await api.patch(`/semesters/${id}`, data);
  return response.data;
};

export const deleteSemester = async (id: string) => {
  const response = await api.delete(`/semesters/${id}`);
  return response.data;
};

export const bulkSyncSemester = async (payload: import('../types').BulkSyncSemesterPayload): Promise<Semester> => {
  const response = await api.post('/semesters/bulk-sync', payload);
  return response.data;
};

// ==== COURSES ====
export const createCourse = async (data: { semesterId: string; name: string }): Promise<Course> => {
  const response = await api.post('/courses', data);
  return response.data;
};

export const getCoursesBySemesterId = async (semesterId: string): Promise<Course[]> => {
  const response = await api.get(`/courses/semester/${semesterId}`);
  return response.data;
};

export const getCourseDetails = async (courseId: string): Promise<Course> => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};

export const updateCourse = async (id: string, data: any): Promise<Course> => {
  const response = await api.patch(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: string) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

// ==== ASSESSMENTS ====
export const createAssessment = async (data: any): Promise<Assessment> => {
  const response = await api.post('/assessments', data);
  return response.data;
};

export const updateAssessment = async (id: string, data: { grade?: number; weightPercentage?: number; isIncluded?: boolean; targetGrade?: number | null }): Promise<Assessment> => {
  const response = await api.patch(`/assessments/${id}`, data);
  return response.data;
};

export const deleteAssessment = async (id: string) => {
  const response = await api.delete(`/assessments/${id}`);
  return response.data;
};

export default api;
