'use client';
import { useState } from 'react';

// Define FilterType locally instead of importing
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title or address..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A29FF] focus:border-[#3A29FF] text-white placeholder-gray-400 bg-gray-700"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Min Price
          </label>
          <input
            type="number"
            placeholder="$0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A29FF] focus:border-[#3A29FF] text-white placeholder-gray-400 bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Max Price
          </label>
          <input
            type="number"
            placeholder="$5000"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A29FF] focus:border-[#3A29FF] text-white placeholder-gray-400 bg-gray-700"
          />
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Bedrooms
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A29FF] focus:border-[#3A29FF] text-white bg-gray-700"
          >
            <option value="" className="text-gray-400">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Bathrooms
            </label>
            <select
              value={filters.bathrooms}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3A29FF] focus:border-[#3A29FF] text-white bg-gray-700"
            >
              <option value="" className="text-gray-400">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>
        </div>

        <button
          onClick={clearFilters}
          className="bg-[#FF3232] hover:bg-[#e02828] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}