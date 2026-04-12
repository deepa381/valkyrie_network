import api, { getApiErrorMessage } from './api';

const normalizeMatch = (item, index) => {
  const score = typeof item?.score === 'number' ? Math.round(item.score * 100) : item?.matchScore || 0;

  return {
    id: item?.id || String(index + 1),
    name: item?.name || item?.user || 'Founder Match',
    role: item?.role || 'Co-founder',
    avatar: item?.avatar || null,
    matchScore: score,
    skills: Array.isArray(item?.skills) ? item.skills : [],
    location: item?.location || 'Remote',
    bio: item?.bio || 'Potential match from backend.',
    compatibility: item?.compatibility || {},
    highlights: Array.isArray(item?.highlights) ? item.highlights : [],
  };
};

export const matchService = {
  async getMatches(filters = {}) {
    try {
      const response = await api.post('/match', filters);
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(normalizeMatch);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch matches'));
    }
  },

  async getMatchById(matchId) {
    try {
      const matches = await this.getMatches();
      return matches.find((m) => m.id === matchId) || null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch match'));
    }
  },

  async connectWithMatch(matchId) {
    return { success: true, message: `Connection request sent to match ${matchId}` };
  },

  async sendMessage(matchId, message) {
    return { success: true, message: `Message queued for match ${matchId}` };
  },
};
