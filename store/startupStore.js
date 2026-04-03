import { create } from 'zustand';

export const useStartupStore = create((set) => ({
  startups: [],
  selectedStartup: null,
  isLoading: false,

  setStartups: (startups) => set({ startups }),

  setSelectedStartup: (startup) => set({ selectedStartup: startup }),

  addStartup: (startup) =>
    set((state) => ({
      startups: [...state.startups, startup],
    })),

  updateStartup: (startupId, updates) =>
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId ? { ...s, ...updates } : s
      ),
      selectedStartup:
        state.selectedStartup?.id === startupId
          ? { ...state.selectedStartup, ...updates }
          : state.selectedStartup,
    })),

  deleteStartup: (startupId) =>
    set((state) => ({
      startups: state.startups.filter((s) => s.id !== startupId),
      selectedStartup:
        state.selectedStartup?.id === startupId ? null : state.selectedStartup,
    })),

  addTeamMember: (startupId, member) =>
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId ? { ...s, team: [...s.team, member] } : s
      ),
    })),

  removeTeamMember: (startupId, memberId) =>
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId
          ? { ...s, team: s.team.filter((m) => m.id !== memberId) }
          : s
      ),
    })),

  toggleMilestone: (startupId, milestoneId) =>
    set((state) => ({
      startups: state.startups.map((s) =>
        s.id === startupId
          ? {
              ...s,
              milestones: s.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              ),
            }
          : s
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
