import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../auth/tokens.js';
import { findUserById } from '../db/memoryStore.js';

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado' });
    return;
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyAccessToken(token);
    const user = findUserById(payload.sub);
    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
