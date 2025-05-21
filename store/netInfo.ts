import { create } from 'zustand';

interface NetInfoState {
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
}

export const useNetInfo = create<NetInfoState>((set) => ({
  isConnected: true,
  setIsConnected: (value) => set({ isConnected: value }),
}));
