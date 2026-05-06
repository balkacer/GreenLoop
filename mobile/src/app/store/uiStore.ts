import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UiState {
  onboardingCompleted: boolean;
  biometricLoginEnabled: boolean;
  setOnboardingCompleted: (v: boolean) => void;
  setBiometricLoginEnabled: (v: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    set => ({
      onboardingCompleted: false,
      biometricLoginEnabled: false,
      setOnboardingCompleted: v => set({ onboardingCompleted: v }),
      setBiometricLoginEnabled: v => set({ biometricLoginEnabled: v }),
    }),
    {
      name: 'greenloop-ui',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
