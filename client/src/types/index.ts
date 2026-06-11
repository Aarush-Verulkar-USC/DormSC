export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isBlocked?: boolean;
  listingCount?: number;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  price: number;
  bedrooms: number;
  bathrooms: number;
  distanceToUSC?: string;
  availableDate?: string;
  amenities: string[];
  images: string[];
  isActive: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  landlord: { _id: string; name: string; email: string } | string;
  reviews?: Review[];
  averageRating?: number | null;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  listing: string;
  user: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterValues {
  search: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  availableBy: string;
  sort: string;
}

export interface AdminStats {
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  blockedUsers: number;
  totalReviews: number;
}
