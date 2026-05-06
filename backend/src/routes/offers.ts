import { Router } from 'express';
import {
  addTransaction,
  findUserById,
  memoryStore,
} from '../db/memoryStore.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/', (_req, res) => {
  const offers = memoryStore.offers.map(o => {
    const merchant = memoryStore.merchants.find(m => m.id === o.merchantId);
    return { ...o, merchant };
  });
  res.json({ offers });
});

router.post('/:id/redeem', requireAuth, (req: AuthedRequest, res) => {
  const offer = memoryStore.offers.find(o => o.id === req.params.id);
  const user = findUserById(req.userId!);
  if (!offer || !user) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  if (user.balance < offer.pointsCost) {
    res.status(400).json({ message: 'GreenPoints insuficientes' });
    return;
  }

  user.balance -= offer.pointsCost;
  addTransaction({
    userId: user.id,
    type: 'redeemed',
    amount: -offer.pointsCost,
    description: `Canje: ${offer.title}`,
    status: 'completed',
    meta: { offerId: offer.id, merchantId: offer.merchantId },
  });

  res.json({
    balance: user.balance,
    message: 'Canje exitoso. Presenta este canje en el comercio.',
    offer,
  });
});

export default router;
