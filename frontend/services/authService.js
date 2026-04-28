import api, { getApiErrorMessage } from './api';

const DEFAULT_PROFILE = {
  id: '1',
  name: 'Founder',
  email: '',
  role: 'founder',
  avatar: null,
  bio: '',
  location: '',
  skills: [],
  experience: [],
  goals: [],
  interests: [],
  achievements: [],
};

const normalizeUser = (profile = {}, fallback = {}) => ({
  ...DEFAULT_PROFILE,
  ...fallback,
  ...profile,
  id: profile._id || profile.id || fallback.id || DEFAULT_PROFILE.id,
});

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      return {
        user: normalizeUser(user, { email }),
        token,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed. Check your email and password.'));
    }
  },

  async signup(userData) {
    try {
      const response = await api.post('/auth/signup', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'founder',
      });
      const { token, user } = response.data;
      return {
        user: normalizeUser(user, { email: userData.email }),
        token,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Signup failed. Please try again.'));
    }
  },

  async logout() {
    return { success: true };
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/user/profile');
      return normalizeUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch user'));
    }
  },

  async updateProfile(updates) {
    try {
      const response = await api.put('/user/profile', updates);
      return normalizeUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update profile'));
    }
  },
};
