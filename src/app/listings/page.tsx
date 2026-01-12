'use client';
import { useState, useEffect } from 'react';
import HouseCard from '@/components/HouseCard';
import FilterBar from '@/components/FilterBar';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import { House } from '@/types/house';

// Add this interface definition
interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

export default function Listings() {
  const { houses, loading, error } = useHouses();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);

  useEffect(() => {
    if (houses) {
      // Only show active listings
      const activeHouses = houses.filter(house => house.isActive !== false);
      setFilteredHouses(activeHouses as House[]);
    }
  }, [houses]);

  const handleFilterChange = (filters: FilterType) => {
    if (!houses) return;
    
    // Start with active listings only
    let filtered = [...houses].filter(house => house.isActive !== false) as House[];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(house => 
        house.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        house.address?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(house => house.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(house => house.price <= parseInt(filters.maxPrice));
    }

    // Bedroom filter
    if (filters.bedrooms) {
      filtered = filtered.filter(house => house.bedrooms >= parseInt(filters.bedrooms));
    }

    // Bathroom filter
    if (filters.bathrooms) {
      filtered = filtered.filter(house => house.bathrooms >= parseInt(filters.bathrooms));
    }

    setFilteredHouses(filtered);
  };

  const handleToggleFavorite = async (houseId: string) => {
    try {
      await toggleFavorite(houseId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update favorites';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header with Loading Animation */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Finding Perfect Homes</h1>
              <p className="text-gray-300 text-lg">Loading the best student housing options near USC...</p>
            </div>

            {/* Skeleton Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="group">
                  <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-700/50 to-gray-600/50 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-600/50 rounded-xl animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-600/50 rounded-lg animate-pulse" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-5 w-20 bg-gray-600/50 rounded-lg animate-pulse" />
                        <div className="h-8 w-8 bg-gray-600/50 rounded-full animate-pulse" />
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

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.15),transparent)] opacity-60"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Student Housing
            </h1>
            <p className="text-gray-300 text-lg mb-2">
              {filteredHouses.length} {filteredHouses.length === 1 ? 'property' : 'properties'} available near USC
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-200 text-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Live listings</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-12">
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
              <FilterBar onFilterChange={handleFilterChange} />
            </div>
          </div>

          {filteredHouses.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">No properties found</h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  {houses && houses.length > 0
                    ? "Try adjusting your search filters to discover more amazing student housing options."
                    : "No listings available yet. Check back soon for new properties!"
                  }
                </p>
                {houses && houses.length > 0 && (
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredHouses.map((house) => (
                  <div key={house.id} className="group transform transition-all duration-300 hover:-translate-y-2">
                    <HouseCard
                      house={house}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={isFavorite(house.id)}
                      showFavoriteButton={true}
                    />
                  </div>
                ))}
              </div>

              {/* Results Summary */}
              {houses && filteredHouses.length < houses.length && (
                <div className="text-center py-8">
                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                    <p className="text-gray-300 mb-4">
                      Showing <span className="font-semibold text-white">{filteredHouses.length}</span> of <span className="font-semibold text-white">{houses.length}</span> properties
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Clear filters to see all properties</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}