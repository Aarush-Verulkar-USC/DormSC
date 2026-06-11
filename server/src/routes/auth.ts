import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { User } from '../models/User';
import { env } from '../lib/env';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts, please try again later' },
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function setTokenCookie(res: Response, userId: string): void {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

// POST /api/auth/signup
router.post('/signup', authLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.errors[0]?.message ?? 'Validation error' });
      return;
    }
    const { name, email, password } = result.data;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const role = env.ADMIN_EMAILS.includes(email) ? 'admin' : 'user';
    const user = await User.create({ name, email, passwordHash, role });
    setTokenCookie(res, user._id.toString());
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Invalid email or password' });
      return;
    }
    const { email, password } = result.data;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    if (user.isBlocked) {
      res.status(403).json({ message: 'Your account has been blocked' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    setTokenCookie(res, user._id.toString());
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response): void => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  const user = req.user!;
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

export default router;
