import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { env } from '../lib/env';

export interface AuthRequest extends Request {
  user?: IUser;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies['token'] as string | undefined;
    if (!token) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }
    if (user.isBlocked) {
      res.status(403).json({ message: 'Your account has been blocked' });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
}
