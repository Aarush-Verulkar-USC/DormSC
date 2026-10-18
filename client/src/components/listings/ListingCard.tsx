import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath } from 'lucide-react';
import { Listing } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface ListingCardProps {
  listing: Listing;
  initialFavorited?: boolean;
  showFavoriteButton?: boolean;
  onFavoriteToggle?: (id: string, favorited: boolean) => void;
}

export default function ListingCard({
  listing,
  initialFavorited = false,
  showFavoriteButton = true,
  onFavoriteToggle,
}: ListingCardProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) { navigate('/login'); return; }
    setFavoriteLoading(true);
    try {
      const result = await api.toggleFavorite(listing._id) as { favorited: boolean };
      setFavorited(result.favorited);
      onFavoriteToggle?.(listing._id, result.favorited);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update favorite');
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <Link to={`/listings/${listing._id}`}>
      <div className="group cursor-pointer rounded-xl bg-white border border-line hover:border-brand/30 overflow-hidden transition-colors duration-200">

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          {listing.images.length > 0 && !imageError ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-faint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {showFavoriteButton && (
            <button
              onClick={handleFavorite}
              disabled={favoriteLoading}
              aria-label={favorited ? 'Remove from saved listings' : 'Save listing'}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-line hover:bg-white transition-colors disabled:opacity-50"
            >
              {favoriteLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-line border-t-brand rounded-full animate-spin" />
              ) : (
                <svg
                  className={`w-3.5 h-3.5 transition-colors ${favorited ? 'fill-brand text-brand' : 'text-muted'}`}
                  fill={favorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          )}

          {!listing.isActive && (
            <div className="absolute top-2.5 left-2.5 bg-ink/70 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-xs">
              Unavailable
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-base text-ink line-clamp-1 group-hover:text-brand transition-colors flex-1">
              {listing.title}
            </h3>
            {listing.averageRating && listing.reviewCount && listing.reviewCount > 0 && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-brand text-xs">★</span>
                <span className="text-ink text-xs font-medium">{listing.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-muted text-xs mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-faint shrink-0" />
            <span className="truncate">{listing.address}</span>
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-faint" />
                <span className="text-ink font-medium">{listing.bedrooms}</span> bed
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-faint" />
                <span className="text-ink font-medium">{listing.bathrooms}</span> bath
              </span>
            </div>
            <div className="text-right">
              <div className="text-base font-semibold text-ink">${listing.price.toLocaleString()}</div>
              <div className="text-[10px] text-muted">per month</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
