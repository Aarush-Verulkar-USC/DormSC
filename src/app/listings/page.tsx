'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HouseCard from '@/components/HouseCard';
import FilterBar from '@/components/FilterBar';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import { House } from '@/types/house';
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react';

interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  availableBy: string;
}

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'distance';

function parseDistance(dist?: string): number {
  if (!dist) return Infinity;
  const match = dist.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : Infinity;
}

function ListingsContent() {
  const searchParams = useSearchParams();
  const { houses, loading, error } = useHouses();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);

  const initialFilters: FilterType = {
    searchTerm: searchParams.get('q') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    availableBy: searchParams.get('availableBy') || '',
  };

  const [currentFilters, setCurrentFilters] = useState<FilterType>(initialFilters);
  const [filterKey, setFilterKey] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>(
    searchParams.get('sort') === 'distance' ? 'distance' : 'newest'
  );

  const handleClearFilters = useCallback(() => {
    const cleared: FilterType = {
      searchTerm: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      availableBy: '',
    };
    setCurrentFilters(cleared);
    setSortBy('newest');
    setFilterKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!houses) return;

    let filtered = [...houses].filter(house => house.isActive !== false) as House[];

    if (currentFilters.searchTerm) {
      const term = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(house =>
        house.title?.toLowerCase().includes(term) ||
        house.address?.toLowerCase().includes(term)
      );
    }

    if (currentFilters.minPrice) filtered = filtered.filter(house => house.price >= parseInt(currentFilters.minPrice));
    if (currentFilters.maxPrice) filtered = filtered.filter(house => house.price <= parseInt(currentFilters.maxPrice));
    if (currentFilters.bedrooms) filtered = filtered.filter(house => house.bedrooms >= parseInt(currentFilters.bedrooms));
    if (currentFilters.bathrooms) filtered = filtered.filter(house => house.bathrooms >= parseInt(currentFilters.bathrooms));

    if (currentFilters.availableBy) {
      const targetDate = new Date(currentFilters.availableBy);
      filtered = filtered.filter(house => {
        if (!house.availableDate) return true;
        return new Date(house.availableDate) <= targetDate;
      });
    }

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'distance':
        filtered.sort((a, b) => parseDistance(a.distanceToUSC) - parseDistance(b.distanceToUSC));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredHouses(filtered);
  }, [houses, currentFilters, sortBy]);

  const handleFilterChange = (filters: FilterType) => {
    setCurrentFilters(filters);
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
      <div className="min-h-screen bg-[#f0f4ff] text-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
            <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] text-gray-900 pt-32 text-center px-4">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] text-gray-900 selection:bg-brand/20">
      <div className="pt-24 pb-20 px-6">

        {/* Centered Header */}
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-300 bg-green-50 text-xs font-medium text-green-700 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>{filteredHouses.length} {filteredHouses.length === 1 ? 'listing' : 'listings'} available</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-4">
            Available Housing
          </h1>
        </div>

        {/* Filter Bar + Sort */}
        <div className="max-w-4xl mx-auto mb-16">
          <FilterBar key={filterKey} onFilterChange={handleFilterChange} initialFilters={initialFilters} />
          <div className="flex items-center justify-end mt-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 appearance-none bg-gray-100 border-0 rounded-xl pl-3 pr-8 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="distance">Distance to USC</option>
              </select>
              <CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" weight="bold" />
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="max-w-4xl mx-auto">
          {filteredHouses.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] rounded-full mb-5">
                <MagnifyingGlass className="w-7 h-7 text-gray-400" weight="bold" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No listings match your filters</h2>
              <p className="text-gray-500 mb-6">Try adjusting your search or removing some filters</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-900 font-medium text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
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

export default function Listings() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f0f4ff] text-gray-900 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
