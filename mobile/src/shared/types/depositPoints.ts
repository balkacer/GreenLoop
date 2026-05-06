/**
 * Tipos para el motor de GreenPoints en depósitos.
 * Los valores numéricos viven en `pointsRules.ts` para poder sustituirlos
 * por configuración remota más adelante.
 */

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

/** Bonos aplicables al depósito. `referral_bonus` se enumera pero no suma GP aquí (programa aparte). */
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
  /** Contexto para MVP / auditoría; no entra en la fórmula numérica actual. */
  estimatedWeightKg: number;
  materialType: MaterialType;
  materialQuality: MaterialQuality;
  /** Si hay campaña activa en sitio o flag del contenedor. */
  isEventActive: boolean;
  bonuses: DepositBonusType[];
}

/**
 * Resultado del cálculo: totalPoints = roundedProductPoints + flatBonusesTotal
 * (producto material/volumen/calidad/evento redondeado, mínimo 1 GP).
 */
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

/** Misma forma que `DepositPointsResult` para respuestas API / pantalla de éxito. */
export type DepositCalculationSnapshot = DepositPointsResult;
