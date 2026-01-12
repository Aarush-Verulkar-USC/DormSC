'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxWithRouteProps {
  address: string;
  onDistanceCalculated?: (distance: number) => void;
  className?: string;
  height?: string;
}

const USC_COORDS: [number, number] = [-118.2851, 34.0224];

export default function MapBoxWithRoute({
  address,
  onDistanceCalculated,
  className = '',
  height = 'h-96'
}: MapBoxWithRouteProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [routeData, setRouteData] = useState<any>(null);

  // Fetch route data
  const fetchRouteData = useCallback(async (propertyCoords: [number, number]) => {
    try {
      const directionsResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${USC_COORDS[0]},${USC_COORDS[1]};${propertyCoords[0]},${propertyCoords[1]}?geometries=geojson&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
      );

      if (!directionsResponse.ok) {
        console.error('Directions API error:', directionsResponse.status);
        return null;
      }

      const data = await directionsResponse.json();
      console.log('Directions data:', data);

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceInMiles = (route.distance * 0.000621371).toFixed(2);

        setDistance(parseFloat(distanceInMiles));
        if (onDistanceCalculated) {
          onDistanceCalculated(parseFloat(distanceInMiles));
        }

        return route;
      }

      return null;
    } catch (err) {
      console.error('Error fetching route:', err);
      return null;
    }
  }, [onDistanceCalculated]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      setError('Mapbox token not configured');
      setLoading(false);
      return;
    }

    if (!address || !address.trim()) {
      setLoading(false);
      return;
    }

    // Clean up previous map
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Geocode the property address
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
        );

        if (!geocodeResponse.ok) {
          throw new Error('Failed to geocode address');
        }

        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.features || geocodeData.features.length === 0) {
          setError('Address not found');
          setLoading(false);
          return;
        }

        const [propertyLng, propertyLat] = geocodeData.features[0].center;
        const propertyCoords: [number, number] = [propertyLng, propertyLat];

        // Fetch route data
        const route = await fetchRouteData(propertyCoords);
        setRouteData(route);

        // Initialize map
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

        map.current = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: propertyCoords,
          zoom: 12,
          attributionControl: false
        });

        // Add markers immediately
        new mapboxgl.Marker({ color: '#DC2626' })
          .setLngLat(USC_COORDS)
          .setPopup(new mapboxgl.Popup().setHTML('<div class="text-sm font-semibold">USC Campus</div>'))
          .addTo(map.current);

        new mapboxgl.Marker({ color: '#3B82F6' })
          .setLngLat(propertyCoords)
          .setPopup(new mapboxgl.Popup().setHTML('<div class="text-sm font-semibold">Property</div>'))
          .addTo(map.current);

        // Add route when map loads
        map.current.on('load', () => {
          if (!map.current || !route) return;

          console.log('Map loaded, adding route layer');

          try {
            // Add route source
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route.geometry
              }
            });

            // Add route layer (wider, semi-transparent)
            map.current.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3B82F6',
                'line-width': 6,
                'line-opacity': 0.6
              }
            });

            // Add route outline (thinner, brighter)
            map.current.addLayer({
              id: 'route-outline',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#60A5FA',
                'line-width': 3,
                'line-opacity': 1
              }
            });

            console.log('Route layers added successfully');
          } catch (err) {
            console.error('Error adding route layers:', err);
          }

          // Fit bounds to show everything
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(USC_COORDS);
          bounds.extend(propertyCoords);

          map.current!.fitBounds(bounds, {
            padding: { top: 80, bottom: 80, left: 80, right: 80 },
            maxZoom: 14
          });

          setLoading(false);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
        });

      } catch (err) {
        console.error('Map initialization error:', err);
        setError('Failed to load map');
        setLoading(false);
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [address, fetchRouteData]);

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

  if (!address || !address.trim()) {
    return (
      <div className={`${height} ${className} bg-gray-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-700`}>
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-sm font-medium">Enter an address to view map and route</p>
          <p className="text-xs mt-1">Distance will be calculated automatically</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${height} ${className} relative`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-300">Calculating route...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className={`w-full ${height} rounded-lg`} />

      {/* Legend and Distance */}
      <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-700">
        <div className="space-y-2">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-300">Property</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <span className="text-gray-300">USC</span>
            </div>
          </div>
          {distance !== null && (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-semibold text-white">{distance} miles</span>
                <span className="text-xs text-gray-400">driving</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
