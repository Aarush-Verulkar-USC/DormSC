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
            <div key={i} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-700/50 to-gray-600/50 animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-600/50 rounded-xl animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-600/50 rounded-lg animate-pulse" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 w-20 bg-gray-600/50 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-gray-600/50 rounded-full animate-pulse" />
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
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
              <p className="text-gray-300 mb-8 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
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
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-8">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">No listings yet</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">Get started by creating your first property listing and start earning from student rentals.</p>
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-2 w-full py-3 px-6 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div key={house.id} className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            {/* Property Image */}
            {house.images && house.images.length > 0 && (
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={house.images[0]}
                  alt={house.title}
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${
                    house.isActive
                      ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-200'
                      : 'bg-gray-500/20 border border-gray-400/30 text-gray-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${house.isActive ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                    {house.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{house.title}</h3>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {house.address}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-white">${house.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">per month</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Available</div>
                  <div className="text-sm font-medium text-white">
                    {house.availableDate ? new Date(house.availableDate).toLocaleDateString() : 'TBD'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  href={`/listing/${house.id}`}
                  className="flex-1 py-2 px-4 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300 text-center"
                >
                  View
                </Link>
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="flex-1 py-2 px-4 bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-all duration-300 text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(house.id)}
                  disabled={deleteLoading === house.id}
                  className="flex-1 py-2 px-4 bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl text-sm font-medium hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading === house.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs">Deleting...</span>
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Sign in required</h1>
              <p className="text-gray-300 mb-8 leading-relaxed">You need to be signed in to view and manage your property listings.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 w-full py-3 px-6 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">My Listings</h1>
              <p className="text-gray-300 text-lg">
                Manage your properties available for rent.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-200 text-sm mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{myListings.length} {myListings.length === 1 ? 'property' : 'properties'}</span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Link
                href="/add-listing"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-2xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Listing</span>
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