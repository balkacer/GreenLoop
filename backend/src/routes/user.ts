import { Router } from 'express';
import { z } from 'zod';
import { findUserByEmail, findUserById, memoryStore } from '../db/memoryStore.js';
import type { AuthedRequest } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const patchSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  cedula: z.string().optional(),
  address: z.string().optional(),
});

router.get('/me', requireAuth, (req: AuthedRequest, res) => {
  const user = findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  res.json(publicUser(user));
});

router.patch('/me', requireAuth, (req: AuthedRequest, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos inválidos', issues: parsed.error.flatten() });
    return;
  }
  const user = findUserById(req.userId!);
  if (!user) {
    res.status(404).json({ message: 'No encontrado' });
    return;
  }
  const data = parsed.data;
  if (data.email && data.email !== user.email) {
    const exists = findUserByEmail(data.email);
    if (exists && exists.id !== user.id) {
      res.status(409).json({ message: 'Correo ya en uso' });
      return;
    }
    user.email = data.email.toLowerCase();
  }
  if (data.name !== undefined) user.name = data.name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.cedula !== undefined) user.cedula = data.cedula;
  if (data.address !== undefined) user.address = data.address;

  res.json(publicUser(user));
});

function publicUser(u: {
  id: string;
  email: string;
  username: string;
  name: string;
  phone?: string;
  cedula?: string;
  address?: string;
  referralCode: string;
  balance: number;
}) {
  return {
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.name,
    phone: u.phone,
    cedula: u.cedula,
    address: u.address,
    referralCode: u.referralCode,
    balance: u.balance,
  };
}

export default router;
