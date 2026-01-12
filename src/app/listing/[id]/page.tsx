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

  // --- All handler functions (nextImage, handleDelete, etc.) remain the same ---

  const nextImage = () => {
    if (house?.images && house.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === house.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (house?.images && house.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? house.images!.length - 1 : prev - 1));
    }
  };

  const handleContactClick = () => {
    if (currentUser) {
      setShowContactInfo(true);
    } else {
      router.push('/login');
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

  const isOwner = currentUser && house && house.landlordId === currentUser.uid;

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Loading Property Details</h1>
            <p className="text-gray-300">Please wait while we fetch the listing information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-purple-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.15),transparent)] opacity-60"></div>
        </div>

        <div className="relative z-10 pt-24 pb-12 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto px-4 text-center">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Property Not Found</h1>
              <p className="text-gray-300 mb-8 leading-relaxed">This listing may have been removed or is no longer available.</p>
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 w-full py-3 px-6 bg-white text-gray-900 rounded-2xl font-medium hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-lg justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Listings</span>
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

          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Listings</span>
            </Link>

            {isOwner && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-sm font-medium">Edit</span>
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-lg bg-red-500/20 border border-red-400/30 rounded-2xl text-red-200 hover:bg-red-500/30 transition-all duration-300 hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:transform-none"
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm font-medium">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="text-sm font-medium">Delete</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{house.title}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-lg bg-white/10 border border-white/20 rounded-full text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{house.address}</span>
            </div>
          </div>
          
          {/* Image Gallery */}
          {house.images && house.images.length > 0 && (
            <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={house.images[currentImageIndex]}
                alt={house.title}
                className="w-full h-96 md:h-[500px] object-cover"
              />
              {house.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-lg bg-white/20 border border-white/30 hover:bg-white/30 rounded-full p-3 shadow-lg text-white transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-lg bg-white/20 border border-white/30 hover:bg-white/30 rounded-full p-3 shadow-lg text-white transition-all duration-300 hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Image indicator dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {house.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-8">

              {/* Price and Stats Card */}
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      ${house.price?.toLocaleString()}
                      <span className="text-lg font-normal text-gray-300">/mo</span>
                    </h2>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-200 text-sm">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span>Available</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{house.bedrooms}</div>
                      <div className="text-sm text-gray-300">Bedrooms</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{house.bathrooms}</div>
                      <div className="text-sm text-gray-300">Bathrooms</div>
                    </div>
                    {house.distanceToUSC && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{house.distanceToUSC}</div>
                        <div className="text-sm text-gray-300">mi to USC</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Card */}
              {house.description && (
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    About This Property
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">{house.description}</p>
                </div>
              )}

              {/* Amenities Card */}
              {house.amenities && house.amenities.length > 0 && (
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {house.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 font-medium">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Card */}
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h2>
                <div className="rounded-2xl overflow-hidden border border-white/20">
                  <MapBox address={house.address} height="h-80" />
                </div>
              </div>
            </div>

            {/* Right Column - Contact Card */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl sticky top-24">

                {/* Availability */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-300">Availability</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {house.availableDate
                      ? `Available ${new Date(house.availableDate).toLocaleDateString()}`
                      : 'Contact for availability'
                    }
                  </p>
                </div>

                {/* Contact Button */}
                {isOwner ? (
                  <div className="text-center p-4 bg-white/10 rounded-2xl border border-white/20">
                    <svg className="w-8 h-8 text-green-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-300">This is your listing</p>
                  </div>
                ) : (
                  <button
                    onClick={handleContactClick}
                    className="w-full py-4 px-6 bg-white text-gray-900 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Landlord
                  </button>
                )}

                {/* Contact Information */}
                {showContactInfo && house.landlordContact && (
                  <div className="mt-6 pt-6 border-t border-white/20 space-y-4">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Contact Information
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Name</div>
                        <div className="text-sm font-medium text-white">{house.landlordContact.name}</div>
                      </div>

                      <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="text-xs text-gray-400 mb-1">Email</div>
                        <a
                          href={`mailto:${house.landlordContact.email}`}
                          className="text-sm font-medium text-white hover:text-blue-300 transition-colors break-all"
                        >
                          {house.landlordContact.email}
                        </a>
                      </div>

                      {house.landlordContact.phone && (
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                          <div className="text-xs text-gray-400 mb-1">Phone</div>
                          <a
                            href={`tel:${house.landlordContact.phone}`}
                            className="text-sm font-medium text-white hover:text-blue-300 transition-colors"
                          >
                            {house.landlordContact.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Login Prompt */}
                {!currentUser && !isOwner && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-center text-sm text-gray-400 leading-relaxed">
                      You must be signed in to view contact information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}