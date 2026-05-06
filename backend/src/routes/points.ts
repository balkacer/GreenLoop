import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import {
  addTransaction,
  findUserById,
  memoryStore,
} from '../db/memoryStore.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/balance', requireAuth, (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json({ balance: user.balance });
});

router.get('/transactions', requireAuth, (req: AuthedRequest, res) => {
  const list = memoryStore.transactions.filter(t => t.userId === req.userId);
  res.json({ transactions: list });
});

const donateSchema = z.object({
  foundationId: z.string(),
  amount: z.number().int().positive(),
});

router.post('/donate', requireAuth, (req: AuthedRequest, res) => {
  const parsed = donateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos inválidos' });
    return;
  }
  const user = findUserById(req.userId!);
  const foundation = memoryStore.foundations.find(
    f => f.id === parsed.data.foundationId,
  );
  if (!user || !foundation) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  if (user.balance < parsed.data.amount) {
    res.status(400).json({ message: 'Saldo insuficiente' });
    return;
  }

  user.balance -= parsed.data.amount;
  addTransaction({
    userId: user.id,
    type: 'donated',
    amount: -parsed.data.amount,
    description: `Donación a ${foundation.name}`,
    status: 'completed',
    meta: { foundationId: foundation.id },
  });

  res.json({
    balance: user.balance,
    message: 'Donación registrada',
  });
});

const redeemPointsSchema = z.object({
  merchantId: z.string(),
  points: z.number().int().positive(),
  description: z.string().max(200).optional(),
});

router.post('/redeem', requireAuth, (req: AuthedRequest, res) => {
  const parsed = redeemPointsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos inválidos' });
    return;
  }
  const user = findUserById(req.userId!);
  const merchant = memoryStore.merchants.find(m => m.id === parsed.data.merchantId);
  if (!user || !merchant) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  if (user.balance < parsed.data.points) {
    res.status(400).json({ message: 'Saldo insuficiente' });
    return;
  }

  user.balance -= parsed.data.points;
  addTransaction({
    userId: user.id,
    type: 'redeemed',
    amount: -parsed.data.points,
    description:
      parsed.data.description ??
      `Canje en ${merchant.name}`,
    status: 'completed',
    meta: { merchantId: merchant.id },
  });

  res.json({ balance: user.balance });
});

export default router;
