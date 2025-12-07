// src/lib/store/auth.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { SESSION } from '~/lib/keys';
import { storage } from '~/lib/utils';

export type Session = {
  userId: number;
  jwt: string;
  profileId?: number | null;
  phoneNumber: string;
  email: string;
  isPhoneNumberVerified: boolean;
  isEmailVerified: boolean;

  // ADD THESE FOR PROFILE
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: "M" | "F" | "O";
} | null;

interface SessionStates {
  session: Session;
  loadingSession: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
}

interface SessionActions {
  setSession: (session: Partial<Session>) => void;
  clearSession: () => void;
  setLoadingSession: (loadingSession: boolean) => void;
  setIsHydrated: (isHydrated: boolean) => void;
  setProfileId: (profileId: number | null) => void;
}

export const useSessionStore = create<SessionStates & SessionActions>()(
  persist(
    (set, get) => ({
      session: null,
      loadingSession: true,
      isAuthenticated: false,
      isHydrated: false,

      setSession: (updates) => {
        set({
          session: { ...get().session, ...updates } as Session,
          isAuthenticated: true,
          loadingSession: false,
        });
      },

      clearSession: () => {
        set({
          session: null,
          isAuthenticated: false,
        });
      },

      setProfileId: (profileId) => {
        set((state) => ({
          session: state.session ? { ...state.session, profileId } : null,
        }));
      },

      setLoadingSession: (loadingSession) => {
        set({ loadingSession });
      },

      setIsHydrated: (isHydrated) => {
        set({ isHydrated });
      },
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
          state.setLoadingSession(false);
          state.setIsHydrated(true);
        }
      },
    }
  )
);

export const waitForSession = async (): Promise<Session | null> => {
  const store = useSessionStore.getState();
  if (!store.loadingSession && store.session) {
    return store.session;
  }
  return new Promise((resolve) => {
    const unsubscribe = useSessionStore.subscribe((state) => {
      if (!state.loadingSession && state.session) {
        unsubscribe();
        resolve(state.session);
      }
    });
  });
};