import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => set({ token, isAuthenticated: !!token }),

      setRole: (role) => set({ role }),

      login: (userData, token) =>
        set({
          user: userData,
          token,
          role: userData?.role || 'founder',
          isAuthenticated: !!(userData && token),
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
