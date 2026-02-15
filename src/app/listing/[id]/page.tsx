'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useHouses } from '@/hooks/useHouses';
import Link from 'next/link';
import { House } from '@/types/house';
import GoogleMapWithRoute from '@/components/GoogleMapWithRoute';
import { MapPin, Bed, Bath, Calendar, Check } from 'lucide-react';

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
    const confirmed = window.confirm('Are you sure you want to delete this listing?');
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-6">
          <h1 className="text-xl font-serif text-white mb-2">Property not found</h1>
          <p className="text-gray-500 text-sm mb-6">This listing may have been removed.</p>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            View Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Centered Container */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Management Buttons - Top Right if Owner/Admin */}
          {canManage && (
            <div className="flex items-center justify-end gap-2 mb-6">
              {isOwner && (
                <Link
                  href={`/edit-listing/${house.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-full hover:border-white/20 transition-all"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/20 rounded-full hover:border-red-500/30 transition-all disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}

          {/* Hero Image - Smaller, Centered */}
          {house.images && house.images.length > 0 ? (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={house.images[currentImageIndex]}
                alt={house.title}
                className="w-full h-full object-cover"
              />

              {house.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-md hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {house.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-1.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60 w-1.5'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full aspect-[16/9] bg-white/5 rounded-2xl mb-8" />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">{house.title}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4" />
              {house.address}
            </div>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
              <div className="text-2xl font-bold text-white">${house.price?.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">per month</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 flex items-center gap-3">
              <Bed className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-xl font-bold text-white">{house.bedrooms}</div>
                <div className="text-xs text-gray-500">bedrooms</div>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 flex items-center gap-3">
              <Bath className="w-5 h-5 text-gray-500" />
              <div>
                <div className="text-xl font-bold text-white">{house.bathrooms}</div>
                <div className="text-xs text-gray-500">bathrooms</div>
              </div>
            </div>
            {house.distanceToUSC && (
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{house.distanceToUSC}</div>
                <div className="text-xs text-gray-500 mt-1">miles to USC</div>
              </div>
            )}
          </div>

          {/* Description */}
          {house.description && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">About</h2>
              <p className="text-gray-300 leading-relaxed text-sm">{house.description}</p>
            </div>
          )}

          {/* Amenities */}
          {house.amenities && house.amenities.length > 0 && (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {house.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-sm text-gray-300"
                  >
                    <Check className="w-3.5 h-3.5 text-orange" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Card */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${house.price?.toLocaleString()}
                  <span className="text-base font-normal text-gray-500">/mo</span>
                </div>
                {house.availableDate && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Available {new Date(house.availableDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            {isOwner ? (
              <div className="text-center py-3 bg-white/[0.04] rounded-xl border border-white/[0.08]">
                <p className="text-sm text-gray-400">This is your listing</p>
              </div>
            ) : (
              <button
                onClick={handleContactClick}
                className="w-full py-3 px-4 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                Contact Landlord
              </button>
            )}

            {showContactInfo && house.landlordContact && (
              <div className="mt-4 space-y-2">
                {house.landlordContact.email && (
                  <a
                    href={`mailto:${house.landlordContact.email}`}
                    className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-sm text-gray-300"
                  >
                    {house.landlordContact.email}
                  </a>
                )}
                {house.landlordContact.phone && (
                  <a
                    href={`tel:${house.landlordContact.phone}`}
                    className="flex items-center gap-3 p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-sm text-gray-300"
                  >
                    {house.landlordContact.phone}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Route to USC</h2>
            </div>
            <div className="px-3 pb-3">
              <div className="rounded-xl overflow-hidden">
                <GoogleMapWithRoute address={house.address} height="h-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
