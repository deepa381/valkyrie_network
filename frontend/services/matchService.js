import api from './api';
import { dummyMatches } from '@/utils/dummyData';

export const matchService = {
  async getMatches() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return dummyMatches;
    } catch (error) {
      throw new Error('Failed to fetch matches');
    }
  },

  async getMatchById(matchId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return dummyMatches.find((m) => m.id === matchId);
    } catch (error) {
      throw new Error('Failed to fetch match');
    }
  },

  async connectWithMatch(matchId) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: 'Connection request sent' };
    } catch (error) {
      throw new Error('Failed to connect');
    }
  },

  async sendMessage(matchId, message) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true, message: 'Message sent' };
    } catch (error) {
      throw new Error('Failed to send message');
    }
  },
};
