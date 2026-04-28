import api, { getApiErrorMessage } from './api';

const DEFAULT_DNA = {
  overallScore: 72,
  personalityType: 'Visionary Builder',
  leadershipStyle: 'Transformational',
  stressBehavior: 'Tends to over-analyze and delay decisions under pressure.',
  traits: [
    { name: 'Vision', score: 85 },
    { name: 'Execution', score: 72 },
    { name: 'Resilience', score: 78 },
    { name: 'Communication', score: 68 },
    { name: 'Leadership', score: 75 },
    { name: 'Adaptability', score: 80 },
  ],
  strengths: [
    'Exceptional ability to inspire and align teams around a shared vision.',
    'Strong analytical thinking that turns ambiguity into clear strategies.',
    'Relentless execution — you ship fast and learn faster.',
  ],
  blindSpots: [
    'Tendency to take on too much without delegating effectively.',
    'Perfectionism that can slow down shipping and iteration cycles.',
  ],
  idealCofounder: {
    traits: ['Analytical', 'Detail-oriented'],
    skills: ['Operations', 'Finance'],
    personality: 'Methodical Executor',
  },
};

export const intelligenceService = {
  async getDna() {
    try {
      const response = await api.post('/intelligence/dna', {});
      return { ...DEFAULT_DNA, ...response.data };
    } catch (error) {
      // Always return fallback data — never break the UI
      return DEFAULT_DNA;
    }
  },

  async getTwin() {
    try {
      const response = await api.post('/intelligence/twin', {});
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch digital twin'));
    }
  },
};
