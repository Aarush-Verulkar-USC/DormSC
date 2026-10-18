import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Review } from '../models/Review';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const updateSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().trim().min(1).max(120).optional(),
  comment: z.string().trim().min(1).max(2_000).optional(),
}).refine(data => Object.keys(data).length > 0, 'At least one field is required');

function hasValidId(id: string | undefined): id is string {
  return Boolean(id && /^[a-f\d]{24}$/i.test(id));
}

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid review ID' });
      return;
    }
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
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid review ID' });
      return;
    }
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
