import { create } from 'zustand';

interface OfflineState {
  isOffline: boolean;
}

interface OfflineActions {
  setIsOffline: () => void;
  setIsOnline: () => void;
}

export const useConnectivityStore = create<OfflineState & OfflineActions>()((set) => ({
  isOffline: false,

  setIsOffline() {
    set({
      isOffline: true,
    });
  },

  setIsOnline() {
    set({
      isOffline: false,
    });
  },
}));
