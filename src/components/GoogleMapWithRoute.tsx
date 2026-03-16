'use client';

import { useEffect, useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

interface GoogleMapWithRouteProps {
    address: string;
    coordinates?: [number, number]; // [lng, lat]
    onDistanceCalculated?: (distance: number) => void;
    onAddressValidation?: (isValid: boolean) => void;
    className?: string;
    height?: string;
}

const USC_COORDS = { lat: 34.0224, lng: -118.2851 };

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        },
        {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9d7ec' }]
        },
        {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f0f0f0' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }]
        },
        {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e0e0e0' }]
        },
        {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#f5d6a8' }]
        },
        {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#d4eac7' }]
        }
    ]
};

export default function GoogleMapWithRoute({
    address,
    coordinates,
    onDistanceCalculated,
    onAddressValidation,
    className = '',
    height = 'h-96'
}: GoogleMapWithRouteProps) {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: ['places', 'geometry']
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [propertyLocation, setPropertyLocation] = useState<google.maps.LatLngLiteral | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Geocode address and calculate route
    useEffect(() => {
        if (!isLoaded || !address || !address.trim()) {
            setLoading(false);
            return;
        }

        const geocodeAndRoute = async () => {
            try {
                setLoading(true);
                setError(null);

                let location: google.maps.LatLngLiteral;

                // Use provided coordinates if available
                if (coordinates) {
                    location = { lat: coordinates[1], lng: coordinates[0] };
                } else {
                    // Geocode the address
                    const geocoder = new google.maps.Geocoder();
                    const result = await geocoder.geocode({ address });

                    if (!result.results || result.results.length === 0) {
                        setError('Address not found');
                        onAddressValidation?.(false);
                        setLoading(false);
                        return;
                    }

                    location = result.results[0].geometry.location.toJSON();
                }

                setPropertyLocation(location);
                onAddressValidation?.(true);

                // Calculate route
                const directionsService = new google.maps.DirectionsService();
                const directionsResult = await directionsService.route({
                    origin: USC_COORDS,
                    destination: location,
                    travelMode: google.maps.TravelMode.DRIVING
                });

                setDirections(directionsResult);

                // Calculate distance
                if (directionsResult.routes && directionsResult.routes.length > 0) {
                    const route = directionsResult.routes[0];
                    if (route.legs && route.legs.length > 0) {
                        const distanceInMeters = route.legs[0].distance?.value || 0;
                        const distanceInMiles = (distanceInMeters * 0.000621371);
                        setDistance(parseFloat(distanceInMiles.toFixed(2)));
                        onDistanceCalculated?.(parseFloat(distanceInMiles.toFixed(2)));
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error geocoding or routing:', err);
                setError('Failed to load map');
                setLoading(false);
                onAddressValidation?.(false);
            }
        };

        geocodeAndRoute();
    }, [isLoaded, address, coordinates, onDistanceCalculated, onAddressValidation]);

    if (loadError) {
        return (
            <div className={`${height} ${className} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center`}>
                <div className="text-center text-gray-600">
                    <p className="text-sm">Failed to load Google Maps</p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className={`${height} ${className} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${height} ${className} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center`}>
                <div className="text-center text-gray-600">
                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm">{error}</p>
                    <p className="text-xs text-gray-500 mt-1">{address}</p>
                </div>
            </div>
        );
    }

    if (!address || !address.trim()) {
        return (
            <div className={`${height} ${className} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed`}>
                <div className="text-center text-gray-500">
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
        <div className={`${height} ${className} relative rounded-lg overflow-hidden`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-900/80 rounded-lg flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-2"></div>
                        <p className="text-sm text-gray-300">Calculating route...</p>
                    </div>
                </div>
            )}

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={propertyLocation || USC_COORDS}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={mapOptions}
            >
                {/* USC Marker */}
                <Marker
                    position={USC_COORDS}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#DC2626',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                    }}
                    title="USC Campus"
                />

                {/* Property Marker */}
                {propertyLocation && (
                    <Marker
                        position={propertyLocation}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#2845D6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2
                        }}
                        title="Property"
                    />
                )}

                {/* Route */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: '#2845D6',
                                strokeWeight: 4,
                                strokeOpacity: 0.8
                            }
                        }}
                    />
                )}
            </GoogleMap>

            {/* Distance Display */}
            {distance !== null && (
                <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-xs">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-brand rounded-full mr-2"></div>
                                <span className="text-gray-300">Property</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                                <span className="text-gray-300">USC</span>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                <span className="text-sm font-semibold text-white">{distance} miles</span>
                                <span className="text-xs text-gray-400">driving</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
