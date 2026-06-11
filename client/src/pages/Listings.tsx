import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { api } from '../lib/api';
import { Listing, FilterValues } from '../types';
import ListingCard from '../components/listings/ListingCard';
import FilterBar from '../components/listings/FilterBar';
import { ListingGridSkeleton } from '../components/ui/Skeleton';

function paramsToFilters(sp: URLSearchParams): FilterValues {
  return {
    search: sp.get('search') ?? '',
    minPrice: sp.get('minPrice') ?? '',
    maxPrice: sp.get('maxPrice') ?? '',
    bedrooms: sp.get('bedrooms') ?? '',
    bathrooms: sp.get('bathrooms') ?? '',
    availableBy: sp.get('availableBy') ?? '',
    sort: sp.get('sort') ?? 'newest',
  };
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = paramsToFilters(searchParams);

  const fetchListings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '12' };
      const f = paramsToFilters(searchParams);
      if (f.search) params.search = f.search;
      if (f.minPrice) params.minPrice = f.minPrice;
      if (f.maxPrice) params.maxPrice = f.maxPrice;
      if (f.bedrooms) params.bedrooms = f.bedrooms;
      if (f.bathrooms) params.bathrooms = f.bathrooms;
      if (f.availableBy) params.availableBy = f.availableBy;
      if (f.sort) params.sort = f.sort;
      const data = await api.getListings(params) as { listings: Listing[]; total: number; pages: number; page: number };
      setListings(data.listings);
      setTotal(data.total);
      setPages(data.pages);
      setCurrentPage(data.page);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => { fetchListings(1); }, [searchParams]);

  const handleFilterChange = (values: FilterValues) => {
    const sp = new URLSearchParams();
    Object.entries(values).forEach(([k, v]) => { if (v) sp.set(k, v); });
    setSearchParams(sp);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-main pt-24 pb-12 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink">Browse Listings</h1>
          {!loading && <p className="text-sm mt-1 text-muted">{total} listing{total !== 1 ? 's' : ''} found</p>}
        </div>

        <div className="mb-6">
          <FilterBar values={filters} onChange={handleFilterChange} />
        </div>

        {loading ? (
          <ListingGridSkeleton count={6} />
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-6 h-6 text-muted" />
            </div>
            <p className="text-xl font-semibold mb-2 text-ink">No listings found</p>
            <p className="text-sm text-muted mb-7">Try widening your price range or removing some filters.</p>
            {searchParams.toString().length > 0 && (
              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="bg-brand hover:bg-brand/90 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map(l => <ListingCard key={l._id} listing={l} />)}
            </div>

            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button onClick={() => fetchListings(currentPage - 1)} disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-line text-muted hover:text-ink hover:border-brand/30 transition-colors disabled:opacity-30">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-muted">
                  Page {currentPage} of {pages}
                </span>
                <button onClick={() => fetchListings(currentPage + 1)} disabled={currentPage === pages}
                  className="p-2 rounded-lg bg-white border border-line text-muted hover:text-ink hover:border-brand/30 transition-colors disabled:opacity-30">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
