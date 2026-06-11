import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { api } from '../lib/api';
import { Listing } from '../types';
import ListingCard from '../components/listings/ListingCard';
import { ListingGridSkeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function Favorites() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFavorites()
      .then(d => setListings(d))
      .catch(() => toast.error('Failed to load favorites'))
      .finally(() => setLoading(false));
  }, []);

  const handleFavoriteToggle = (id: string, favorited: boolean) => {
    if (!favorited) setListings(prev => prev.filter(l => l._id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-main pt-24 pb-12">
          <h1 className="text-2xl font-semibold mb-7 text-ink">Saved Listings</h1>
          <ListingGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-7 text-ink">Saved Listings</h1>

        {listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-full bg-brand/12 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-brand" />
            </div>
            <p className="text-xl font-semibold mb-2 text-muted">No saved listings yet</p>
            <p className="text-sm mb-7 text-muted">Browse listings and save the ones you like</p>
            <Link to="/listings"
              className="bg-brand hover:bg-brand/90 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors">
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(l => (
              <ListingCard key={l._id} listing={l} initialFavorited onFavoriteToggle={handleFavoriteToggle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
