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
    if (houses && favorites?.length) {
      setFavoriteHouses(houses.filter(h => favorites.includes(h.id)) as House[]);
    } else {
      setFavoriteHouses([]);
    }
  }, [houses, favorites]);

  const handleToggleFavorite = async (houseId: string) => {
    try {
      await toggleFavorite(houseId);
    } catch {
      alert('Please sign in to manage favorites');
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f0f4ff]">
        <div className="pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view favorites</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">Save listings you like and access them anytime from your personal collection.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 w-full py-3 px-6 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (housesLoading || favoritesLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4ff]">
        <div className="pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-brand rounded-full animate-spin"></div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading Your Favorites</h1>
              <p className="text-gray-600 text-lg">Getting your saved listings...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                    <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded-2xl animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-200 rounded-2xl animate-pulse" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-5 w-20 bg-gray-200 rounded-2xl animate-pulse" />
                        <div className="h-8 w-8 bg-gray-200 rounded-2xl animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const count = favoriteHouses.length;

  return (
    <div className="min-h-screen bg-[#f0f4ff]">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Your Favorites
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              {count === 0 ? "No saved listings yet" : `${count} saved ${count === 1 ? 'listing' : 'listings'}`}
            </p>
            {count > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Saved properties</span>
              </div>
            )}
          </div>

          {count === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-8">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Start browsing listings and save the ones you like to see them here.
                  </p>
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Browse Listings</span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {favoriteHouses.map((house) => (
                  <div key={house.id}>
                    <HouseCard
                      house={house}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={isFavorite(house.id)}
                      showFavoriteButton={true}
                    />
                  </div>
                ))}
              </div>

              <div className="text-center py-8">
                <div className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-sm">
                  <p className="text-gray-600 mb-4">
                    Looking for more options?
                  </p>
                  <Link
                    href="/listings"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-900 text-sm font-medium hover:bg-gray-200 active:scale-[0.98] transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Browse more listings</span>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
