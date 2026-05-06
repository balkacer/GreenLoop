import { create } from 'zustand';
import type { DepositFlowStep } from '../../shared/types';

interface DepositFlowState {
  containerId: string | null;
  sessionId: string | null;
  step: DepositFlowStep | null;
  mockBleActive: boolean;
  reset: () => void;
  setActiveSession: (payload: {
    containerId: string;
    sessionId: string;
  }) => void;
  setStep: (step: DepositFlowStep | null) => void;
  setMockBleActive: (v: boolean) => void;
}

export const useDepositFlowStore = create<DepositFlowState>(set => ({
  containerId: null,
  sessionId: null,
  step: null,
  mockBleActive: false,
  reset: () =>
    set({
      containerId: null,
      sessionId: null,
      step: null,
      mockBleActive: false,
    }),
  setActiveSession: ({ containerId, sessionId }) =>
    set({ containerId, sessionId }),
  setStep: step => set({ step }),
  setMockBleActive: mockBleActive => set({ mockBleActive }),
}));
