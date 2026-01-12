'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxProps {
  address: string;
  className?: string;
  height?: string;
}

export default function MapBox({ address, className = '', height = 'h-64' }: MapBoxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      setError('Mapbox token not configured');
      setLoading(false);
      return;
    }

    if (map.current) return; // Initialize map only once

    // Geocode the address to get coordinates
    const geocodeAddress = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
        );
        
        if (!response.ok) {
          throw new Error('Failed to geocode address');
        }

        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          
          // Initialize map
          mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;
          
          map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: 15,
            attributionControl: false
          });

          // Add marker for property
          new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat([lng, lat])
            .addTo(map.current);

          // Add USC marker for reference
          const uscCoords: [number, number] = [-118.2851, 34.0224]; // USC coordinates
          new mapboxgl.Marker({ color: '#DC2626' })
            .setLngLat(uscCoords)
            .setPopup(new mapboxgl.Popup().setHTML('<div class="text-sm font-semibold">USC Campus</div>'))
            .addTo(map.current);

          // Fit map to show both markers
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend([lng, lat] as [number, number]);
          bounds.extend(uscCoords);
          
          map.current.fitBounds(bounds, {
            padding: 50,
            maxZoom: 15
          });

          setLoading(false);
        } else {
          setError('Address not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Failed to load map');
        setLoading(false);
      }
    };

    geocodeAddress();

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [address]);

  if (error) {
    return (
      <div className={`${height} ${className} bg-gray-800 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-300">
          <svg className="w-8 h-8 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">{error}</p>
          <p className="text-xs text-gray-400 mt-1">{address}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} ${className} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A29FF] mx-auto mb-2"></div>
            <p className="text-sm text-gray-300">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className={`w-full ${height} rounded-lg`} />
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-gray-800 rounded-lg shadow-md p-2 text-xs text-gray-300 border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#3A29FF] rounded-full mr-1"></div>
            <span className="text-gray-300">Property</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-1"></div>
            <span className="text-gray-300">USC</span>
          </div>
        </div>
      </div>
    </div>
  );
}