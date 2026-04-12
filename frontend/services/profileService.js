import api, { getApiErrorMessage } from './api';

const DEFAULT_DNA = {
  overallScore: 0,
  traits: [
    { name: 'Vision', score: 0 },
    { name: 'Execution', score: 0 },
    { name: 'Resilience', score: 0 },
    { name: 'Communication', score: 0 },
    { name: 'Leadership', score: 0 },
    { name: 'Adaptability', score: 0 },
  ],
  strengths: [],
  blindSpots: [],
  leadershipStyle: 'Not available',
  personalityType: 'Not available',
  stressBehavior: 'Not available',
  idealCofounder: {
    traits: [],
    skills: [],
    personality: 'Not available',
  },
};

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

const normalizeProfile = (profile = {}) => ({
  ...DEFAULT_PROFILE,
  ...profile,
});

const normalizeDna = (payload = {}) => {
  const dnaScore = typeof payload.dna === 'number' ? Math.round(payload.dna * 100) : null;

  return {
    ...DEFAULT_DNA,
    ...payload,
    overallScore: payload.overallScore ?? dnaScore ?? DEFAULT_DNA.overallScore,
    traits: Array.isArray(payload.traits) && payload.traits.length > 0 ? payload.traits : DEFAULT_DNA.traits,
    strengths: Array.isArray(payload.strengths) ? payload.strengths : DEFAULT_DNA.strengths,
    blindSpots: Array.isArray(payload.blindSpots) ? payload.blindSpots : DEFAULT_DNA.blindSpots,
    idealCofounder: {
      ...DEFAULT_DNA.idealCofounder,
      ...(payload.idealCofounder || {}),
      traits: Array.isArray(payload?.idealCofounder?.traits) ? payload.idealCofounder.traits : [],
      skills: Array.isArray(payload?.idealCofounder?.skills) ? payload.idealCofounder.skills : [],
    },
  };
};

export const profileService = {
  async getProfile() {
    try {
      const response = await api.get('/user/profile');
      return normalizeProfile(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch profile'));
    }
  },

  async updateProfile(updates) {
    try {
      const current = await this.getProfile();
      return { ...current, ...updates };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to update profile'));
    }
  },

  async getFounderDna() {
    try {
      const response = await api.post('/intelligence/dna', {});
      return normalizeDna(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch founder DNA'));
    }
  },
};
