import api from './api';
import {
  dummyDashboardMetrics,
  dummyActivities,
  dummyNotifications,
} from '@/utils/dummyData';

export const dashboardService = {
  async getMetrics() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dummyDashboardMetrics;
    } catch (error) {
      throw new Error('Failed to fetch metrics');
    }
  },

  async getActivities() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dummyActivities;
    } catch (error) {
      throw new Error('Failed to fetch activities');
    }
  },

  async getNotifications() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dummyNotifications;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  },
};
