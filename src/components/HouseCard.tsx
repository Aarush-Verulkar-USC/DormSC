import Link from 'next/link';
import { useState } from 'react';
import { House } from '@/types/house';

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
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group hover:border-gray-600">
        <div className="relative">
          {house.images && house.images.length > 0 && !imageError ? (
            <img
              src={house.images[0]}
              alt={house.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Favorite Button */}
          {showFavoriteButton && onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              className="absolute top-3 right-3 p-2 rounded-full bg-gray-800/90 backdrop-blur-sm shadow-md hover:bg-gray-700 transition-colors disabled:opacity-50"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favoriteLoading ? (
                <div className="w-5 h-5 border-2 border-gray-600 border-t-[#FF3232] rounded-full animate-spin"></div>
              ) : (
                <svg
                  className={`w-5 h-5 transition-colors ${isFavorite
                      ? 'text-[#FF3232] fill-current'
                      : 'text-gray-400 hover:text-[#FF3232]'
                    }`}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              )}
            </button>
          )}

          {/* Status Badge */}
          {!house.isActive && (
            <div className="absolute top-3 left-3 bg-gray-800/80 text-white px-2 py-1 rounded-md text-xs font-medium">
              Unavailable
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-white mb-2 line-clamp-2">
            {house.title}
          </h3>

          <p className="text-gray-300 text-sm mb-3 flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {house.address}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                {house.bedrooms} bed
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                {house.bathrooms} bath
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-white font-mono">
                ${house.price.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm font-sans">/month</span>
            </div>
            {house.distanceToUSC && (
              <span className="text-sm text-purple-400 font-medium bg-purple-400/20 px-2 py-1 rounded">
                {house.distanceToUSC} mi to USC
              </span>
            )}
          </div>

          {house.availableDate && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <span className="text-sm text-gray-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Available: {new Date(house.availableDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}