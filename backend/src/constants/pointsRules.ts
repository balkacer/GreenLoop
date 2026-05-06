import type {
  DepositBonusType,
  DepositVolumeRange,
  MaterialQuality,
  MaterialType,
} from '../types/depositPoints.js';

export const BASE_POINTS_BY_VOLUME: Record<DepositVolumeRange, number> = {
  very_small: 2,
  small: 5,
  medium: 10,
  large: 20,
  very_large: 35,
};

export const MATERIAL_MULTIPLIERS: Record<MaterialType, number> = {
  mixed_waste: 0.6,
  organic: 0.8,
  glass: 0.8,
  paper: 0.9,
  cardboard: 1.0,
  plastic_pet: 1.2,
  aluminum: 2.0,
  e_waste: 2.5,
};

export const QUALITY_MULTIPLIERS: Record<MaterialQuality, number> = {
  contaminated: 0.4,
  regular: 1.0,
  clean: 1.2,
  excellent: 1.5,
};

export const EVENT_MULTIPLIER_ACTIVE = 2;

export const FLAT_BONUS_GP: Partial<
  Record<
    Exclude<DepositBonusType, 'event_bonus' | 'referral_bonus'>,
    number
  >
> = {
  first_deposit: 50,
  daily_streak_3: 10,
  weekly_active: 30,
};

export const MIN_ROUNDED_PRODUCT_POINTS = 1;

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  mixed_waste: 'Basura mezclada',
  organic: 'Orgánico',
  glass: 'Vidrio',
  paper: 'Papel',
  cardboard: 'Cartón',
  plastic_pet: 'Plástico PET',
  aluminum: 'Aluminio',
  e_waste: 'Residuos electrónicos',
};

export const QUALITY_LABELS: Record<MaterialQuality, string> = {
  contaminated: 'Material contaminado',
  regular: 'Calidad regular',
  clean: 'Material limpio',
  excellent: 'Excelente separación',
};

export const VOLUME_RANGE_LABELS: Record<DepositVolumeRange, string> = {
  very_small: 'Depósito muy pequeño',
  small: 'Depósito pequeño',
  medium: 'Depósito mediano',
  large: 'Depósito grande',
  very_large: 'Depósito muy grande',
};

export const ALL_VOLUME_RANGES = Object.keys(
  BASE_POINTS_BY_VOLUME,
) as DepositVolumeRange[];

export const ALL_MATERIAL_TYPES = Object.keys(
  MATERIAL_MULTIPLIERS,
) as MaterialType[];

export const ALL_QUALITIES = Object.keys(
  QUALITY_MULTIPLIERS,
) as MaterialQuality[];
