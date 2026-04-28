import api, { getApiErrorMessage } from './api';

const toPercent = (value, fallback = '+0%') => {
  if (typeof value !== 'number') return fallback;
  return `${value >= 0 ? '+' : ''}${value}%`;
};

export const dashboardService = {
  async getMetrics() {
    try {
      const [startupRes, matchRes, marketplaceRes, graphRes] = await Promise.all([
        api.get('/startup').catch(() => ({ data: [] })),
        api.post('/match', {}).catch(() => ({ data: [] })),
        api.get('/marketplace').catch(() => ({ data: {} })),
        api.get('/graph').catch(() => ({ data: {} })),
      ]);

      const startups = Array.isArray(startupRes.data) ? startupRes.data : [];
      const matches = Array.isArray(matchRes.data) ? matchRes.data : [];

      // Backend returns { opportunities, deals }
      const marketplaceData = marketplaceRes.data || {};
      const deals = Array.isArray(marketplaceData.deals) ? marketplaceData.deals
        : Array.isArray(marketplaceData) ? marketplaceData : [];

      const graph = graphRes.data || {};
      const sessions = Array.isArray(graph.nodes) ? graph.nodes.filter((n) => n.type === 'mentor').length : 0;

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
      // Return safe defaults — never crash the dashboard
      return {
        totalMatches: 0, activeStartups: 0, investorsInterested: 0, mentorshipSessions: 0,
        trend: { matches: '+0%', startups: '+0', investors: '+0', sessions: '0' },
      };
    }
  },

  async getActivities() {
    try {
      const [startupRes, marketplaceRes] = await Promise.all([
        api.get('/startup').catch(() => ({ data: [] })),
        api.get('/marketplace').catch(() => ({ data: {} })),
      ]);

      const startups = Array.isArray(startupRes.data) ? startupRes.data : [];
      const marketplaceData = marketplaceRes.data || {};
      const deals = Array.isArray(marketplaceData.deals) ? marketplaceData.deals : [];

      const startupActivities = startups.slice(0, 3).map((startup, idx) => ({
        id: `startup-${idx}`,
        type: 'startup',
        title: `${startup.name || 'Startup'} is active`,
        description: `Stage: ${startup.stage || 'Idea'}`,
        timestamp: new Date().toISOString(),
        icon: 'Rocket',
      }));

      const dealActivities = deals.slice(0, 2).map((deal, idx) => ({
        id: `deal-${idx}`,
        type: 'investor',
        title: 'New marketplace opportunity',
        description: deal.deal || deal.title || 'Funding opportunity available',
        timestamp: new Date().toISOString(),
        icon: 'TrendingUp',
      }));

      const allActivities = [...startupActivities, ...dealActivities];

      // Always return at least some fallback activity
      if (allActivities.length === 0) {
        return [
          { id: 'fb-1', type: 'startup', title: 'Welcome to Valkyrie Network', description: 'Complete your profile to get started', timestamp: new Date().toISOString(), icon: 'Zap' },
          { id: 'fb-2', type: 'match', title: 'Explore your matches', description: 'Find co-founders aligned to your goals', timestamp: new Date().toISOString(), icon: 'Users' },
        ];
      }

      return allActivities;
    } catch (error) {
      return [
        { id: 'fb-1', type: 'startup', title: 'Welcome to Valkyrie Network', description: 'Start building your profile', timestamp: new Date().toISOString(), icon: 'Zap' },
      ];
    }
  },

  async getNotifications() {
    try {
      const response = await api.get('/marketplace');
      const data = response.data || {};
      const opportunities = Array.isArray(data.opportunities) ? data.opportunities : [];

      return opportunities.slice(0, 3).map((op, idx) => ({
        id: String(idx + 1),
        title: op.title || 'New opportunity',
        message: op.description || 'New funding opportunity available',
        read: false,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      return [];
    }
  },
};
