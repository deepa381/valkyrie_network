import api from './api';
import { dummyUser } from '@/utils/dummyData';

export const authService = {
  async login(email, password) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        user: dummyUser,
        token: 'dummy-jwt-token-' + Date.now(),
      };
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  async signup(userData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser = {
        ...dummyUser,
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
      };

      return {
        user: newUser,
        token: 'dummy-jwt-token-' + Date.now(),
      };
    } catch (error) {
      throw new Error('Signup failed');
    }
  },

  async logout() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true };
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  async getCurrentUser() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyUser;
    } catch (error) {
      throw new Error('Failed to fetch user');
    }
  },

  async updateProfile(updates) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...dummyUser, ...updates };
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },
};
