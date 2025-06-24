'use client';
import { useState, useEffect } from 'react';
import HouseCard from '@/components/HouseCard';
import FilterBar from '@/components/FilterBar';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import { House, FilterType } from '@/types/house';

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading listings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Available Rentals
          </h1>
          <p className="text-sm text-gray-600">
            {filteredHouses.length} {filteredHouses.length === 1 ? 'property' : 'properties'} available near USC
          </p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        {filteredHouses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {houses && houses.length > 0 
                ? "Try adjusting your search filters to see more results."
                : "No listings available yet. Check back soon!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}