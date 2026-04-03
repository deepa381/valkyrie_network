import api from './api';
import { dummyStartups } from '@/utils/dummyData';

export const startupService = {
  async getStartups() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dummyStartups;
    } catch (error) {
      throw new Error('Failed to fetch startups');
    }
  },

  async getStartupById(startupId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyStartups.find((s) => s.id === startupId);
    } catch (error) {
      throw new Error('Failed to fetch startup');
    }
  },

  async createStartup(startupData) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newStartup = {
        id: Date.now().toString(),
        ...startupData,
        founded: new Date().toISOString(),
        team: [{ id: '1', name: 'Alex Morgan', role: 'Founder', avatar: null }],
        milestones: [
          { id: '1', title: 'Define MVP features', completed: false },
          { id: '2', title: 'Build core product', completed: false },
          { id: '3', title: 'Get first 10 users', completed: false },
          { id: '4', title: 'Raise seed round', completed: false },
        ],
        progress: 0,
      };
      return newStartup;
    } catch (error) {
      throw new Error('Failed to create startup');
    }
  },

  async updateStartup(startupId, updates) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update startup');
    }
  },

  async deleteStartup(startupId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete startup');
    }
  },
};
