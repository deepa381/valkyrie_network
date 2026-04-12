import api, { getApiErrorMessage } from './api';

const DEFAULT_PROFILE = {
  id: '1',
  name: 'User',
  email: '',
  role: 'founder',
  avatar: null,
  bio: '',
  location: '',
  skills: [],
  experience: [],
  goals: [],
  achievements: [],
};

const normalizeUser = (profile = {}, fallback = {}) => ({
  ...DEFAULT_PROFILE,
  ...fallback,
  ...profile,
});

export const authService = {
  async login(email, password) {
    try {
      const loginResponse = await api.post('/auth/login', { email, password });
      const token = loginResponse.data?.token;
      const profileResponse = await api.get('/user/profile');
      const user = normalizeUser(profileResponse.data, { email });

      return {
        user,
        token,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Login failed'));
    }
  },

  async signup(userData) {
    try {
      // Backend currently exposes login only, so signup reuses auth/login.
      const loginResponse = await api.post('/auth/login', {
        email: userData.email,
        password: userData.password,
      });
      const token = loginResponse.data?.token;
      const user = normalizeUser({}, {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });

      return {
        user,
        token,
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Signup failed'));
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
      const current = await this.getCurrentUser();
      return { ...current, ...updates };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update profile'));
    }
  },
};
