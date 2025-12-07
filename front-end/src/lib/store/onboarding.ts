import dayjs, { Dayjs } from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { ONBOARDING } from '../keys';
import { storage } from '../utils';

interface OnboardingState {
  isOnboarded: boolean;
  lastReviewAsked: string | null;
  lastInternalReviewAsked: string | null;
}

interface OnboardingActions {
  setIsOnboarded: () => void;
  setLastReviewAsked: () => void;
  setLastInternalReviewAsked: (date: Dayjs) => void;
  shouldShowReview: () => boolean;
  shouldShowInternalReview: () => boolean;
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      lastReviewAsked: null,
      neverShowReview: false,
      lastInternalReviewAsked: null,

      setIsOnboarded() {
        set({
          isOnboarded: true,
        });
      },

      setLastReviewAsked() {
        set({
          lastReviewAsked: dayjs().toISOString(),
        });
      },

      setLastInternalReviewAsked: (date) => {
        set({
          lastInternalReviewAsked: date.toISOString(),
        });
      },

      shouldShowReview() {
        const state = get();

        // if never asked before(first login)
        if (!state.lastReviewAsked) {
          return false;
        }

        const lastAsked = dayjs(state.lastReviewAsked);
        const twoWeeksAgo = dayjs().subtract(2, 'weeks');

        return lastAsked.isBefore(twoWeeksAgo) && state.isOnboarded;
      },

      shouldShowInternalReview() {
        const state = get();

        if (!state.lastInternalReviewAsked) {
          return false;
        }

        const lastAsked = dayjs(state.lastInternalReviewAsked);
        const threeWeeksAgo = dayjs().subtract(3, 'weeks');

        return lastAsked.isBefore(threeWeeksAgo) && state.isOnboarded;
      },
    }),
    {
      name: ONBOARDING,
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
    }
  )
);
