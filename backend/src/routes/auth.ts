import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../auth/tokens.js';
import { config } from '../config.js';
import {
  addTransaction,
  findUserByEmail,
  findUserByReferralCode,
  findUserByUsername,
  memoryStore,
} from '../db/memoryStore.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
  name: z.string().min(2).max(120),
  phone: z.string().optional(),
  referralCode: z.string().optional(),
});

router.post('/register', (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Datos inválidos', issues: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  if (findUserByEmail(data.email) || findUserByUsername(data.username)) {
    res.status(409).json({ message: 'Correo o usuario ya registrado' });
    return;
  }

  let referredByUserId: string | undefined;
  if (data.referralCode?.trim()) {
    const ref = findUserByReferralCode(data.referralCode);
    if (ref) referredByUserId = ref.id;
  }

  const userId = nanoid();
  const referralCode = `GL-${nanoid(6).toUpperCase()}`;
  memoryStore.users.push({
    id: userId,
    email: data.email.toLowerCase(),
    username: data.username,
    passwordHash: bcrypt.hashSync(data.password, 10),
    name: data.name,
    phone: data.phone,
    referralCode,
    referredByUserId,
    balance: 0,
    createdAt: new Date().toISOString(),
  });

  if (referredByUserId) {
    const referrer = memoryStore.users.find(u => u.id === referredByUserId);
    if (referrer) {
      referrer.balance += config.referralBonusPoints;
      addTransaction({
        userId: referrer.id,
        type: 'referral_bonus',
        amount: config.referralBonusPoints,
        description: `Bonificación por referido (${data.username})`,
        status: 'completed',
        meta: { referredUserId: userId },
      });
      addTransaction({
        userId,
        type: 'earned',
        amount: Math.floor(config.referralBonusPoints / 5),
        description: 'Bienvenida por usar código de referido',
        status: 'completed',
      });
      const newbie = memoryStore.users.find(u => u.id === userId);
      if (newbie) newbie.balance += Math.floor(config.referralBonusPoints / 5);
    }
  }

  const accessToken = signAccessToken({
    sub: userId,
    email: data.email.toLowerCase(),
  });
  const refreshToken = signRefreshToken(userId);
  memoryStore.refreshTokens.set(refreshToken, userId);

  res.status(201).json({
    accessToken,
    refreshToken,
    user: publicUser(memoryStore.users.find(u => u.id === userId)!),
  });
});

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

router.post('/login', (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Credenciales inválidas' });
    return;
  }
  const { identifier, password } = parsed.data;
  const byEmail = findUserByEmail(identifier);
  const byUser = findUserByUsername(identifier);
  const user = byEmail ?? byUser;
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    return;
  }

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = signRefreshToken(user.id);
  memoryStore.refreshTokens.set(refreshToken, user.id);

  res.json({
    accessToken,
    refreshToken,
    user: publicUser(user),
  });
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

router.post('/refresh', (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Refresh token requerido' });
    return;
  }
  try {
    const payload = verifyRefreshToken(parsed.data.refreshToken);
    const storedUserId = memoryStore.refreshTokens.get(parsed.data.refreshToken);
    if (!storedUserId || storedUserId !== payload.sub) {
      res.status(401).json({ message: 'Refresh inválido' });
      return;
    }
    const user = memoryStore.users.find(u => u.id === payload.sub);
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Refresh expirado' });
  }
});

const forgotSchema = z.object({
  email: z.string().email(),
});

router.post('/forgot-password', (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Correo inválido' });
    return;
  }
  res.json({
    message:
      'Si el correo existe, recibirás instrucciones (mock). Revisa tu bandeja.',
  });
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
