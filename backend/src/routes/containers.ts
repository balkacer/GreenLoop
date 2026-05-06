import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import {
  addTransaction,
  findUserById,
  memoryStore,
  userHasPriorSuccessfulDeposit,
} from '../db/memoryStore.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { calculateDepositPoints } from '../services/pointsCalculator.js';
import type { DepositBonusType } from '../types/depositPoints.js';
import { haversineKm } from '../utils/geo.js';

const router = Router();

const volumeRangeEnum = z.enum([
  'very_small',
  'small',
  'medium',
  'large',
  'very_large',
]);

const materialEnum = z.enum([
  'mixed_waste',
  'organic',
  'glass',
  'paper',
  'cardboard',
  'plastic_pet',
  'aluminum',
  'e_waste',
]);

const qualityEnum = z.enum([
  'contaminated',
  'regular',
  'clean',
  'excellent',
]);

const bonusEnum = z.enum([
  'first_deposit',
  'daily_streak_3',
  'weekly_active',
  'event_bonus',
  'referral_bonus',
]);

const completeDepositBody = z.object({
  depositSessionId: z.string().min(1),
  volumeRange: volumeRangeEnum,
  estimatedWeightKg: z.number().nonnegative(),
  materialType: materialEnum,
  materialQuality: qualityEnum,
  isEventActive: z.boolean(),
  bonuses: z.array(bonusEnum),
});

router.get('/', (_req, res) => {
  res.json({ containers: memoryStore.containers });
});

router.get('/nearby', (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = Number(req.query.radius ?? 5);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    res.status(400).json({ message: 'lat y lng requeridos' });
    return;
  }

  const withDistance = memoryStore.containers.map(c => ({
    ...c,
    distanceKm: haversineKm(lat, lng, c.lat, c.lng),
  }));

  const filtered = withDistance
    .filter(c => c.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({ containers: filtered });
});

router.get('/:id', (req, res) => {
  const c = memoryStore.containers.find(x => x.id === req.params.id);
  if (!c) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json(c);
});

router.post('/:id/start-deposit', requireAuth, (req: AuthedRequest, res) => {
  const c = memoryStore.containers.find(x => x.id === req.params.id);
  if (!c) {
    res.status(404).json({ message: 'Contenedor no encontrado' });
    return;
  }
  if (c.status !== 'available') {
    res.status(400).json({
      message:
        c.status === 'full'
          ? 'Contenedor lleno'
          : c.status === 'maintenance'
            ? 'En mantenimiento'
            : 'Contenedor fuera de línea',
    });
    return;
  }

  const session = {
    id: nanoid(),
    userId: req.userId!,
    containerId: c.id,
    status: 'active' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  memoryStore.depositSessions.push(session);

  res.json({
    sessionId: session.id,
    container: c,
    message: 'Sesión de depósito iniciada (simulación)',
  });
});

router.post('/:id/complete-deposit', requireAuth, (req: AuthedRequest, res) => {
  const parsed = completeDepositBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Payload inválido',
      issues: parsed.error.flatten(),
    });
    return;
  }

  const body = parsed.data;
  const c = memoryStore.containers.find(x => x.id === req.params.id);
  const session = memoryStore.depositSessions.find(
    s => s.id === body.depositSessionId && s.userId === req.userId,
  );
  const user = findUserById(req.userId!);
  if (!c || !session || !user) {
    res.status(404).json({ message: 'Sesión o contenedor inválido' });
    return;
  }
  if (session.status !== 'active') {
    res.status(400).json({ message: 'Sesión no activa' });
    return;
  }

  let bonuses: DepositBonusType[] = [...body.bonuses];
  if (
    bonuses.includes('first_deposit') &&
    userHasPriorSuccessfulDeposit(user.id)
  ) {
    bonuses = bonuses.filter(b => b !== 'first_deposit');
  }

  let calculation;
  try {
    calculation = calculateDepositPoints({
      volumeRange: body.volumeRange,
      estimatedWeightKg: body.estimatedWeightKg,
      materialType: body.materialType,
      materialQuality: body.materialQuality,
      isEventActive: body.isEventActive,
      bonuses,
    });
  } catch (e) {
    res.status(400).json({
      message: e instanceof Error ? e.message : 'Cálculo inválido',
    });
    return;
  }

  const points = calculation.totalPoints;

  session.status = 'completed';
  session.updatedAt = new Date().toISOString();

  user.balance += points;

  const tx = addTransaction({
    userId: user.id,
    type: 'earned',
    amount: points,
    description: `Depósito exitoso — ${c.name}`,
    status: 'completed',
    meta: {
      kind: 'deposit',
      containerId: c.id,
      sessionId: session.id,
      volumeRange: body.volumeRange,
      estimatedWeightKg: body.estimatedWeightKg,
      materialType: body.materialType,
      materialQuality: body.materialQuality,
      calculation,
    },
  });

  res.json({
    transactionId: tx.id,
    pointsEarned: points,
    newBalance: user.balance,
    calculation,
    message: 'Depósito registrado correctamente',
  });
});

const abortSchema = z.object({
  sessionId: z.string(),
});

router.post('/:id/abort-deposit', requireAuth, (req: AuthedRequest, res) => {
  const parsed = abortSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'sessionId requerido' });
    return;
  }
  const c = memoryStore.containers.find(x => x.id === req.params.id);
  const session = memoryStore.depositSessions.find(
    s => s.id === parsed.data.sessionId && s.userId === req.userId,
  );
  const user = findUserById(req.userId!);
  if (!c || !session || !user) {
    res.status(404).json({ message: 'Sesión no encontrada' });
    return;
  }

  session.status = 'aborted';
  session.updatedAt = new Date().toISOString();

  addTransaction({
    userId: user.id,
    type: 'earned',
    amount: 0,
    description: `Depósito abortado — ${c.name}`,
    status: 'aborted',
    meta: { containerId: c.id, sessionId: session.id },
  });

  res.json({ message: 'Depósito abortado y registrado' });
});

export default router;
