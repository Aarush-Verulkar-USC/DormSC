'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MagnifyingGlass, ArrowRight } from '@phosphor-icons/react';
import { IconFilter, IconTarget, IconRocket } from '@tabler/icons-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useHouses } from '@/hooks/useHouses';
import HouseCard from '@/components/HouseCard';
import { House } from '@/types/house';

const USC_COORDS = { lat: 34.0224, lng: -118.2851 };

const warmMapStyles = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c8d8e8' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f2ede8' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e3d8d0' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#f0e0d0' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#dde8d4' }] },
];

const mapContainerStyle = { width: '100%', height: '100%' };

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: warmMapStyles,
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
    const params = searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : '';
    router.push(`/listings${params}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand/20">
      <div className="pt-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-10 lg:pt-20 pb-14">

            {/* Left */}
            <div className="pt-2 lg:pt-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#e8c84a]/40 bg-[#fdf7d6] text-xs text-[#8a7b74] mb-8">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#e8c84a]"></span>
                <span>{activeHouses.length} listings available near USC</span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-[1.15] tracking-tight text-[#2c2420] mb-5">
                Find a home.
                <br />
                <span className="text-brand italic">Not just a house.</span>
              </h1>

              <p className="text-base text-[#8a7b74] mb-8 leading-relaxed max-w-lg">
                Direct connections to verified landlords near USC. No hidden fees, no complicated paperwork.
              </p>

              <form onSubmit={handleSearch} className="mb-5">
                <div className="flex items-center gap-2 bg-white border border-[#e3d8d0] rounded-xl px-4 py-3 focus-within:border-brand/40 transition-colors">
                  <MagnifyingGlass className="h-4 w-4 text-[#8a7b74] shrink-0" weight="regular" />
                  <input
                    type="text"
                    placeholder="Search by address, title, or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-[#2c2420] placeholder-[#c4b8b0] focus:outline-none"
                  />
                  <button type="submit" className="px-4 py-1.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors shrink-0">
                    Search
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { label: 'Under $1,500', href: '/listings?maxPrice=1500' },
                  { label: '1 Bed', href: '/listings?bedrooms=1' },
                  { label: '2+ Beds', href: '/listings?bedrooms=2' },
                  { label: 'Near Campus', href: '/listings?sort=distance' },
                ].map((filter) => (
                  <Link key={filter.label} href={filter.href} className="px-3 py-1.5 bg-white border border-[#e3d8d0] rounded-lg text-sm text-[#8a7b74] hover:border-brand/40 hover:text-[#2c2420] transition-colors">
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Map */}
            <div className="relative">
              <div className="h-[400px] lg:h-[520px] rounded-xl overflow-hidden border border-[#e3d8d0] bg-[#f2ede8]">
                {isLoaded ? (
                  <GoogleMap mapContainerStyle={mapContainerStyle} center={USC_COORDS} zoom={14} options={mapOptions}>
                    <Marker
                      position={USC_COORDS}
                      icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: '#e8c84a', fillOpacity: 1, strokeColor: '#932210', strokeWeight: 2.5 }}
                      title="USC Campus"
                    />
                    {pins.map((pin) => (
                      <Marker
                        key={pin.id}
                        position={{ lat: pin.lat, lng: pin.lng }}
                        icon={{ path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#932210', fillOpacity: 1, strokeColor: '#932210', strokeWeight: 0 }}
                        title={pin.title}
                        onClick={() => router.push(`/listing/${pin.id}`)}
                      />
                    ))}
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-sm text-[#8a7b74]">Loading map...</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-3 left-3 bg-white border border-[#e3d8d0] rounded-lg px-3 py-1.5 flex items-center gap-4 text-xs text-[#8a7b74]">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#e8c84a] ring-1 ring-[#932210]"></div><span>USC</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-brand"></div><span>Listings</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Featured Listings */}
      {activeHouses.length > 0 && (
        <section className="py-16 border-t border-[#e3d8d0] bg-white">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-[#8a7b74] uppercase tracking-widest mb-2">Browse</p>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2c2420]">Featured Listings</h2>
                <p className="text-[#8a7b74] text-sm mt-1">Trending properties near USC</p>
              </div>
              <Link href="/listings" className="hidden sm:inline-flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (<div key={i} className="h-72 bg-[#f2ede8] rounded-xl animate-pulse"></div>))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {activeHouses.slice(0, 3).map((house) => (<HouseCard key={house.id} house={house} showFavoriteButton={false} />))}
              </div>
            )}
            <div className="sm:hidden mt-6 text-center">
              <Link href="/listings" className="inline-flex items-center gap-1 text-sm text-brand hover:text-brand/80 transition-colors">
                View all listings <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Why DormSC */}
      <section className="py-16 border-t border-[#e3d8d0]">
        <div className="max-w-4xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs text-[#8a7b74] uppercase tracking-widest mb-2">Why choose us</p>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2c2420] mb-2">Why DormSC?</h2>
            <p className="text-[#8a7b74] text-sm">Trusted by USC students for off-campus housing</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <IconFilter size={20} stroke={1.5} />, title: "Filtered", desc: "Only vetted, quality properties make it to the platform." },
              { icon: <IconTarget size={20} stroke={1.5} />, title: "Focused", desc: "Purpose-built for Trojans finding off-campus housing." },
              { icon: <IconRocket size={20} stroke={1.5} />, title: "Fast", desc: "From browsing to signing — done in minutes, not weeks." },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-[#e3d8d0] rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[#fdf7d6] border border-[#e8c84a]/40 text-[#9a7c00] mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#2c2420] mb-2">{f.title}</h3>
                <p className="text-sm text-[#8a7b74] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="py-16 border-t border-[#e3d8d0] bg-white">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-light text-[#2c2420] mb-3">Are you a landlord?</h2>
          <p className="text-[#8a7b74] mb-6 text-sm">List your property and connect directly with USC students looking for housing.</p>
          <Link href="/add-listing" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors">
            List Your Property <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
