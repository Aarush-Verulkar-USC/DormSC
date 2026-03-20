'use client';
import { useState, useEffect } from 'react';
import HouseCard from '@/components/HouseCard';
import FilterBar from '@/components/FilterBar';
import { useHouses } from '@/hooks/useHouses';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { House, CreateHouseData } from '@/types/house';
import { Loader2, Database, CheckCircle2, XCircle } from 'lucide-react';

interface FilterType {
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  availableBy: string;
}

const SEED_LISTINGS: Omit<CreateHouseData, 'landlordId' | 'landlordContact' | 'isActive'>[] = [
  {
    title: 'The Lorenzo — Luxury 1BR',
    description: 'Upscale student housing half a mile from USC campus. Features resort-style pools, 3-story fitness center with rock climbing wall, stadium movie theater, and complimentary shuttle to campus. Fully furnished with in-unit washer/dryer and free 1 Gbps Wi-Fi.',
    address: '325 W Adams Blvd, Los Angeles, CA 90007',
    price: 2599, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.5', availableDate: '2026-08-15',
    amenities: ['Furnished', 'Pool', 'Gym', 'Washer/Dryer', 'Wi-Fi', 'Parking', 'Shuttle'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'],
  },
  {
    title: 'The Lorenzo — Spacious 2BR',
    description: 'Two-bedroom apartment at The Lorenzo with rooftop sundeck, basketball courts, saunas, and on-site restaurant. Located within the USC Campus Patrol Area with walking distance to fraternity row.',
    address: '325 W Adams Blvd, Los Angeles, CA 90007',
    price: 3299, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.5', availableDate: '2026-08-15',
    amenities: ['Furnished', 'Pool', 'Gym', 'Washer/Dryer', 'Wi-Fi', 'Restaurant', 'Shuttle'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  },
  {
    title: 'The 505 — Modern Studio',
    description: 'Brand new studio apartment steps from USC on Figueroa. Fully furnished with luxury amenities including recording studio, yoga studio, spa, and study lounges.',
    address: '505 W 31st St, Los Angeles, CA 90007',
    price: 1850, bedrooms: 0, bathrooms: 1, distanceToUSC: '0.3', availableDate: '2026-06-01',
    amenities: ['Furnished', 'Gym', 'Study Lounge', 'Spa', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'],
  },
  {
    title: 'The 505 — 2BR/2BA Suite',
    description: 'Two-bedroom suite at The 505 with panoramic views. Premium finishes, stainless steel appliances, and access to all building amenities including pool deck and fitness center.',
    address: '505 W 31st St, Los Angeles, CA 90007',
    price: 3100, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.3', availableDate: '2026-08-01',
    amenities: ['Furnished', 'Pool', 'Gym', 'Washer/Dryer', 'Study Lounge'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
  },
  {
    title: 'West 27th — Private BR',
    description: 'Fully furnished apartment with private bedroom and bathroom. Walk-to-class location with 24-hour fitness center, Academic Success Center, pools, and in-unit washer/dryer.',
    address: '530 W 27th St, Los Angeles, CA 90007',
    price: 1650, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.4', availableDate: '2026-08-15',
    amenities: ['Furnished', 'Pool', 'Gym', 'Washer/Dryer', 'Study Lounge', 'Parking'],
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
  },
  {
    title: 'Icon Plaza — Furnished 1BR',
    description: 'Furnished one-bedroom at Icon Plaza on Figueroa. Private balcony patio, fitness center, Academic Success Center, and pool. Walking distance to USC campus.',
    address: '3584 S Figueroa St, Los Angeles, CA 90007',
    price: 2100, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.6', availableDate: '2026-07-01',
    amenities: ['Furnished', 'Pool', 'Gym', 'Balcony', 'Study Lounge', 'Parking'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80'],
  },
  {
    title: 'Element — 3BR Townhome',
    description: 'Three-bedroom, three-bathroom fully furnished townhome near USC. Flexible leasing with roommate matching available. Starting at $875 per person per month.',
    address: '2595 Portland St, Los Angeles, CA 90007',
    price: 2625, bedrooms: 3, bathrooms: 3, distanceToUSC: '0.7', availableDate: '2026-08-15',
    amenities: ['Furnished', 'Washer/Dryer', 'Parking', 'Roommate Matching'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  },
  {
    title: 'The Bryce — Renovated Studio',
    description: 'Completely renovated studio, 5-minute walk from campus. New appliances, new flooring, wall-mounted TV. Covered parking and laundry facilities. Pet-friendly.',
    address: '1287 W 37th Pl, Los Angeles, CA 90007',
    price: 1900, bedrooms: 0, bathrooms: 1, distanceToUSC: '0.3', availableDate: '2026-06-01',
    amenities: ['Renovated', 'Parking', 'Laundry', 'Pet-Friendly'],
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
  },
  {
    title: 'The Bryce — 2BR/2BA',
    description: 'Two-bedroom, two-bathroom renovated apartment steps from USC. Modern finishes throughout with covered parking. Perfect for roommates. 736 sq ft.',
    address: '1287 W 37th Pl, Los Angeles, CA 90007',
    price: 2800, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.3', availableDate: '2026-08-01',
    amenities: ['Renovated', 'Parking', 'Laundry', 'Pet-Friendly'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
  },
  {
    title: 'The Bryce — 3BR House',
    description: 'Spacious three-bedroom with 835 sq ft. Fully renovated with new appliances, flooring, and fixtures. Covered parking included. 5-minute walk to campus.',
    address: '1287 W 37th Pl, Los Angeles, CA 90007',
    price: 3300, bedrooms: 3, bathrooms: 1, distanceToUSC: '0.3', availableDate: '2026-08-15',
    amenities: ['Renovated', 'Parking', 'Laundry', 'Pet-Friendly'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'],
  },
  {
    title: 'Hub LA — Modern 1BR',
    description: 'One-bedroom at Hub LA Figueroa, built in 2023. 24-hour fitness center, pool, spa, and fully furnished. 9-minute walk to Jefferson/USC Metro station.',
    address: '2722 S Figueroa St, Los Angeles, CA 90007',
    price: 1800, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.8', availableDate: '2026-07-01',
    amenities: ['Furnished', 'Pool', 'Gym', 'Spa', 'Pet-Friendly', 'Metro Access'],
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'],
  },
  {
    title: 'Trojan Village — Affordable Studio',
    description: 'Cozy studio just 2 blocks west of USC campus. Hardwood floors, 24-hour laundry, and gated parking. Great value for students on a budget. 445 sq ft.',
    address: '2619 Ellendale Pl, Los Angeles, CA 90007',
    price: 1595, bedrooms: 0, bathrooms: 1, distanceToUSC: '0.2', availableDate: '2026-06-01',
    amenities: ['Hardwood Floors', 'Laundry', 'Gated Parking'],
    images: ['https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&q=80'],
  },
  {
    title: 'W 35th St — Budget Room',
    description: 'Furnished room one block from USC. Includes utilities, wireless internet, and shared kitchen. 350 sq ft with desk, dresser, and bed. 9-month lease available.',
    address: '1182 W 35th St, Los Angeles, CA 90007',
    price: 975, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.1', availableDate: '2026-06-01',
    amenities: ['Furnished', 'Wi-Fi', 'Utilities Included'],
    images: ['https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80'],
  },
  {
    title: 'Trojan Spaces — 1BR on Adams',
    description: 'One-bedroom at Trojan Spaces on Adams Blvd. 500 sq ft with gas, water, and trash included. Free gated parking. Close to campus and public transit.',
    address: '1286 W Adams Blvd, Los Angeles, CA 90007',
    price: 2075, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.6', availableDate: '2026-06-01',
    amenities: ['Gated Parking', 'Utilities Included', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'],
  },
  {
    title: 'Trojan Spaces — Spacious 2BR',
    description: 'Large two-bedroom, 2.5 bathroom with 1,300 sq ft. Gas, water, and trash included with free gated parking. Ideal for two roommates.',
    address: '1286 W Adams Blvd, Los Angeles, CA 90007',
    price: 4200, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.6', availableDate: '2026-08-01',
    amenities: ['Gated Parking', 'Utilities Included', 'Laundry', 'Spacious'],
    images: ['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'],
  },
  {
    title: 'Ellendale Place — Cozy 1BR',
    description: 'Charming one-bedroom near USC and Shrine Auditorium. Quiet residential street with easy access to campus. Hardwood floors and natural light throughout.',
    address: '2727 Ellendale Pl, Los Angeles, CA 90007',
    price: 1450, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.4', availableDate: '2026-07-01',
    amenities: ['Hardwood Floors', 'Laundry', 'Parking'],
    images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80'],
  },
  {
    title: 'S Oak St — 2BR Near Campus',
    description: 'Two-bedroom on S Oak St, steps from the 23rd St corridor. 925 sq ft with updated appliances. Walking distance to USC Village and campus.',
    address: '867 W 23rd St, Los Angeles, CA 90007',
    price: 2900, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.5', availableDate: '2026-08-01',
    amenities: ['Updated Appliances', 'Laundry', 'Parking'],
    images: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&q=80'],
  },
  {
    title: 'W 36th St — Walk to Class',
    description: 'Renovated unit on W 36th St, 8-10 minutes walking to USC. In-unit washer/dryer and monthly cleaning service included. Flexible 1-12 month leases.',
    address: '1297 W 36th St, Los Angeles, CA 90007',
    price: 2200, bedrooms: 1, bathrooms: 1, distanceToUSC: '0.3', availableDate: '2026-06-15',
    amenities: ['Washer/Dryer', 'Cleaning Service', 'Flexible Lease'],
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'],
  },
  {
    title: 'Figueroa Corridor — 3BR',
    description: 'Three-bedroom on Figueroa near Jefferson. Spacious layout perfect for a group of students. Close to Metro Expo Line and USC campus. Gated parking.',
    address: '2850 S Figueroa St, Los Angeles, CA 90007',
    price: 3800, bedrooms: 3, bathrooms: 2, distanceToUSC: '0.9', availableDate: '2026-08-15',
    amenities: ['Gated Parking', 'Metro Access', 'Laundry', 'Spacious'],
    images: ['https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&q=80'],
  },
  {
    title: 'Vermont Ave — Value 1BR',
    description: 'Affordable one-bedroom on Vermont Ave. Bright and airy with updated kitchen. Easy access to Vermont/Exposition Metro station. Budget-friendly.',
    address: '1050 W Vermont Ave, Los Angeles, CA 90044',
    price: 1350, bedrooms: 1, bathrooms: 1, distanceToUSC: '1.2', availableDate: '2026-06-01',
    amenities: ['Updated Kitchen', 'Metro Access', 'Laundry'],
    images: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80'],
  },
  {
    title: 'Hoover St — 4BR Student House',
    description: 'Four-bedroom student house on Hoover St. Large common area, backyard, and free street parking. Perfect for a group lease.',
    address: '3131 S Hoover St, Los Angeles, CA 90007',
    price: 4800, bedrooms: 4, bathrooms: 2, distanceToUSC: '0.4', availableDate: '2026-08-01',
    amenities: ['Backyard', 'Parking', 'Washer/Dryer', 'Spacious'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
  },
  {
    title: 'Menlo Ave — Quiet 2BR',
    description: 'Two-bedroom on a quiet stretch of Menlo Ave. Tree-lined street with easy walk to campus. Recently painted with new fixtures. Off-street parking.',
    address: '1234 W Menlo Ave, Los Angeles, CA 90006',
    price: 2400, bedrooms: 2, bathrooms: 1, distanceToUSC: '0.7', availableDate: '2026-07-15',
    amenities: ['Parking', 'Laundry', 'Recently Updated'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
  },
  {
    title: 'Portland St — Bright Studio',
    description: 'Sun-filled studio on Portland St near USC. Great natural light, modern bathroom, and kitchenette. Laundry on-site. Perfect for a solo student.',
    address: '2645 Portland St, Los Angeles, CA 90007',
    price: 1275, bedrooms: 0, bathrooms: 1, distanceToUSC: '0.5', availableDate: '2026-06-01',
    amenities: ['Laundry', 'Kitchenette', 'Natural Light'],
    images: ['https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80'],
  },
  {
    title: 'W 30th St — Renovated 2BR',
    description: 'Beautifully renovated two-bedroom near USC Village. Modern kitchen with quartz countertops, stainless steel appliances. Central AC and in-unit washer/dryer. Gated community.',
    address: '1150 W 30th St, Los Angeles, CA 90007',
    price: 3200, bedrooms: 2, bathrooms: 2, distanceToUSC: '0.3', availableDate: '2026-08-01',
    amenities: ['Renovated', 'Washer/Dryer', 'Central AC', 'Gated', 'Parking'],
    images: ['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80'],
  },
];

export default function AdminSeed() {
  const { houses, loading, error, addHouse, refetch } = useHouses();
  const { currentUser, isAdmin } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState(0);
  const [seedResults, setSeedResults] = useState<{ success: number; failed: number } | null>(null);

  useEffect(() => {
    if (houses) {
      setFilteredHouses(houses.filter(h => h.isActive !== false) as House[]);
    }
  }, [houses]);

  const handleFilterChange = (filters: FilterType) => {
    if (!houses) return;
    let filtered = [...houses].filter(h => h.isActive !== false) as House[];
    if (filters.searchTerm) {
      filtered = filtered.filter(h =>
        h.title?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        h.address?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    if (filters.minPrice) filtered = filtered.filter(h => h.price >= parseInt(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(h => h.price <= parseInt(filters.maxPrice));
    if (filters.bedrooms) filtered = filtered.filter(h => h.bedrooms >= parseInt(filters.bedrooms));
    if (filters.bathrooms) filtered = filtered.filter(h => h.bathrooms >= parseInt(filters.bathrooms));
    setFilteredHouses(filtered);
  };

  const handleSeed = async () => {
    if (!currentUser) return;
    setSeeding(true);
    setSeedProgress(0);
    setSeedResults(null);
    let success = 0;
    let failed = 0;

    for (let i = 0; i < SEED_LISTINGS.length; i++) {
      const listing = SEED_LISTINGS[i];
      try {
        await addHouse({
          ...listing,
          landlordContact: { name: 'Aarush Verulkar', email: 'verulkar@usc.edu', phone: '' },
          landlordId: currentUser.uid,
          isActive: true,
        });
        success++;
      } catch {
        failed++;
      }
      setSeedProgress(i + 1);
    }

    setSeedResults({ success, failed });
    setSeeding(false);
    refetch();
  };

  const handleToggleFavorite = async (houseId: string) => {
    try {
      await toggleFavorite(houseId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update favorites');
    }
  };

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Admin access required</h1>
          <p className="text-sm text-gray-500">Sign in with an admin account to access seeding tools.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-brand rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-gray-900">
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-brand text-sm font-medium mb-4">
              <Database className="w-3.5 h-3.5" />
              Admin — Seed Data
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Database Seeding</h1>
            <p className="text-gray-500 text-sm">{houses?.length || 0} properties currently in database</p>
          </div>

          <div className="rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Seed {SEED_LISTINGS.length} USC Listings</h2>
                <p className="text-sm text-gray-500 mt-1">Real off-campus properties near USC with addresses and pricing.</p>
              </div>
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-5 py-2.5 rounded-full bg-brand text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {seeding ? `Seeding... ${seedProgress}/${SEED_LISTINGS.length}` : 'Seed Now'}
              </button>
            </div>

            {seeding && (
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(seedProgress / SEED_LISTINGS.length) * 100}%` }}
                />
              </div>
            )}

            {seedResults && (
              <div className={`mt-4 flex items-center gap-2 text-sm ${seedResults.failed > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {seedResults.failed > 0 ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                {seedResults.success} added{seedResults.failed > 0 ? `, ${seedResults.failed} failed` : ' successfully'}
              </div>
            )}
          </div>

          <div className="mb-8">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>

          {filteredHouses.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">No properties yet</h2>
              <p className="text-sm text-gray-500">Hit "Seed Now" above to populate the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHouses.map((house) => (
                <HouseCard
                  key={house.id}
                  house={house}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite(house.id)}
                  showFavoriteButton={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
