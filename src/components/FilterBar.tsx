'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    searchTerm: ''
  });

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterType = {
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search - Expands to fill available space */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by title, address, or keyword..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange text-white placeholder-gray-500 transition-all font-sans"
          />
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange text-white placeholder-gray-500 text-sm"
          />
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-24 px-4 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange text-white placeholder-gray-500 text-sm"
          />

          <div className="relative">
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange text-white text-sm min-w-[100px]"
            >
              <option value="" className="bg-black text-gray-400">Beds</option>
              <option value="1" className="bg-black">1+ Bed</option>
              <option value="2" className="bg-black">2+ Beds</option>
              <option value="3" className="bg-black">3+ Beds</option>
              <option value="4" className="bg-black">4+ Beds</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange text-white text-sm min-w-[100px]"
            >
              <option value="" className="bg-black text-gray-400">Baths</option>
              <option value="1" className="bg-black">1+ Bath</option>
              <option value="2" className="bg-black">2+ Baths</option>
              <option value="3" className="bg-black">3+ Baths</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>

          {(filters.searchTerm || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms) && (
            <button
              onClick={clearFilters}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex-shrink-0"
              title="Clear Filters"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}