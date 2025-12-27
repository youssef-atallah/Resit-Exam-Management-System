import api from './api';
import { User, UserRole } from '../types';

interface LoginResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export const authService = {
  async login(id: string, password: string, role: UserRole): Promise<LoginResponse> {
    try {
      const endpoint = role === 'student'
        ? `/student/${id}`
        : role === 'instructor'
        ? `/instructor/${id}`
        : `/secretary/${id}`;

      const response = await api.get(endpoint);

      if (response.data) {
        const userData = response.data;

        // In a real app, password validation should be on the server
        // For this demo, we're accepting any password for valid users
        const user: User = {
          id: userData.id || id,
          name: userData.name || userData.Name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
          email: userData.email || `${id}@uskudar.edu.tr`,
          role: role,
        };

        return { success: true, user };
      }

      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Auth service error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },
};
