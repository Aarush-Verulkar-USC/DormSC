'use client';
import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

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
    if (key === 'minPrice') {
      const num = parseInt(value);
      if (value !== '' && (isNaN(num) || num < 0)) return;
      if (num > 100000) return;
    }
    if (key === 'maxPrice') {
      const num = parseInt(value);
      if (value !== '' && (isNaN(num) || num < 0)) return;
      if (num > 100000) return;
    }

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

  const hasActiveFilters = filters.searchTerm || filters.minPrice || filters.maxPrice || filters.bedrooms || filters.bathrooms;

  const inputBase = 'h-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand';
  const selectBase = 'h-10 appearance-none bg-white border border-gray-200 rounded-lg text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand cursor-pointer';

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, address, or keyword..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={`w-full pl-10 pr-4 ${inputBase}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="number"
            placeholder="Min $"
            min={0}
            max={100000}
            step={100}
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className={`w-28 px-3 ${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          <span className="text-gray-300 text-sm">–</span>
          <input
            type="number"
            placeholder="Max $"
            min={0}
            max={100000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className={`w-28 px-3 ${inputBase} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />

          <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block" />

          <div className="relative">
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className={`pl-3 pr-8 ${selectBase}`}
            >
              <option value="">Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className={`pl-3 pr-8 ${selectBase}`}
            >
              <option value="">Baths</option>
              <option value="1">1+ Bath</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
              <option value="4">4+ Baths</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              title="Clear Filters"
            >
              <X className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
