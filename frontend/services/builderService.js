import api, { getApiErrorMessage } from './api';

export const builderService = {
  async buildStartup(prompt) {
    try {
      const response = await api.post('/builder/build', { prompt });
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to generate startup idea'));
    }
  },
};
