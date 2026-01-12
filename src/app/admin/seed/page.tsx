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

export default function AdminSeed() {
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

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Loading Admin Panel</h1>
              <p className="text-gray-300">Preparing seeding interface...</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-200 text-sm mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Admin Panel - Seed Data</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              Database Seeding
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Management Console
              </span>
            </h1>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              {filteredHouses.length} {filteredHouses.length === 1 ? 'property' : 'properties'} currently in database
            </p>

            {/* Admin Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Live Database</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Updates</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Admin Access</span>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="mb-8">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>

          {/* Results Section */}
          {filteredHouses.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">No properties found</h2>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    {houses && houses.length > 0
                      ? "Try adjusting your search filters to discover more available homes."
                      : "Database is empty. Use the seeding tools to populate with sample data."
                    }
                  </p>

                  {houses && houses.length > 0 && (
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredHouses.map((house, index) => (
                  <div
                    key={house.id}
                    className="group transform transition-all duration-300 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <HouseCard
                      house={house}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={isFavorite(house.id)}
                      showFavoriteButton={true}
                    />
                  </div>
                ))}
              </div>

              {/* Admin Summary */}
              {filteredHouses.length > 0 && (
                <div className="text-center">
                  <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
                    <p className="text-gray-300 mb-2">
                      Displaying {filteredHouses.length} of {houses?.length || 0} total properties
                    </p>
                    <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>Database Connected</span>
                      </div>
                    </div>
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