import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export interface AccessPayload {
  sub: string;
  email: string;
}

export function signAccessToken(payload: AccessPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, config.jwtRefreshSecret, { expiresIn: '14d' });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, config.jwtSecret) as AccessPayload;
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, config.jwtRefreshSecret) as { sub: string };
}
