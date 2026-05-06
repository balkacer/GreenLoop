/**
 * Escenarios mock reproducibles para simular lecturas del contenedor.
 * El índice se elige en función del `containerId` para facilitar pruebas manuales.
 */

import type { DepositPointsInput } from '../types/depositPoints';

/** Lista documentada para QA (índices alineados con tests de escenario). */
export const MOCK_DEPOSIT_SCENARIOS: DepositPointsInput[] = [
  /** Pequeño, basura mezclada contaminada */
  {
    volumeRange: 'small',
    estimatedWeightKg: 0.35,
    materialType: 'mixed_waste',
    materialQuality: 'contaminated',
    isEventActive: false,
    bonuses: [],
  },
  /** Mediano PET limpio + primer depósito */
  {
    volumeRange: 'medium',
    estimatedWeightKg: 1.4,
    materialType: 'plastic_pet',
    materialQuality: 'clean',
    isEventActive: false,
    bonuses: ['first_deposit'],
  },
  /** Grande cartón regular */
  {
    volumeRange: 'large',
    estimatedWeightKg: 4.2,
    materialType: 'cardboard',
    materialQuality: 'regular',
    isEventActive: false,
    bonuses: [],
  },
  /** Pequeño aluminio excelente */
  {
    volumeRange: 'small',
    estimatedWeightKg: 0.25,
    materialType: 'aluminum',
    materialQuality: 'excellent',
    isEventActive: false,
    bonuses: [],
  },
  /** Muy grande cartón regular + evento ×2 */
  {
    volumeRange: 'very_large',
    estimatedWeightKg: 14,
    materialType: 'cardboard',
    materialQuality: 'regular',
    isEventActive: false,
    bonuses: ['event_bonus'],
  },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Devuelve datos simulados tipo “sensor del contenedor” para completar el depósito. */
export function getMockDepositMeasurement(
  containerId: string,
): DepositPointsInput {
  const idx = hashString(containerId) % MOCK_DEPOSIT_SCENARIOS.length;
  return { ...MOCK_DEPOSIT_SCENARIOS[idx] };
}
