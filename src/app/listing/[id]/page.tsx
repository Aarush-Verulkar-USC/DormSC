'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouses } from '@/hooks/useHouses';
import Link from 'next/link';
import { House } from '@/types/house';
import MapBoxWithRoute from '@/components/MapBoxWithRoute';

export default function ListingDetail() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, isAdmin } = useAuth();
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
  const canManage = isOwner || isAdmin;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Property not found</h1>
          <p className="text-gray-500 text-sm mb-6">This listing may have been removed or is no longer available.</p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <div className="pt-24 pb-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Listings
          </Link>

          {canManage && (
            <div className="flex items-center gap-2">
              {isOwner && (
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>
              )}
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:border-red-500/30 hover:bg-red-500/5 transition-all disabled:opacity-50"
              >
                {deleteLoading ? (
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Image */}
      {house.images && house.images.length > 0 ? (
        <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-900">
          <img
            src={house.images[currentImageIndex]}
            alt={house.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

          {house.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {house.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-900" />
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10 pb-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{house.title}</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {house.address}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <div className="text-2xl font-bold text-white font-mono">${house.price?.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1 font-sans">per month</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <div className="text-2xl font-bold text-white font-mono">{house.bedrooms}</div>
                <div className="text-xs text-gray-500 mt-1 font-sans">bedrooms</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <div className="text-2xl font-bold text-white font-mono">{house.bathrooms}</div>
                <div className="text-xs text-gray-500 mt-1 font-sans">bathrooms</div>
              </div>
              {house.distanceToUSC && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                  <div className="text-2xl font-bold text-white font-mono">{house.distanceToUSC}</div>
                  <div className="text-xs text-gray-500 mt-1 font-sans">miles to USC</div>
                </div>
              )}
            </div>

            {/* Description */}
            {house.description && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{house.description}</p>
              </div>
            )}

            {/* Amenities */}
            {house.amenities && house.amenities.length > 0 && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {house.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-gray-300"
                    >
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Route to USC</h2>
              </div>
              <div className="px-3 pb-3">
                <div className="rounded-xl overflow-hidden">
                  <MapBoxWithRoute address={house.address} height="h-80" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sticky top-24 space-y-6">

              {/* Price highlight */}
              <div>
                <div className="text-3xl font-bold text-white font-mono">
                  ${house.price?.toLocaleString()}
                  <span className="text-base font-normal text-gray-500 font-sans">/mo</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span className="text-xs text-purple-400 font-medium">Available</span>
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Availability */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">Move-in Date</div>
                <div className="text-sm font-medium text-white">
                  {house.availableDate
                    ? new Date(house.availableDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'Contact for availability'
                  }
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Contact */}
              {isOwner ? (
                <div className="text-center py-3 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                  <p className="text-sm text-gray-400">This is your listing</p>
                </div>
              ) : (
                <button
                  onClick={handleContactClick}
                  className="w-full py-3 px-4 bg-white text-gray-900 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Landlord
                </button>
              )}

              {/* Contact Info */}
              {showContactInfo && house.landlordContact && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Contact Info</div>
                  <div className="space-y-2">
                    {house.landlordContact.name && (
                      <div className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm text-gray-300">{house.landlordContact.name}</span>
                      </div>
                    )}
                    {house.landlordContact.email && (
                      <a
                        href={`mailto:${house.landlordContact.email}`}
                        className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-300 break-all">{house.landlordContact.email}</span>
                      </a>
                    )}
                    {house.landlordContact.phone && (
                      <a
                        href={`tel:${house.landlordContact.phone}`}
                        className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm text-gray-300">{house.landlordContact.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {!currentUser && !isOwner && (
                <p className="text-center text-xs text-gray-600">
                  Sign in to view contact information
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
