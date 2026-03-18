import Link from 'next/link';
import { useState } from 'react';
import { House } from '@/types/house';
import { MapPin, Bed, Bath } from 'lucide-react';

interface HouseCardProps {
  house: House;
  onToggleFavorite?: (houseId: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export default function HouseCard({
  house,
  onToggleFavorite,
  isFavorite = false,
  showFavoriteButton = true
}: HouseCardProps) {
  const [imageError, setImageError] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite && !favoriteLoading) {
      try {
        setFavoriteLoading(true);
        await onToggleFavorite(house.id);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      } finally {
        setFavoriteLoading(false);
      }
    }
  };

  return (
    <Link href={`/listing/${house.id}`}>
      <div className="group cursor-pointer rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300 overflow-hidden">

        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {house.images && house.images.length > 0 && !imageError ? (
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Favorite Button */}
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors disabled:opacity-50"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteLoading ? (
                <div className="w-4 h-4 border-2 border-gray-200 border-t-brand rounded-full animate-spin"></div>
              ) : (
                <svg
                  className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          )}

          {/* Status Badge */}
          {!house.isActive && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              Unavailable
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-brand transition-colors flex-1">
              {house.title}
            </h3>
            {house.averageRating && house.reviewCount && house.reviewCount > 0 && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-brand text-sm">★</span>
                <span className="text-gray-900 text-sm font-medium">{house.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-gray-500 text-sm mb-4 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {house.address}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{house.bedrooms}</span> bed
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-medium">{house.bathrooms}</span> bath
              </span>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">${house.price.toLocaleString()}</div>
              <div className="text-xs text-gray-400">per month</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
