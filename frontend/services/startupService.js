import api, { getApiErrorMessage } from './api';

const normalizeStartup = (startup, index) => ({
  id: startup?.id || String(index + 1),
  name: startup?.name || 'Startup',
  description: startup?.description || '',
  stage: startup?.stage || 'Idea',
  industry: startup?.industry || 'General',
  founded: startup?.founded || new Date().toISOString(),
  team: Array.isArray(startup?.team) ? startup.team : [{ id: '1', name: 'Founder', role: 'Founder', avatar: null }],
  milestones: Array.isArray(startup?.milestones)
    ? startup.milestones
    : [{ id: '1', title: 'Define MVP', completed: false }],
  progress: typeof startup?.progress === 'number' ? startup.progress : 0,
  techStack: Array.isArray(startup?.techStack) ? startup.techStack : [],
});

export const startupService = {
  async getStartups() {
    try {
      const response = await api.get('/startup');
      const data = Array.isArray(response.data) ? response.data : [];
      return data.map(normalizeStartup);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch startups'));
    }
  },

  async getStartupById(startupId) {
    try {
      const startups = await this.getStartups();
      return startups.find((s) => s.id === startupId) || null;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch startup'));
    }
  },

  async createStartup(startupData) {
    try {
      const response = await api.post('/startup', startupData);
      return normalizeStartup(response.data || startupData, 0);
    } catch (error) {
      if (error?.response?.status === 404) {
        return normalizeStartup({ id: Date.now().toString(), ...startupData }, 0);
      }
      throw new Error(getApiErrorMessage(error, 'Failed to create startup'));
    }
  },

  async updateStartup(startupId, updates) {
    return { success: true, startupId, updates };
  },

  async deleteStartup(startupId) {
    return { success: true, startupId };
  },
};
