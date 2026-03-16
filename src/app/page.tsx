'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShieldCheck, Zap, Users, MapPin, ArrowRight } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useHouses } from '@/hooks/useHouses';
import HouseCard from '@/components/HouseCard';
import { House } from '@/types/house';

const USC_COORDS = { lat: 34.0224, lng: -118.2851 };

const lightMapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d7ec' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0f0f0' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e0e0e0' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#f5d6a8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4eac7' }] },
];

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: lightMapStyles,
};

const libraries: ("places" | "geometry")[] = ['places', 'geometry'];

export default function HomePage() {
  const router = useRouter();
  const { houses, loading } = useHouses();
  const [searchTerm, setSearchTerm] = useState('');
  const [pins, setPins] = useState<{ lat: number; lng: number; title: string; id: string }[]>([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const activeHouses = (houses as House[]).filter(h => h.isActive !== false);

  useEffect(() => {
    if (!isLoaded || activeHouses.length === 0) return;

    const geocodeListings = async () => {
      const geocoder = new google.maps.Geocoder();
      const results: { lat: number; lng: number; title: string; id: string }[] = [];

      const toGeocode = activeHouses.slice(0, 8);
      for (const house of toGeocode) {
        try {
          const res = await geocoder.geocode({ address: house.address });
          if (res.results?.[0]) {
            const loc = res.results[0].geometry.location.toJSON();
            results.push({ ...loc, title: house.title, id: house.id });
          }
        } catch {
          // skip failed geocodes
        }
      }
      setPins(results);
    };

    geocodeListings();
  }, [isLoaded, activeHouses.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/listings');
  };

  const features = [
    { icon: <ShieldCheck className="w-5 h-5 text-brand" />, title: "Verified listings", description: "Every property is vetted for quality." },
    { icon: <Users className="w-5 h-5 text-brand" />, title: "Student focused", description: "Built by Trojans, for Trojans." },
    { icon: <Zap className="w-5 h-5 text-brand" />, title: "Fast process", description: "Secure housing in minutes." }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-brand/20">
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start pt-10 lg:pt-20 pb-12">
            <div className="pt-4 lg:pt-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-xs font-medium text-brand mb-6">
                <span className="flex h-2 w-2 rounded-full bg-brand"></span>
                <span>{activeHouses.length} listings available near USC</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-[1.1] tracking-tight mb-5">
                Find a home.
                <br />
                <span className="text-brand">Not just a house.</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed max-w-lg">
                Direct connections to verified landlords near USC. No hidden fees, no complicated paperwork.
              </p>
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" placeholder="Search by address, title, or keyword..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all shadow-sm text-sm" />
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <button type="submit" className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-colors">Search</button>
                  </div>
                </div>
              </form>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Under $1,500', '1 Bed', '2+ Beds', 'Near Campus'].map((filter) => (
                  <Link key={filter} href="/listings" className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-brand hover:text-brand transition-colors">{filter}</Link>
                ))}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span><strong className="text-gray-900">{activeHouses.length}+</strong> Verified Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand"></div>
                  <span><strong className="text-gray-900">USC</strong> Students Only</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="h-[400px] lg:h-[520px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={USC_COORDS} zoom={14} options={mapOptions}>
                    <Marker position={USC_COORDS} icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#DC2626', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 3 }} title="USC Campus" />
                    {pins.map((pin) => (
                      <Marker key={pin.id} position={{ lat: pin.lat, lng: pin.lng }} icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#2845D6', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 }} title={pin.title} onClick={() => router.push(`/listing/${pin.id}`)} />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-3"></div>
                      <p className="text-sm text-gray-400">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-md px-3 py-2 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-600"></div><span className="text-gray-600">USC</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-brand"></div><span className="text-gray-600">Listings</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeHouses.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-1">Featured Listings</h2>
                <p className="text-gray-500 text-sm">Trending properties near USC</p>
              </div>
              <Link href="/listings" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors">View all<ArrowRight className="w-4 h-4" /></Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => (<div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse"></div>))}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{activeHouses.slice(0, 3).map((house) => (<HouseCard key={house.id} house={house} showFavoriteButton={false} />))}</div>
            )}
            <div className="sm:hidden mt-6 text-center"><Link href="/listings" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand/80 transition-colors">View all listings<ArrowRight className="w-4 h-4" /></Link></div>
          </div>
        </section>
      )}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">Why DormSC?</h2>
            <p className="text-gray-500 text-sm">Trusted by USC students for off-campus housing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center mb-4 mx-auto">{feature.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3">Are you a landlord?</h2>
          <p className="text-gray-500 mb-6 text-sm">List your property and connect directly with USC students looking for housing.</p>
          <Link href="/add-listing" className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full font-medium text-sm hover:bg-brand/90 transition-colors">List Your Property<ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </div>
  );
}
