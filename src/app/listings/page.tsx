'use client';
import { useState, useEffect } from 'react';
import HouseCard from '@/components/HouseCard';
import FilterBar from '@/components/FilterBar';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import { House } from '@/types/house';

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
      const activeHouses = houses.filter(house => house.isActive !== false);
      setFilteredHouses(activeHouses as House[]);
    }
  }, [houses]);

  const handleFilterChange = (filters: FilterType) => {
    if (!houses) return;

    let filtered = [...houses].filter(house => house.isActive !== false) as House[];

    if (filters.searchTerm) {
      filtered = filtered.filter(house =>
        house.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        house.address?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.minPrice) filtered = filtered.filter(house => house.price >= parseInt(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(house => house.price <= parseInt(filters.maxPrice));
    if (filters.bedrooms) filtered = filtered.filter(house => house.bedrooms >= parseInt(filters.bedrooms));
    if (filters.bathrooms) filtered = filtered.filter(house => house.bathrooms >= parseInt(filters.bathrooms));

    setFilteredHouses(filtered);
  };

  const handleToggleFavorite = async (houseId: string) => {
    try {
      await toggleFavorite(houseId);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 bg-gray-100 rounded-lg mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 pt-32 text-center px-4">
        <h1 className="text-3xl font-serif text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-brand/20">
      <div className="pt-24 pb-20 px-6">

        {/* Centered Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-brand"></span>
            <span>{filteredHouses.length} {filteredHouses.length === 1 ? 'listing' : 'listings'} available</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            Available Housing
          </h1>
        </div>

        {/* Centered Filter Bar */}
        <div className="max-w-4xl mx-auto mb-16">
          <FilterBar onFilterChange={handleFilterChange} />
        </div>

        {/* 2-Column Grid */}
        <div className="max-w-4xl mx-auto">
          {filteredHouses.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">No homes found</h2>
              <p className="text-gray-500 mb-6">Try adjusting your filters</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors border border-gray-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHouses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite(house.id)}
                  showFavoriteButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
