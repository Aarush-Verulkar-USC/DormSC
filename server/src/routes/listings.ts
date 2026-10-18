import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Listing } from '../models/Listing';
import { Review } from '../models/Review';
import { User } from '../models/User';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const listingSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(5_000),
  address: z.string().trim().min(5, 'Address is required').max(300),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  price: z.number().positive('Price must be positive').max(100_000),
  bedrooms: z.number().int().min(0).max(100),
  bathrooms: z.number().min(0).max(100),
  distanceToUSC: z.string().trim().max(100).optional(),
  availableDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid available date').optional(),
  amenities: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
  images: z.array(z.string().url().refine(url => /^https?:\/\//i.test(url), 'Image URLs must use HTTP or HTTPS')).max(10).default([]),
  contactName: z.string().trim().min(1, 'Contact name is required').max(100),
  contactEmail: z.string().trim().email('Invalid contact email').max(254),
  contactPhone: z.string().trim().max(30).optional(),
  isActive: z.boolean().optional(),
});

const listingQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).max(100).optional(),
  bathrooms: z.coerce.number().min(0).max(100).optional(),
  availableBy: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'relevance']).default('newest'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
}).refine(data => data.minPrice === undefined || data.maxPrice === undefined || data.minPrice <= data.maxPrice, {
  message: 'Minimum price cannot exceed maximum price',
});

function hasValidId(id: string | undefined): id is string {
  return Boolean(id && /^[a-f\d]{24}$/i.test(id));
}

// GET / — browse listings
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = listingQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.errors[0]?.message ?? 'Invalid filters' });
      return;
    }
    const { search, minPrice, maxPrice, bedrooms, bathrooms, availableBy, sort, page, limit } = parsed.data;

    const query: Record<string, unknown> = { isActive: true };

    if (search) {
      query['$text'] = { $search: search };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};
      if (minPrice !== undefined) priceFilter['$gte'] = minPrice;
      if (maxPrice !== undefined) priceFilter['$lte'] = maxPrice;
      query['price'] = priceFilter;
    }
    if (bedrooms !== undefined) query['bedrooms'] = { $gte: bedrooms };
    if (bathrooms !== undefined) query['bathrooms'] = { $gte: bathrooms };
    if (availableBy) query['availableDate'] = { $lte: new Date(availableBy) };

    let sortOption: Record<string, 1 | -1 | { $meta: string }> = {};
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (search) sortOption = { score: { $meta: 'textScore' } };
    else sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(query).select('-contactEmail -contactPhone').sort(sortOption).skip(skip).limit(limit).lean(),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      total,
      page,
      pages: Math.ceil(total / limit),
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
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
    const listing = await Listing.findById(req.params['id']).populate('landlord', 'name').lean();
    if (!listing) {
      res.status(404).json({ message: 'Listing not found' });
      return;
    }
    const reviews = await Review.find({ listing: req.params['id'] }).sort({ createdAt: -1 }).lean();
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;
    const isAuthenticated = Boolean(req.user);
    const favorited = req.user?.favoriteListings.some(id => id.toString() === listing._id.toString()) ?? false;
    const publicListing = isAuthenticated
      ? listing
      : { ...listing, contactEmail: undefined, contactPhone: undefined };
    res.json({ ...publicListing, reviews, averageRating, reviewCount: reviews.length, favorited });
  } catch (err) {
    next(err);
  }
});

// PUT /:id — update listing
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
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
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
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
      User.updateMany({ favoriteListings: listing._id }, { $pull: { favoriteListings: listing._id } }),
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
    if (!hasValidId(listingId)) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
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
  title: z.string().trim().min(1, 'Title is required').max(120),
  comment: z.string().trim().min(1, 'Comment is required').max(2_000),
});

// GET /:id/reviews
router.get('/:id/reviews', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
    const reviews = await Review.find({ listing: req.params['id'] }).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

// POST /:id/reviews
router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!hasValidId(req.params['id'])) {
      res.status(400).json({ message: 'Invalid listing ID' });
      return;
    }
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
