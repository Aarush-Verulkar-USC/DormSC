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
        setMyListings(prev => prev.filter(house => house.id !== houseId));
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing. Please try again.');
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const toggleActive = async (house: House) => {
    // This would require an updateHouse function in your useHouses hook
    console.log('Toggle active status for:', house.id);
    // Implementation would go here
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-4">You need to be signed in to view your listings</p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-1">
              Manage your property listings
            </p>
          </div>
          <Link
            href="/add-listing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            + Add New Listing
          </Link>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No listings yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first property listing.</p>
            <div className="mt-6">
              <Link
                href="/add-listing"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Your First Listing
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {myListings.map((house) => (
              <div key={house.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{house.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          house.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {house.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{house.address}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          </svg>
                          {house.bedrooms} bed
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          {house.bathrooms} bath
                        </span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${house.price.toLocaleString()}/month
                        </span>
                      </div>

                      <div className="text-sm text-gray-500">
                        <p>Available: {new Date(house.availableDate).toLocaleDateString()}</p>
                        <p>Created: {new Date(house.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {house.images && house.images.length > 0 && (
                      <div className="ml-6 flex-shrink-0">
                        <img
                          src={house.images[0]}
                          alt={house.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Link
                        href={`/listing/${house.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Listing
                      </Link>
                      <Link
                        href={`/edit-listing/${house.id}`}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => toggleActive(house)}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                      >
                        {house.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(house.id)}
                      disabled={deleteLoading === house.id}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {deleteLoading === house.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}