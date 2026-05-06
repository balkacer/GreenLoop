import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../../shared/types';

export interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }) => void;
  setUser: (user: User) => void;
  setTokens: (tokens: { accessToken?: string; refreshToken?: string }) => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      setUser: user => set({ user }),
      setTokens: tokens =>
        set(s => ({
          accessToken: tokens.accessToken ?? s.accessToken,
          refreshToken: tokens.refreshToken ?? s.refreshToken,
        })),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'greenloop-session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: s => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    },
  ),
);
