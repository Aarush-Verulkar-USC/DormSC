import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Listing } from '../models/Listing';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  price: z.number().positive('Price must be positive'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  distanceToUSC: z.string().optional(),
  availableDate: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).max(10).default([]),
  contactName: z.string().min(1, 'Contact name is required'),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().optional(),
  isActive: z.boolean().optional(),
});

// GET / — browse listings
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      availableBy,
      sort = 'newest',
      page = '1',
      limit = '12',
    } = req.query as Record<string, string>;

    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query['$text'] = { $search: search };
    }
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {};
      if (minPrice) priceFilter['$gte'] = Number(minPrice);
      if (maxPrice) priceFilter['$lte'] = Number(maxPrice);
      query['price'] = priceFilter;
    }
    if (bedrooms) query['bedrooms'] = { $gte: Number(bedrooms) };
    if (bathrooms) query['bathrooms'] = { $gte: Number(bathrooms) };
    if (availableBy) query['availableDate'] = { $lte: new Date(availableBy) };

    let sortOption: Record<string, 1 | -1 | { $meta: string }> = {};
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (search) sortOption = { score: { $meta: 'textScore' } };
    else sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
});

// GET /my — user's own listings
router.get('/my', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listings = await Listing.find({ landlord: req.user!._id }).sort({ createdAt: -1 }).lean();
    res.json(listings);
  } catch (err) {
    next(err);
  }
});

// POST / — create listing
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = listingSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.errors[0]?.message ?? 'Validation error' });
      return;
    }
    const activeCount = await Listing.countDocuments({ landlord: req.user!._id, isActive: true });
    if (activeCount >= 2) {
      res.status(400).json({ message: 'You can only have 2 active listings at a time' });
      return;
    }
    const data = result.data;
    const listing = await Listing.create({
      ...data,
      availableDate: data.availableDate ? new Date(data.availableDate) : undefined,
      landlord: req.user!._id,
    });
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
});

// GET /:id — single listing
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params['id']).populate('landlord', 'name email').lean();
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const reviews = await Review.find({ listing: req.params['id'] }).sort({ createdAt: -1 }).lean();
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;
    res.json({ ...listing, reviews, averageRating, reviewCount: reviews.length });
  } catch (err) {
    next(err);
  }
});

// PUT /:id — update listing
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params['id']);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const isOwner = listing.landlord.toString() === req.user!._id.toString();
    const isAdmin = req.user!.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    const result = listingSchema.partial().safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.errors[0]?.message ?? 'Validation error' });
      return;
    }
    const data = result.data;
    if (data.availableDate) {
      (data as Record<string, unknown>)['availableDate'] = new Date(data.availableDate);
    }
    Object.assign(listing, data);
    await listing.save();
    res.json(listing);
  } catch (err) {
    next(err);
  }
});

// DELETE /:id — delete listing
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params['id']);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const isOwner = listing.landlord.toString() === req.user!._id.toString();
    const isAdmin = req.user!.role === 'admin';
    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }
    await Promise.all([
      listing.deleteOne(),
      Review.deleteMany({ listing: listing._id }),
    ]);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    next(err);
  }
});

// POST /:id/favorite — toggle favorite
router.post('/:id/favorite', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listingId = req.params['id'];
    const listing = await Listing.findById(listingId);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const idx = user.favoriteListings.findIndex(id => id.toString() === listingId);
    let favorited: boolean;
    if (idx > -1) {
      user.favoriteListings.splice(idx, 1);
      favorited = false;
    } else {
      user.favoriteListings.push(listing._id);
      favorited = true;
    }
    await user.save();
    res.json({ favorited });
  } catch (err) {
    next(err);
  }
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
});

// GET /:id/reviews
router.get('/:id/reviews', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reviews = await Review.find({ listing: req.params['id'] }).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /:id/reviews
router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params['id']);
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const result = reviewSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: result.error.errors[0]?.message ?? 'Validation error' });
      return;
    }
    const existing = await Review.findOne({ listing: listing._id, user: req.user!._id });
    if (existing) {
      res.status(409).json({ message: 'You have already reviewed this listing' });
      return;
    }
    const review = await Review.create({
      ...result.data,
      listing: listing._id,
      user: req.user!._id,
      userName: req.user!.name,
    });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
});

export default router;
