import { getMockDepositMeasurement } from '../constants/depositMockScenarios';
import type { DepositPointsInput } from '../types/depositPoints';
import type { DepositFlowStep } from '../types';

const STEP_ORDER: DepositFlowStep[] = [
  'connecting',
  'validating',
  'waiting_deposit',
  'measuring_volume_weight',
  'detecting_material',
  'calculating_points',
  'confirming_transaction',
];

export interface MockBleSession {
  containerId: string;
  abortController: AbortController;
}

/**
 * Simula una sesión BLE con el contenedor. Sustituir por módulo BLE real
 * que entregue `DepositPointsInput` desde hardware.
 */
export function createMockBleSession(containerId: string): MockBleSession {
  return {
    containerId,
    abortController: new AbortController(),
  };
}

/**
 * Avanza los pasos UI y devuelve mediciones simuladas (volumen, material, bonos).
 */
export async function runMockDepositSteps(
  containerId: string,
  onStep: (step: DepositFlowStep, index: number) => void,
  signal: AbortSignal,
  delayMs = 750,
): Promise<DepositPointsInput> {
  for (let i = 0; i < STEP_ORDER.length; i++) {
    if (signal.aborted) {
      throw new Error('aborted');
    }
    onStep(STEP_ORDER[i], i);
    await sleep(delayMs);
  }
  if (signal.aborted) {
    throw new Error('aborted');
  }
  return getMockDepositMeasurement(containerId);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
