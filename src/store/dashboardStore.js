import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  metrics: {
    totalMatches: 0,
    activeStartups: 0,
    investorsInterested: 0,
    mentorshipSessions: 0,
    trend: {
      matches: '0%',
      startups: '0',
      investors: '0',
      sessions: '0',
    },
  },

  activities: [],
  notifications: [],
  unreadCount: 0,

  setMetrics: (metrics) => set({ metrics }),

  setActivities: (activities) => set({ activities }),

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },

  markNotificationRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
}));
