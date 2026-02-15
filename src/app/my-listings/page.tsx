'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import Link from 'next/link';
import { House } from '@/types/house';

export default function MyListings() {
  const { currentUser } = useAuth();
  const { houses, loading, error, deleteHouse } = useHouses();
  const [myListings, setMyListings] = useState<House[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    if (houses && currentUser) {
      const userListings = houses.filter(house => house.landlordId === currentUser.uid);
      setMyListings(userListings as House[]);
    }
  }, [houses, currentUser]);

  const handleDelete = async (houseId: string) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      try {
        setDeleteLoading(houseId);
        await deleteHouse(houseId);
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="backdrop-blur-sm bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] bg-white/[0.05] animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-white/[0.05] rounded-md animate-pulse w-3/4" />
                <div className="h-4 bg-white/[0.05] rounded-md animate-pulse w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-white/[0.05] rounded-md animate-pulse w-20" />
                  <div className="h-8 w-20 bg-white/[0.05] rounded-lg animate-pulse" />
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
            <div className="backdrop-blur-lg bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-serif text-white mb-3">Something went wrong</h1>
              <p className="text-gray-400 mb-8 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 px-6 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
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
            <div className="backdrop-blur-lg bg-white/[0.03] border border-white/[0.08] rounded-2xl p-10 shadow-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange/10 rounded-full mb-6 border border-orange/20">
                <svg className="w-10 h-10 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif text-white mb-3">No listings yet</h2>
              <p className="text-gray-400 mb-8 leading-relaxed text-sm">
                Get started by creating your first property listing and start earning from student rentals.
              </p>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 w-full py-3 px-6 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-all justify-center"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {myListings.map((house) => (
          <div key={house.id} className="group backdrop-blur-lg bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-all duration-300">
            {/* Property Image */}
            {house.images && house.images.length > 0 && (
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={house.images[0]}
                  alt={house.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-md ${house.isActive
                      ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-300'
                    }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${house.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                    {house.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="p-5">
              <div className="mb-4">
                <h3 className="text-lg font-serif text-white mb-1.5 line-clamp-1 group-hover:text-orange transition-colors">{house.title}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-1.5 line-clamp-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {house.address}
                </p>
              </div>

              <div className="flex justify-between items-end mb-6 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="text-xl font-medium text-white font-mono">${house.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Available</div>
                  <div className="text-sm font-medium text-white">
                    {house.availableDate ? new Date(house.availableDate).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  href={`/listing/${house.id}`}
                  className="flex-1 py-2 px-3 bg-white/[0.05] border border-white/[0.1] text-white rounded-lg text-sm font-medium hover:bg-white/[0.1] transition-colors text-center"
                >
                  View
                </Link>
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="flex-1 py-2 px-3 bg-white/[0.05] border border-white/[0.1] text-white rounded-lg text-sm font-medium hover:bg-white/[0.1] transition-colors text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(house.id)}
                  disabled={deleteLoading === house.id}
                  className="flex-1 py-2 px-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === house.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
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
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange/10 rounded-full blur-[120px] opacity-20" />
        </div>

        <div className="max-w-md w-full relative z-10">
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 shadow-2xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange/10 border border-orange/20 rounded-full mb-6">
              <svg className="w-8 h-8 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-white mb-3">Sign in required</h1>
            <p className="text-gray-400 mb-8 text-sm">You need to be signed in to view and manage your property listings.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 w-full py-2.5 px-6 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-all justify-center"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-tight">My Listings</h1>
              <p className="text-gray-400 text-lg max-w-lg">
                Manage your student housing properties available for rent.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] border border-white/[0.1] rounded-full text-gray-300 text-xs font-medium mt-4">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
                <span>{myListings.length} Active {myListings.length === 1 ? 'Property' : 'Properties'}</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Property</span>
              </Link>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}