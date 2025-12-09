// src/lib/store/auth.ts

import { router } from 'expo-router';
import { Alert } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SESSION } from '~/lib/keys';
import { storage } from '~/lib/utils';
import client from '../graphql/apolloClient';

export type Session = {
  userId: number;
  jwt: string;
  profileId?: number | null;
  phoneNumber: string;
  email: string;
  isPhoneNumberVerified: boolean;
  isEmailVerified: boolean;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | 'O';
} | null;

interface SessionState {
  session: Session;
  loadingSession: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface SessionActions {
  setSession: (updates: Partial<Session> | Session) => void;
  clearSession: () => void;
  setLoadingSession: (loading: boolean) => void;
  setIsHydrated: (hydrated: boolean) => void;
  setProfileId: (profileId: number | null) => void;
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      // Initial state
      session: null,
      loadingSession: true,
      isAuthenticated: false,
      isHydrated: false,

      // BULLETPROOF: isAuthenticated = true ONLY if jwt exists
      setSession: (updates) => {
        set((state) => {
          const current = state.session || {};
          const newSession = { ...current, ...(updates as any) } as Session;
          const hasValidJwt = !!newSession?.jwt?.trim();

          return {
            session: hasValidJwt ? newSession : null,
            isAuthenticated: hasValidJwt,
            loadingSession: false,
          };
        });
      },

      clearSession: () => {
        set({
          session: null,
          isAuthenticated: false,
          loadingSession: false,
        });
      },

      setProfileId: (profileId) => {
        set((state) => ({
          session: state.session
            ? { ...state.session, profileId }
            : null,
        }));
      },

      setLoadingSession: (loadingSession) => set({ loadingSession }),

      setIsHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: SESSION,
      partialize: (state) => ({ session: state.session }),
      storage: createJSONStorage(() => ({
        getItem: async (key) => {
          const value = await storage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await storage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await storage.removeItem(key);
        },
      })),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // When hydration finishes, update derived state
          const hasJwt = !!state.session?.jwt;
          state.isAuthenticated = hasJwt;
          state.loadingSession = false;
          state.isHydrated = true;
        }
      },
    }
  )
);

// Helper to wait for session (useful in rare cases)
export const waitForSession = async (): Promise<Session> => {
  const store = useSessionStore.getState();
  if (store.isHydrated && !store.loadingSession) {
    return store.session;
  }

  return new Promise((resolve) => {
    const unsubscribe = useSessionStore.subscribe((state) => {
      if (state.isHydrated && !state.loadingSession) {
        unsubscribe();
        resolve(state.session);
      }
    });
  });
};

// Optional: Clean selectors
export const selectSession = (state: SessionState & SessionActions) => state.session;
export const selectIsAuthenticated = (state: SessionState & SessionActions) =>
  state.isAuthenticated;
export const selectUserEmail = (state: SessionState & SessionActions) =>
  state.session?.email;

export const HandleLogout = async () => {
  try {
    useSessionStore.getState().clearSession();
    await client.resetStore(); // clears cached queries/mutations for the previous user
    router.replace("/(auth)/sign-in");
  } catch (error) {
    console.error("Logout failed:", error);
    // Optional fallback – still try to navigate
    router.replace("/(auth)/sign-in");
  }
};