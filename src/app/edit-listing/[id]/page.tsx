'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHouses } from '@/hooks/useHouses';
import { useRouter, useParams } from 'next/navigation';
import { House } from '@/types/house';
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
  isActive: boolean;
}

export default function EditListing() {
  const { currentUser } = useAuth();
  const { houses, updateHouse, loading: housesLoading } = useHouses();
  const router = useRouter();
  const params = useParams();
  const listingId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [house, setHouse] = useState<House | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '', description: '', address: '', price: '', bedrooms: '', bathrooms: '',
    distanceToUSC: '', availableDate: '',
    landlordContact: { name: '', email: '', phone: '' },
    amenities: [], images: [''], isActive: true
  });

  useEffect(() => {
    if (houses && listingId && currentUser) {
      const foundHouse = houses.find(h => h.id === listingId) as House;
      if (foundHouse) {
        if (foundHouse.landlordId !== currentUser.uid) {
          router.push('/my-listings');
          return;
        }
        
        setHouse(foundHouse);
        setFormData({
          title: foundHouse.title || '',
          description: foundHouse.description || '',
          address: foundHouse.address || '',
          price: foundHouse.price?.toString() || '',
          bedrooms: foundHouse.bedrooms?.toString() || '',
          bathrooms: foundHouse.bathrooms?.toString() || '',
          distanceToUSC: foundHouse.distanceToUSC || '',
          availableDate: foundHouse.availableDate ? new Date(foundHouse.availableDate).toISOString().split('T')[0] : '',
          landlordContact: foundHouse.landlordContact || { name: '', email: currentUser.email || '', phone: '' },
          amenities: foundHouse.amenities || [],
          images: foundHouse.images && foundHouse.images.length > 0 ? foundHouse.images : [''],
          isActive: foundHouse.isActive !== false
        });
      }
    }
  }, [houses, listingId, currentUser, router]);

  // --- All handler functions (handleInputChange, etc.) remain the same ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, landlordContact: {...prev.landlordContact, [name]: value }}));
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]}));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => ({...prev, images: prev.images.map((img, i) => i === index ? value : img)}));
  };

  const addImageField = () => setFormData(prev => ({...prev, images: [...prev.images, '']}));
  const removeImageField = (index: number) => setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !house) return;
    try {
      setLoading(true);
      const updatedData = {
        ...formData,
        price: parseInt(formData.price), bedrooms: parseInt(formData.bedrooms), bathrooms: parseFloat(formData.bathrooms),
        images: formData.images.filter(img => img.trim() !== '')
      };
      await updateHouse(house.id, updatedData);
      router.push('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (housesLoading || !house) {
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
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Loading Listing</h1>
              <p className="text-gray-300">Getting your property details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = "mt-2 w-full border border-white/10 rounded-xl p-3 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 backdrop-blur-sm transition-all duration-200";
  const selectStyle = "mt-2 w-full border border-white/10 rounded-xl p-3 bg-white/5 text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 backdrop-blur-sm transition-all duration-200";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(58,41,255,0.15),transparent)] opacity-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,148,180,0.15),transparent)] opacity-40"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Edit Listing</h1>
              <p className="text-gray-300 text-lg">Update the details for your property</p>
            </div>
            <Link
              href="/my-listings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-300 self-center md:self-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to My Listings
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Listing Status Card */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Listing Status</h2>
              </div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="font-medium text-gray-200">Active Listing (visible to students)</span>
              </label>
            </div>

            {/* Property Details Card */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Property Details</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Property Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="Beautiful 2BR apartment near USC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Rent ($)</label>
                    <input
                      type="number"
                      name="price"
                      required
                      value={formData.price}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="2500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className={inputStyle}
                    placeholder="123 Main St, Los Angeles, CA 90007"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bedrooms</label>
                    <select name="bedrooms" required value={formData.bedrooms} onChange={handleInputChange} className={selectStyle}>
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Bathrooms</label>
                    <select name="bathrooms" required value={formData.bathrooms} onChange={handleInputChange} className={selectStyle}>
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="1.5">1.5</option>
                      <option value="2">2</option>
                      <option value="2.5">2.5</option>
                      <option value="3">3</option>
                      <option value="3.5">3.5</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Distance to USC (miles)</label>
                    <input
                      type="text"
                      name="distanceToUSC"
                      value={formData.distanceToUSC}
                      onChange={handleInputChange}
                      className={inputStyle}
                      placeholder="1.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Available Date</label>
                  <input
                    type="date"
                    name="availableDate"
                    value={formData.availableDate}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`${inputStyle} resize-y`}
                    placeholder="Describe your property, its features, and what makes it special..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.landlordContact.name}
                    onChange={handleContactChange}
                    className={inputStyle}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.landlordContact.email}
                    onChange={handleContactChange}
                    className={inputStyle}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone (Optional)</label>
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
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Amenities</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-gray-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Images Card */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Property Images</h2>
              </div>
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className={`${inputStyle} flex-grow`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageField}
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Another Image
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full sm:w-auto px-8 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}