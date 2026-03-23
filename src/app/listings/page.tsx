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
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-5">
          <div className="animate-pulse space-y-8">
            <div className="h-10 w-52 bg-[#e3d8d0] rounded-lg mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-[#e3d8d0] rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-32 text-center px-4">
        <h1 className="font-serif text-3xl font-normal text-[#2c2420] mb-4">Something went wrong</h1>
        <p className="text-[#8a7b74]">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/20">
      <div className="pt-24 pb-20 px-5">

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e8c84a]/40 bg-[#fdf7d6] text-xs text-[#8a7b74] mb-5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#e8c84a]"></span>
            <span>{filteredHouses.length} {filteredHouses.length === 1 ? 'listing' : 'listings'} available</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-[#2c2420]">
            Available Housing
          </h1>
        </div>

        {/* Filter Bar + Sort */}
        <div className="max-w-4xl mx-auto mb-10">
          <FilterBar key={filterKey} onFilterChange={handleFilterChange} initialFilters={initialFilters} />
          <div className="flex items-center justify-end mt-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-9 appearance-none bg-white border border-[#e3d8d0] rounded-lg pl-3 pr-8 text-sm text-[#2c2420] focus:outline-none focus:border-brand/40 cursor-pointer transition-colors"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="distance">Distance to USC</option>
              </select>
              <CaretDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#8a7b74]" weight="bold" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-4xl mx-auto">
          {filteredHouses.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-white border border-[#e3d8d0] rounded-xl mb-5">
                <MagnifyingGlass className="w-6 h-6 text-[#8a7b74]" weight="regular" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#2c2420] mb-2">No listings match your filters</h2>
              <p className="text-[#8a7b74] text-sm mb-6">Try adjusting your search or removing some filters</p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2 rounded-lg border border-[#e3d8d0] text-[#2c2420] text-sm hover:bg-[#f2ede8] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <div className="min-h-screen bg-background pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-5">
            <div className="animate-pulse space-y-8">
              <div className="h-10 w-52 bg-[#e3d8d0] rounded-lg mx-auto"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-64 bg-[#e3d8d0] rounded-xl"></div>
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
