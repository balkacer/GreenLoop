export type DepositVolumeRange =
  | 'very_small'
  | 'small'
  | 'medium'
  | 'large'
  | 'very_large';

export type MaterialType =
  | 'mixed_waste'
  | 'organic'
  | 'glass'
  | 'paper'
  | 'cardboard'
  | 'plastic_pet'
  | 'aluminum'
  | 'e_waste';

export type MaterialQuality =
  | 'contaminated'
  | 'regular'
  | 'clean'
  | 'excellent';

export type DepositBonusType =
  | 'first_deposit'
  | 'daily_streak_3'
  | 'weekly_active'
  | 'event_bonus'
  | 'referral_bonus';

export interface DepositBreakdownLine {
  label: string;
  value: string;
}

export interface DepositPointsInput {
  volumeRange: DepositVolumeRange;
  estimatedWeightKg: number;
  materialType: MaterialType;
  materialQuality: MaterialQuality;
  isEventActive: boolean;
  bonuses: DepositBonusType[];
}

export interface DepositPointsResult {
  basePoints: number;
  materialMultiplier: number;
  qualityMultiplier: number;
  eventMultiplier: number;
  flatBonusesTotal: number;
  roundedProductPoints: number;
  totalPoints: number;
  breakdown: DepositBreakdownLine[];
}

export type DepositCalculationSnapshot = DepositPointsResult;
