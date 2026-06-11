import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Review } from '../models/Review';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const updateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(1).optional(),
  comment: z.string().min(1).optional(),
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params['id']);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    if (review.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.errors[0]?.message ?? 'Validation error' });
      return;
    }
    Object.assign(review, result.data);
    await review.save();
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const review = await Review.findById(req.params['id']);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    const isOwner = review.user.toString() === req.user!._id.toString();
    const isAdmin = req.user!.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
