import api, { getApiErrorMessage } from './api';

const toPercent = (value, fallback = '+0%') => {
  if (typeof value !== 'number') return fallback;
  return `${value >= 0 ? '+' : ''}${value}%`;
};

export const dashboardService = {
  async getMetrics() {
    try {
      const [startupRes, matchRes, marketplaceRes, graphRes] = await Promise.all([
        api.get('/startup'),
        api.post('/match', {}),
        api.get('/marketplace'),
        api.get('/graph'),
      ]);

      const startups = Array.isArray(startupRes.data) ? startupRes.data : [];
      const matches = Array.isArray(matchRes.data) ? matchRes.data : [];
      const deals = Array.isArray(marketplaceRes.data) ? marketplaceRes.data : [];
      const graph = graphRes.data || {};
      const sessions = Array.isArray(graph.nodes) ? graph.nodes.length : 0;

      return {
        totalMatches: matches.length,
        activeStartups: startups.length,
        investorsInterested: deals.length,
        mentorshipSessions: sessions,
        trend: {
          matches: toPercent(matches.length),
          startups: `+${startups.length}`,
          investors: `+${deals.length}`,
          sessions: `${sessions}`,
        },
      };
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch metrics'));
    }
  },

  async getActivities() {
    try {
      const [startupRes, marketplaceRes] = await Promise.all([
        api.get('/startup'),
        api.get('/marketplace'),
      ]);
      const startups = Array.isArray(startupRes.data) ? startupRes.data : [];
      const deals = Array.isArray(marketplaceRes.data) ? marketplaceRes.data : [];

      const startupActivities = startups.slice(0, 3).map((startup, idx) => ({
        id: `startup-${idx}`,
        type: 'startup',
        title: `${startup.name || 'Startup'} is active`,
        description: `Stage: ${startup.stage || 'Idea'}`,
        timestamp: new Date().toISOString(),
        icon: 'Rocket',
      }));

      const dealActivities = deals.slice(0, 3).map((deal, idx) => ({
        id: `deal-${idx}`,
        type: 'investor',
        title: 'Marketplace update',
        description: deal.deal || 'New investor activity',
        timestamp: new Date().toISOString(),
        icon: 'TrendingUp',
      }));

      return [...startupActivities, ...dealActivities];
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch activities'));
    }
  },

  async getNotifications() {
    try {
      const response = await api.get('/marketplace');
      const deals = Array.isArray(response.data) ? response.data : [];

      return deals.map((deal, idx) => ({
        id: String(idx + 1),
        title: 'Marketplace activity',
        message: deal.deal || 'New deal available',
        read: false,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Failed to fetch notifications'));
    }
  },
};
