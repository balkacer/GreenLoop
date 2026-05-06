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
} from '../constants/pointsRules.js';
import type {
  DepositPointsInput,
  DepositPointsResult,
} from '../types/depositPoints.js';

export function validateDepositPointsInput(input: DepositPointsInput): {
  valid: boolean;
  errors: string[];
} {
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
  const breakdown: DepositPointsResult['breakdown'] = [];

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

  for (const b of input.bonuses) {
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
        label: bonusLabel(b),
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

function bonusLabel(b: string): string {
  switch (b) {
    case 'first_deposit':
      return 'Bono primer depósito';
    case 'daily_streak_3':
      return 'Racha diaria (3 días)';
    case 'weekly_active':
      return 'Bonus semanal activo';
    default:
      return b;
  }
}
