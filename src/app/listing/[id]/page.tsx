'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouses } from '@/hooks/useHouses';
import Link from 'next/link';
import { House } from '@/types/house';
import MapBox from '@/components/MapBox';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { deleteHouse } = useHouses();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const houseDoc = await getDoc(doc(db, 'houses', params.id as string));
        if (houseDoc.exists()) {
          setHouse({ id: houseDoc.id, ...houseDoc.data() } as House);
        }
      } catch (error) {
        console.error('Error fetching house:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchHouse();
    }
  }, [params.id]);

  const nextImage = () => {
    if (house?.images && house.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === house.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (house?.images && house.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? house.images!.length - 1 : prev - 1
      );
    }
  };

  const handleContactClick = () => {
    if (currentUser) {
      setShowContactInfo(true);
    } else {
      alert('Please sign in to view contact information');
    }
  };

  const handleDelete = async () => {
    if (!house || !currentUser) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await deleteHouse(house.id);
      router.push('/listings');
    } catch (error) {
      console.error('Error deleting house:', error);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper function to format distance
  const formatDistance = (distance: string) => {
    if (!distance) return '';
    if (distance.toLowerCase().includes('mile')) return distance;
    return `${distance} miles`;
  };

  const isOwner = currentUser && house && house.landlordId === currentUser.uid;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">House not found</h1>
            <Link href="/listings" className="text-blue-600 hover:text-blue-800">
              Back to listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <Link href="/listings" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Back to listings
          </Link>
          {isOwner && (
            <div className="space-x-2">
              <Link
                href={`/edit-listing/${house.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8">
          <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
            {house.images && house.images.length > 0 ? (
              <img
                src={house.images[currentImageIndex]}
                alt={house.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {house.images && house.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {house.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {house.title}
              </h1>
              <p className="text-gray-600 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {house.address}
              </p>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{house.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{house.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{formatDistance(house.distanceToUSC)}</div>
                <div className="text-sm text-gray-600">from USC</div>
              </div>
            </div>

            {/* Description */}
            {house.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">
                  {house.description}
                </p>
              </div>
            )}

            {/* Amenities */}
            {house.amenities && house.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {house.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
              <MapBox address={house.address} height="h-80" />
              <p className="text-sm text-gray-600 mt-2">{house.address}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${house.price?.toLocaleString()}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">
                  Available: {house.availableDate ? new Date(house.availableDate).toLocaleDateString() : 'TBD'}
                </p>
              </div>

              {currentUser && !isOwner ? (
                <div className="space-y-3">
                  <button
                    onClick={handleContactClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Contact Landlord
                  </button>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg transition-colors">
                    Save to Favorites
                  </button>

                  {showContactInfo && house.landlordContact && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {house.landlordContact.name}</p>
                        <p><span className="font-medium">Email:</span> {house.landlordContact.email}</p>
                        <p><span className="font-medium">Phone:</span> {house.landlordContact.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : isOwner ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">This is your listing</p>
                  <div className="space-y-2">
                    <Link
                      href={`/edit-listing/${house.id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors inline-block text-center"
                    >
                      Edit Listing
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Sign in to contact the landlord</p>
                  <Link
                    href="/login"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors inline-block text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}