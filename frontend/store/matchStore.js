import { create } from 'zustand';

export const useMatchStore = create((set) => ({
  matches: [],
  filteredMatches: [],
  filters: {
    skills: [],
    role: '',
    location: '',
    minScore: 0,
  },
  searchQuery: '',
  isLoading: false,
  selectedMatch: null,

  setMatches: (matches) =>
    set({
      matches,
      filteredMatches: matches,
    }),

  setFilters: (filters) =>
    set((state) => {
      const newFilters = { ...state.filters, ...filters };
      const filtered = state.matches.filter((match) => {
        if (newFilters.minScore && match.matchScore < newFilters.minScore) {
          return false;
        }
        if (
          newFilters.role &&
          !match.role.toLowerCase().includes(newFilters.role.toLowerCase())
        ) {
          return false;
        }
        if (
          newFilters.location &&
          !match.location.toLowerCase().includes(newFilters.location.toLowerCase())
        ) {
          return false;
        }
        if (newFilters.skills.length > 0) {
          const hasSkill = newFilters.skills.some((skill) =>
            match.skills.includes(skill)
          );
          if (!hasSkill) return false;
        }
        return true;
      });
      return {
        filters: newFilters,
        filteredMatches: filtered,
      };
    }),

  setSearchQuery: (query) =>
    set((state) => {
      const filtered = state.matches.filter(
        (match) =>
          match.name.toLowerCase().includes(query.toLowerCase()) ||
          match.bio.toLowerCase().includes(query.toLowerCase()) ||
          match.role.toLowerCase().includes(query.toLowerCase())
      );
      return {
        searchQuery: query,
        filteredMatches: filtered,
      };
    }),

  resetFilters: () =>
    set((state) => ({
      filters: {
        skills: [],
        role: '',
        location: '',
        minScore: 0,
      },
      searchQuery: '',
      filteredMatches: state.matches,
    })),

  setSelectedMatch: (match) => set({ selectedMatch: match }),

  setLoading: (isLoading) => set({ isLoading }),
}));
