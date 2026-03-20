'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import Link from 'next/link';
import { House } from '@/types/house';
import ConfirmModal from '@/components/ConfirmModal';

export default function MyListings() {
  const { currentUser } = useAuth();
  const { houses, loading, error, deleteHouse } = useHouses();
  const [myListings, setMyListings] = useState<House[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    if (houses && currentUser) {
      const userListings = houses.filter(house => house.landlordId === currentUser.uid);
      setMyListings(userListings as House[]);
    }
  }, [houses, currentUser]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(deleteTarget);
      await deleteHouse(deleteTarget);
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setDeleteLoading(null);
      setDeleteTarget(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#e3d8d0]">
              <div className="aspect-[4/3] bg-[#e3d8d0] rounded-t-xl animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-[#e3d8d0] rounded-lg animate-pulse w-3/4" />
                <div className="h-4 bg-[#e3d8d0] rounded-lg animate-pulse w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-[#e3d8d0] rounded-lg animate-pulse w-20" />
                  <div className="h-8 w-20 bg-[#e3d8d0] rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-8 border border-[#e3d8d0]">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-xl mb-6">
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[#2c2420] mb-3">Something went wrong</h1>
              <p className="text-[#8a7b74] mb-8 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-6 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (myListings.length === 0) {
      return (
        <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white rounded-xl p-10 border border-[#e3d8d0]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 rounded-xl mb-6">
                <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#2c2420] mb-3">No listings yet</h2>
              <p className="text-[#8a7b74] mb-8 leading-relaxed text-sm">
                Get started by creating your first property listing and start earning from student rentals.
              </p>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 w-full py-2.5 px-6 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Your First Listing</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {myListings.map((house) => (
          <div key={house.id} className="group bg-white rounded-xl overflow-hidden border border-[#e3d8d0] hover:border-brand/30 transition-colors duration-200">
            {house.images && house.images.length > 0 ? (
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={house.images[0]}
                  alt={house.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md bg-white/90 ${house.isActive ? 'text-green-700' : 'text-[#8a7b74]'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${house.isActive ? 'bg-green-500' : 'bg-[#c4b8b0]'}`}></div>
                    {house.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[#f2ede8] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#c4b8b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-base font-medium text-[#2c2420] mb-1 line-clamp-1 group-hover:text-brand transition-colors">{house.title}</h3>
                <p className="text-xs text-[#8a7b74] flex items-center gap-1 line-clamp-1">
                  <svg className="w-3 h-3 flex-shrink-0 text-[#c4b8b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {house.address}
                </p>
              </div>

              <div className="flex justify-between items-end mb-5 pb-4 border-b border-[#f2ede8]">
                <div>
                  <div className="text-lg font-semibold text-[#2c2420]">${house.price.toLocaleString()}</div>
                  <div className="text-xs text-[#8a7b74]">per month</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#8a7b74]">Available</div>
                  <div className="text-sm font-medium text-[#2c2420]">
                    {house.availableDate ? new Date(house.availableDate).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/listing/${house.id}`}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#f2ede8] border border-[#e3d8d0] text-sm font-medium text-[#2c2420] hover:bg-[#e3d8d0] transition-colors text-center"
                >
                  View
                </Link>
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#f2ede8] border border-[#e3d8d0] text-sm font-medium text-[#2c2420] hover:bg-[#e3d8d0] transition-colors text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setDeleteTarget(house.id)}
                  disabled={deleteLoading === house.id}
                  className="flex-1 py-2 px-3 rounded-lg bg-red-50 border border-red-100 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === house.id ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl p-8 border border-[#e3d8d0] text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-brand/10 rounded-xl mb-6">
              <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#2c2420] mb-3">Sign in required</h1>
            <p className="text-[#8a7b74] mb-8 text-sm">You need to be signed in to view and manage your property listings.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 w-full py-2.5 px-6 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors justify-center"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#2c2420] mb-3">My Listings</h1>
              <p className="text-[#8a7b74] text-base max-w-lg">
                Manage your student housing properties available for rent.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#e8c84a]/40 bg-[#fdf7d6] rounded-lg text-[#8a7b74] text-xs mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8c84a]"></span>
                <span>{myListings.length} Active {myListings.length === 1 ? 'Property' : 'Properties'}</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Property</span>
              </Link>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Delete listing"
        message="Are you sure you want to delete this listing? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deleteLoading !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
