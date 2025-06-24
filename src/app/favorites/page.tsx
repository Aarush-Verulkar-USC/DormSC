'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import HouseCard from '@/components/HouseCard';
import Link from 'next/link';
import { House } from '@/types/house';

export default function Favorites() {
  const { currentUser } = useAuth();
  const { houses, loading: housesLoading } = useHouses();
  const { favorites, loading: favoritesLoading, toggleFavorite, isFavorite } = useFavorites();
  const [favoriteHouses, setFavoriteHouses] = useState<House[]>([]);

  useEffect(() => {
    if (houses && favorites.length > 0) {
      const favoriteHousesList = houses.filter(house => 
        favorites.includes(house.id)
      ) as House[];
      setFavoriteHouses(favoriteHousesList);
    } else {
      setFavoriteHouses([]);
    }
  }, [houses, favorites]);

  const handleToggleFavorite = async (houseId: string) => {
    try {
      await toggleFavorite(houseId);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Please sign in to manage favorites');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view favorites</h1>
          <p className="text-gray-600 mb-6">Save your favorite listings to easily find them later</p>
          <Link 
            href="/login" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (housesLoading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your favorites...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorites
          </h1>
          <p className="text-gray-600">
            {favoriteHouses.length === 0 
              ? "You haven't saved any listings yet" 
              : `${favoriteHouses.length} saved ${favoriteHouses.length === 1 ? 'listing' : 'listings'}`
            }
          </p>
        </div>

        {favoriteHouses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Start browsing listings and click the heart icon to save your favorites here.
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Listings
            </Link>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/listings"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add More Favorites
                </Link>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-gray-500">
                  💡 Tip: Heart icon on listings to save them here
                </p>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteHouses.map((house) => (
                <div key={house.id} className="relative">
                  <HouseCard 
                    house={house}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite(house.id)}
                  />
                  {/* Remove from favorites option */}
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                    <span className="text-xs text-gray-500 px-2">❤️</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Actions */}
            <div className="mt-12 text-center">
              <Link
                href="/listings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Browse More Listings
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}