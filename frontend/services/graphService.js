import api, { getApiErrorMessage } from './api';

export const graphService = {
  async getGraph() {
    try {
      const response = await api.get('/graph');
      const data = response.data || {};
      return {
        nodes: Array.isArray(data.nodes) ? data.nodes : [],
        edges: Array.isArray(data.edges) ? data.edges : [],
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch network graph'));
    }
  },
};
