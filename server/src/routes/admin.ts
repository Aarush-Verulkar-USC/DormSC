import { Router, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Listing } from '../models/Listing';
import { Review } from '../models/Review';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/stats', async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalListings, activeListings, totalUsers, blockedUsers, totalReviews] = await Promise.all([
      Listing.countDocuments(),
      Listing.countDocuments({ isActive: true }),
      User.countDocuments(),
      User.countDocuments({ isBlocked: true }),
      Review.countDocuments(),
    ]);
    res.json({ totalListings, activeListings, totalUsers, blockedUsers, totalReviews });
  } catch (err) {
    next(err);
  }
});

router.get('/users', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query as { search?: string };
    const query: Record<string, unknown> = {};
    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 }).lean();
    const usersWithCount = await Promise.all(
      users.map(async (u) => {
        const listingCount = await Listing.countDocuments({ landlord: u._id });
        return { ...u, listingCount };
      })
    );
    res.json(usersWithCount);
  } catch (err) {
    next(err);
  }
});

router.get('/listings', async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listings = await Listing.find().populate('landlord', 'name email').sort({ createdAt: -1 }).lean();
    res.json(listings);
  } catch (err) {
    next(err);
  }
});

router.post('/users/:id/block', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params['id']);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    if (user.role === 'admin') {
      res.status(400).json({ message: 'Cannot block an admin user' });
      return;
    }
    user.isBlocked = !user.isBlocked;
    if (user.isBlocked) {
      user.blockedAt = new Date();
    } else {
      user.blockedAt = undefined;
    }
    await user.save();
    res.json({ isBlocked: user.isBlocked });
  } catch (err) {
    next(err);
  }
});

export default router;
