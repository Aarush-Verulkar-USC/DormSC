'use client';
import { useState } from 'react';
import { MagnifyingGlass, CurrencyDollar, Bed, Bathtub, CalendarBlank, X } from '@phosphor-icons/react';

interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  availableBy: string;
}

interface FilterBarProps {
  onFilterChange: (filters: FilterType) => void;
  initialFilters?: Partial<FilterType>;
}

const defaultFilters: FilterType = {
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  bathrooms: '',
  searchTerm: '',
  availableBy: '',
};

export default function FilterBar({ onFilterChange, initialFilters }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterType>({
    ...defaultFilters,
    ...initialFilters,
  });

  const handleFilterChange = (key: keyof FilterType, value: string) => {
    if (key === 'minPrice' || key === 'maxPrice') {
      const num = parseInt(value);
      if (value !== '' && (isNaN(num) || num < 0)) return;
      if (num > 100000) return;
    }

    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchTerm || filters.minPrice || filters.maxPrice ||
    filters.bedrooms || filters.bathrooms || filters.availableBy;

  const cell = 'h-11 bg-transparent border-0 text-sm text-[#2c2420] placeholder-[#c4b8b0] focus:outline-none transition-colors';

  return (
    <div className="w-full bg-white border border-[#e3d8d0] rounded-xl overflow-hidden">
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        {/* Search */}
        <div className="flex items-center flex-1 min-w-[180px]">
          <MagnifyingGlass className="h-4 w-4 text-[#c4b8b0] ml-4 shrink-0" weight="regular" />
          <input
            type="text"
            placeholder="Search address, title..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className={`flex-1 min-w-0 pl-3 pr-2 ${cell}`}
          />
        </div>

        <div className="w-px h-6 bg-[#e3d8d0] shrink-0" />

        {/* Min price */}
        <div className="flex items-center shrink-0">
          <CurrencyDollar className="h-4 w-4 text-[#c4b8b0] ml-3 shrink-0" weight="regular" />
          <input
            type="number"
            placeholder="Min"
            min={0}
            max={100000}
            step={100}
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className={`w-16 pl-1.5 pr-1 ${cell} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>

        <span className="text-[#c4b8b0] text-xs shrink-0">–</span>

        {/* Max price */}
        <div className="flex items-center shrink-0">
          <input
            type="number"
            placeholder="Max"
            min={0}
            max={100000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className={`w-16 pl-2 pr-1 ${cell} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>

        <div className="w-px h-6 bg-[#e3d8d0] shrink-0" />

        {/* Beds */}
        <div className="flex items-center shrink-0">
          <Bed className="h-4 w-4 text-[#c4b8b0] ml-3 shrink-0" weight="regular" />
          <select
            value={filters.bedrooms}
            onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
            className={`pl-1.5 pr-7 appearance-none cursor-pointer ${cell}`}
          >
            <option value="">Beds</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div className="w-px h-6 bg-[#e3d8d0] shrink-0" />

        {/* Baths */}
        <div className="flex items-center shrink-0">
          <Bathtub className="h-4 w-4 text-[#c4b8b0] ml-3 shrink-0" weight="regular" />
          <select
            value={filters.bathrooms}
            onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
            className={`pl-1.5 pr-7 appearance-none cursor-pointer ${cell}`}
          >
            <option value="">Baths</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>

        <div className="w-px h-6 bg-[#e3d8d0] shrink-0" />

        {/* Date */}
        <div className="flex items-center shrink-0">
          <CalendarBlank className="h-4 w-4 text-[#c4b8b0] ml-3 shrink-0" weight="regular" />
          <input
            type="date"
            value={filters.availableBy}
            onChange={(e) => handleFilterChange('availableBy', e.target.value)}
            className={`w-32 pl-1.5 pr-2 ${cell}`}
            title="Available by"
          />
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <>
            <div className="w-px h-6 bg-[#e3d8d0] shrink-0" />
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 h-11 text-sm text-[#8a7b74] hover:text-[#2c2420] hover:bg-[#f2ede8] transition-colors shrink-0"
              title="Clear Filters"
            >
              <X className="h-3.5 w-3.5" weight="bold" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
