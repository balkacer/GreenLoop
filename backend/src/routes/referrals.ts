import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { config } from '../config.js';
import { findUserById, memoryStore } from '../db/memoryStore.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/code', requireAuth, (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  const deepLink = `https://greenloop.do/join?ref=${encodeURIComponent(user.referralCode)}`;
  res.json({
    code: user.referralCode,
    shareUrl: deepLink,
    bonusPoints: config.referralBonusPoints,
  });
});

const inviteSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
}).refine(d => d.email || d.phone, { message: 'email o phone' });

router.post('/invite', requireAuth, (req: AuthedRequest, res) => {
  const parsed = inviteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Proporciona correo o teléfono' });
    return;
  }
  const channel = parsed.data.email ? 'email' : 'phone';
  const target = parsed.data.email ?? parsed.data.phone!;
  memoryStore.invites.push({
    id: nanoid(),
    fromUserId: req.userId!,
    channel,
    target,
    createdAt: new Date().toISOString(),
  });
  res.json({
    message: 'Invitación registrada (mock). En producción se enviaría el mensaje.',
  });
});

const claimSchema = z.object({
  code: z.string().min(3),
});

router.post('/claim', requireAuth, (req: AuthedRequest, res) => {
  const parsed = claimSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Código inválido' });
    return;
  }
  res.status(400).json({
    message:
      'El código de referido solo aplica en el registro. Si ya tienes cuenta, comparte el tuyo.',
  });
});

export default router;
