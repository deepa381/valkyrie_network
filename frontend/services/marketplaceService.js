import api, { getApiErrorMessage } from './api';

export const marketplaceService = {
  async getOpportunities(type = null) {
    try {
      const params = type ? { type } : {};
      const response = await api.get('/marketplace', { params });
      const data = response.data || {};
      return {
        opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
        deals: Array.isArray(data.deals) ? data.deals : [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch marketplace data'));
    }
  },
};
