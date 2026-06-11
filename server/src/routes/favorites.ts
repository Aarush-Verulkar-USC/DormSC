import { Router, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate('favoriteListings').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.favoriteListings);
  } catch (err) {
    next(err);
  }
});

export default router;
