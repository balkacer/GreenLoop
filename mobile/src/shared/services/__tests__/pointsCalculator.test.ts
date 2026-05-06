import { calculateDepositPoints } from '../pointsCalculator';
import type { DepositPointsInput } from '../../types/depositPoints';

describe('calculateDepositPoints', () => {
  it('caso 1: medium + PET + clean + sin evento + first_deposit => 64 GP', () => {
    const input: DepositPointsInput = {
      volumeRange: 'medium',
      estimatedWeightKg: 1.4,
      materialType: 'plastic_pet',
      materialQuality: 'clean',
      isEventActive: false,
      bonuses: ['first_deposit'],
    };
    const r = calculateDepositPoints(input);
    expect(r.totalPoints).toBe(64);
    expect(r.roundedProductPoints).toBe(14);
    expect(r.flatBonusesTotal).toBe(50);
  });

  it('caso 2: small + mixed_waste + contaminated => 1 GP', () => {
    const input: DepositPointsInput = {
      volumeRange: 'small',
      estimatedWeightKg: 0.3,
      materialType: 'mixed_waste',
      materialQuality: 'contaminated',
      isEventActive: false,
      bonuses: [],
    };
    const r = calculateDepositPoints(input);
    expect(r.totalPoints).toBe(1);
  });

  it('caso 3: large + aluminum + excellent => 60 GP', () => {
    const input: DepositPointsInput = {
      volumeRange: 'large',
      estimatedWeightKg: 3,
      materialType: 'aluminum',
      materialQuality: 'excellent',
      isEventActive: false,
      bonuses: [],
    };
    const r = calculateDepositPoints(input);
    expect(r.totalPoints).toBe(60);
  });

  it('caso 4: very_large + cardboard + regular + evento x2 => 70 GP', () => {
    const input: DepositPointsInput = {
      volumeRange: 'very_large',
      estimatedWeightKg: 10,
      materialType: 'cardboard',
      materialQuality: 'regular',
      isEventActive: false,
      bonuses: ['event_bonus'],
    };
    const r = calculateDepositPoints(input);
    expect(r.totalPoints).toBe(70);
  });

  it('caso 5: very_small + organic + regular => 2 GP', () => {
    const input: DepositPointsInput = {
      volumeRange: 'very_small',
      estimatedWeightKg: 0.5,
      materialType: 'organic',
      materialQuality: 'regular',
      isEventActive: false,
      bonuses: [],
    };
    const r = calculateDepositPoints(input);
    expect(r.totalPoints).toBe(2);
  });

  it('rechaza peso negativo', () => {
    expect(() =>
      calculateDepositPoints({
        volumeRange: 'medium',
        estimatedWeightKg: -1,
        materialType: 'paper',
        materialQuality: 'regular',
        isEventActive: false,
        bonuses: [],
      }),
    ).toThrow();
  });
});
