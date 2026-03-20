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
      <div className="group cursor-pointer rounded-xl bg-white border border-[#e3d8d0] hover:border-brand/30 overflow-hidden transition-colors duration-200">

        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f2ede8]">
          {house.images && house.images.length > 0 && !imageError ? (
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#c4b8b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Favorite Button */}
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-[#e3d8d0] hover:bg-white transition-colors disabled:opacity-50"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-[#e3d8d0] border-t-brand rounded-full animate-spin"></div>
              ) : (
                <svg
                  className={`w-3.5 h-3.5 transition-colors ${isFavorite ? 'fill-brand text-brand' : 'text-[#8a7b74]'}`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
          )}

          {/* Status Badge */}
          {!house.isActive && (
            <div className="absolute top-2.5 left-2.5 bg-[#2c2420]/70 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-xs">
              Unavailable
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-base text-[#2c2420] line-clamp-1 group-hover:text-brand transition-colors flex-1">
              {house.title}
            </h3>
            {house.averageRating && house.reviewCount && house.reviewCount > 0 && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-brand text-xs">★</span>
                <span className="text-[#2c2420] text-xs font-medium">{house.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-[#8a7b74] text-xs mb-4 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#c4b8b0] shrink-0" />
            <span className="truncate">{house.address}</span>
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-[#8a7b74]">
              <span className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-[#c4b8b0]" />
                <span className="text-[#2c2420] font-medium">{house.bedrooms}</span> bed
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5 text-[#c4b8b0]" />
                <span className="text-[#2c2420] font-medium">{house.bathrooms}</span> bath
              </span>
            </div>

            <div className="text-right">
              <div className="text-base font-semibold text-[#2c2420]">${house.price.toLocaleString()}</div>
              <div className="text-[10px] text-[#8a7b74]">per month</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
