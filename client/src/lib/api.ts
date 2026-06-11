import { AdminStats, Listing, Review, User } from '../types';

const BASE = import.meta.env['VITE_API_URL'] ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let message = 'Something went wrong';
    let code: string | undefined;
    try {
      const data = await res.json();
      message = data.message ?? message;
      code = data.code;
    } catch {
      // ignore parse error
    }
    const err = new Error(message) as Error & { code?: string };
    err.code = code;
    throw err;
  }
  return res.json() as Promise<T>;
}

export const api = {
  signup: (data: { name: string; email: string; password: string }) =>
    request<User | { pendingVerification: true }>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<User>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),

  me: () => request<User>('/auth/me'),

  getListings: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ listings: Listing[]; total: number; page: number; pages: number }>(
      `/listings${qs ? `?${qs}` : ''}`
    );
  },

  getListing: (id: string) => request<Listing & { reviews: Review[]; averageRating: number | null; reviewCount: number }>(`/listings/${id}`),

  createListing: (data: Partial<Listing>) =>
    request<Listing>('/listings', { method: 'POST', body: JSON.stringify(data) }),

  updateListing: (id: string, data: Partial<Listing>) =>
    request<Listing>(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteListing: (id: string) =>
    request<{ message: string }>(`/listings/${id}`, { method: 'DELETE' }),

  getFavorites: () => request<Listing[]>('/favorites'),

  toggleFavorite: (id: string) =>
    request<{ favorited: boolean }>(`/listings/${id}/favorite`, { method: 'POST' }),

  createReview: (listingId: string, data: { rating: number; title: string; comment: string }) =>
    request<Review>(`/listings/${listingId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),

  updateReview: (id: string, data: Partial<{ rating: number; title: string; comment: string }>) =>
    request<Review>(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteReview: (id: string) =>
    request<{ message: string }>(`/reviews/${id}`, { method: 'DELETE' }),

  getMyListings: () => request<Listing[]>('/listings/my'),

  getAdminStats: () => request<AdminStats>('/admin/stats'),

  getAdminUsers: (search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<User[]>(`/admin/users${qs}`);
  },

  getAdminListings: () => request<Listing[]>('/admin/listings'),

  blockUser: (id: string) =>
    request<{ isBlocked: boolean }>(`/admin/users/${id}/block`, { method: 'POST' }),
};
