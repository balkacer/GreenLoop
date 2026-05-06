/**
 * Motor de GreenPoints para depósitos.
 *
 * Fórmula:
 *   producto = basePoints × materialMul × qualityMul × eventMul
 *   roundedProduct = max(MIN, round(producto))
 *   total = roundedProduct + sum(bonos planos aplicables)
 *
 * Los bonos `event_bonus` e `isEventActive` aplican multiplicador ×2 (no suman GP planos).
 * `referral_bonus` no suma GP en este flujo (programa de referidos aparte).
 */

import type {
  DepositBreakdownLine,
  DepositPointsInput,
  DepositPointsResult,
} from '../types/depositPoints';
import {
  ALL_MATERIAL_TYPES,
  ALL_QUALITIES,
  ALL_VOLUME_RANGES,
  BASE_POINTS_BY_VOLUME,
  EVENT_MULTIPLIER_ACTIVE,
  FLAT_BONUS_GP,
  MATERIAL_LABELS,
  MATERIAL_MULTIPLIERS,
  MIN_ROUNDED_PRODUCT_POINTS,
  QUALITY_LABELS,
  QUALITY_MULTIPLIERS,
  VOLUME_RANGE_LABELS,
} from '../constants/pointsRules';

export interface DepositValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDepositPointsInput(
  input: DepositPointsInput,
): DepositValidationResult {
  const errors: string[] = [];

  if (!ALL_VOLUME_RANGES.includes(input.volumeRange)) {
    errors.push('volumeRange no válido');
  }
  if (!ALL_MATERIAL_TYPES.includes(input.materialType)) {
    errors.push('materialType no válido');
  }
  if (!ALL_QUALITIES.includes(input.materialQuality)) {
    errors.push('materialQuality no válido');
  }
  if (
    typeof input.estimatedWeightKg !== 'number' ||
    Number.isNaN(input.estimatedWeightKg) ||
    input.estimatedWeightKg < 0
  ) {
    errors.push('estimatedWeightKg debe ser >= 0');
  }
  if (typeof input.isEventActive !== 'boolean') {
    errors.push('isEventActive debe ser booleano');
  }
  if (!Array.isArray(input.bonuses)) {
    errors.push('bonuses debe ser un arreglo');
  }

  return { valid: errors.length === 0, errors };
}

export function calculateDepositPoints(
  input: DepositPointsInput,
): DepositPointsResult {
  const v = validateDepositPointsInput(input);
  if (!v.valid) {
    throw new Error(v.errors.join('; '));
  }

  const basePoints = BASE_POINTS_BY_VOLUME[input.volumeRange];
  const materialMultiplier = MATERIAL_MULTIPLIERS[input.materialType];
  const qualityMultiplier = QUALITY_MULTIPLIERS[input.materialQuality];

  const eventFromFlag =
    input.isEventActive || input.bonuses.includes('event_bonus');
  const eventMultiplier = eventFromFlag ? EVENT_MULTIPLIER_ACTIVE : 1;

  const rawProduct =
    basePoints * materialMultiplier * qualityMultiplier * eventMultiplier;
  let roundedProductPoints = Math.round(rawProduct);
  if (roundedProductPoints < MIN_ROUNDED_PRODUCT_POINTS) {
    roundedProductPoints = MIN_ROUNDED_PRODUCT_POINTS;
  }

  let flatBonusesTotal = 0;
  const breakdown: DepositBreakdownLine[] = [];

  breakdown.push({
    label: VOLUME_RANGE_LABELS[input.volumeRange],
    value: `+${basePoints} GP`,
  });
  breakdown.push({
    label: MATERIAL_LABELS[input.materialType],
    value: `×${materialMultiplier}`,
  });
  breakdown.push({
    label: QUALITY_LABELS[input.materialQuality],
    value: `×${qualityMultiplier}`,
  });
  if (eventMultiplier !== 1) {
    breakdown.push({
      label: 'Evento / campaña activa',
      value: `×${eventMultiplier}`,
    });
  }

  const sortedBonuses = [...input.bonuses];
  for (const b of sortedBonuses) {
    if (b === 'event_bonus' || b === 'referral_bonus') {
      if (b === 'referral_bonus') {
        breakdown.push({
          label: 'Bono referidos',
          value: 'Programa aparte',
        });
      }
      continue;
    }
    const flat = FLAT_BONUS_GP[b];
    if (flat != null && flat > 0) {
      flatBonusesTotal += flat;
      breakdown.push({
        label: BONUS_LABEL(b),
        value: `+${flat} GP`,
      });
    }
  }

  const totalPoints = roundedProductPoints + flatBonusesTotal;

  breakdown.push({
    label: 'Total ganado',
    value: `+${totalPoints} GP`,
  });

  return {
    basePoints,
    materialMultiplier,
    qualityMultiplier,
    eventMultiplier,
    flatBonusesTotal,
    roundedProductPoints,
    totalPoints,
    breakdown,
  };
}

function BONUS_LABEL(b: keyof typeof FLAT_BONUS_GP | string): string {
  switch (b) {
    case 'first_deposit':
      return 'Bono primer depósito';
    case 'daily_streak_3':
      return 'Racha diaria (3 días)';
    case 'weekly_active':
      return 'Bonus semanal activo';
    default:
      return String(b);
  }
}
