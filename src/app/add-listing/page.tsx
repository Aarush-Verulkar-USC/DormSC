'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import { useRouter } from 'next/navigation';
import { useBlockedUsers } from '@/hooks/useBlockedUsers';
import GoogleAddressAutocomplete from '@/components/GoogleAddressAutocomplete';
import Link from 'next/link';

const amenitiesList = [
  'WiFi', 'Parking', 'Laundry', 'Kitchen', 'Air Conditioning',
  'Heating', 'Dishwasher', 'Balcony', 'Garden', 'Gym Access',
  'Pool', 'Security', 'Furnished', 'Pet Friendly'
];

interface FormData {
  title: string;
  description: string;
  address: string;
  addressCoordinates?: [number, number];
  price: string;
  bedrooms: string;
  bathrooms: string;
  distanceToUSC: string;
  availableDate: string;
  landlordContact: {
    name: string;
    email: string;
    phone: string;
  };
  amenities: string[];
  images: string[];
}

export default function AddListing() {
  const { currentUser } = useAuth();
  const { addHouse, getHousesByLandlord } = useHouses();
  const { isBlocked } = useBlockedUsers();
  const router = useRouter();

  const userBlocked = isBlocked(currentUser?.email);
  const [loading, setLoading] = useState(false);
  const [listingCount, setListingCount] = useState(0);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    distanceToUSC: '',
    availableDate: '',
    landlordContact: {
      name: '',
      email: currentUser?.email || '',
      phone: ''
    },
    amenities: [],
    images: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, landlordContact: { ...prev.landlordContact, [name]: value } }));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  useEffect(() => {
    const checkListingLimit = async () => {
      if (currentUser) {
        try {
          const userListings = await getHousesByLandlord(currentUser.uid);
          const activeListings = userListings.filter(house => house.isActive);
          setListingCount(activeListings.length);
        } catch (error) {
          console.error('Error checking listing count:', error);
        }
      }
      setCheckingLimit(false);
    };

    checkListingLimit();
  }, [currentUser, getHousesByLandlord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (userBlocked) {
      alert('Your account has been restricted. You cannot create listings.');
      return;
    }
    if (listingCount >= 2) {
      alert('You have reached the maximum limit of 2 active listings.');
      return;
    }

    if (!formData.addressCoordinates) {
      alert('Please select a valid address from the suggestions.');
      return;
    }

    try {
      setLoading(true);
      const listingData = {
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseFloat(formData.bathrooms),
        images: formData.images.filter(img => img.trim() !== ''),
        landlordId: currentUser.uid,
        isActive: true
      };
      const houseId = await addHouse(listingData);
      router.push(`/listing/${houseId}`);
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Modern input styles matching login page theme
  const inputStyle = "w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/50 transition-all font-sans text-sm";
  const selectStyle = "w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/50 transition-all font-sans text-sm appearance-none";
  const textareaStyle = "w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange/50 focus:ring-1 focus:ring-orange/50 transition-all font-sans text-sm resize-y min-h-[120px]";

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
            <p className="text-gray-400 mb-8 text-sm">You need to be signed in to add a new property listing.</p>
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
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-orange/5 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-3">Add New Listing</h1>
            <p className="text-gray-400 text-lg">Share your property with the USC student community</p>
          </div>

          {userBlocked && (
            <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>Your account has been restricted. You cannot create listings.</span>
            </div>
          )}

          {listingCount >= 2 && (
            <div className="mb-6 px-4 py-3 bg-orange/10 border border-orange/20 rounded-xl text-orange text-sm flex items-center gap-3">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>
                Maximum active listings reached (2). Please manage your listings in <a href="/my-listings" className="underline font-semibold hover:text-white transition-colors">My Listings</a>.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Property Details Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-sm font-sans font-bold text-orange border border-orange/20">1</span>
                Property Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Property Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="e.g., Spacious 3BR House Near USC"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Monthly Rent ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="1"
                      max="10000"
                      step="1"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="2400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Address *</label>
                  <GoogleAddressAutocomplete
                    value={formData.address}
                    onChange={(address: string, coordinates?: [number, number]) => {
                      setFormData(prev => ({
                        ...prev,
                        address,
                        addressCoordinates: coordinates
                      }));
                    }}
                    placeholder="Start typing address near USC..."
                    className={inputStyle}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Select from suggestions to auto-calculate distance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Bedrooms *</label>
                    <select name="bedrooms" required value={formData.bedrooms} onChange={handleInputChange} className={selectStyle}>
                      <option value="">Select</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}{num === 5 ? '+' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Bathrooms *</label>
                    <select name="bathrooms" required value={formData.bathrooms} onChange={handleInputChange} className={selectStyle}>
                      <option value="">Select</option>
                      {['1', '1.5', '2', '2.5', '3', '3.5', '4+'].map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                      Distance to USC
                    </label>
                    <input
                      type="text"
                      name="distanceToUSC"
                      value={formData.distanceToUSC}
                      readOnly
                      className={`${inputStyle} cursor-not-allowed opacity-70`}
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Available Date</label>
                  <input
                    type="date"
                    name="availableDate"
                    min={new Date().toISOString().split('T')[0]}
                    max="2099-12-31"
                    value={formData.availableDate}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={textareaStyle}
                    placeholder="Tell students what makes this place special..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-sm font-sans font-bold text-orange border border-orange/20">2</span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.landlordContact.name}
                    onChange={handleContactChange}
                    className={inputStyle}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Email * <span className="text-gray-600 normal-case ml-1">(Locked)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.landlordContact.email}
                    readOnly
                    className={`${inputStyle} cursor-not-allowed opacity-70`}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.landlordContact.phone}
                    onChange={handleContactChange}
                    className={inputStyle}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Amenities Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-sm font-sans font-bold text-orange border border-orange/20">3</span>
                Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="group flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg border border-white/[0.05] cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.1] transition-all">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="peer h-4 w-4 rounded border-white/30 bg-white/10 text-orange focus:ring-orange/50 focus:ring-offset-0"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Images Card */}
            <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange/10 flex items-center justify-center text-sm font-sans font-bold text-orange border border-orange/20">4</span>
                Images
              </h2>

              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className={inputStyle}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors px-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add another image URL
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading || userBlocked || listingCount >= 2 || checkingLimit}
                className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-medium text-lg hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none min-w-[200px]"
              >
                {checkingLimit ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Checking limits...</span>
                  </>
                ) : loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Listing...</span>
                  </>
                ) : (
                  <>
                    <span>Create Listing</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}