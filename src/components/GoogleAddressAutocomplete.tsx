'use client';

import { useState, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

interface GoogleAddressAutocompleteProps {
    value: string;
    onChange: (address: string, coordinates?: [number, number]) => void;
    onValidation?: (isValid: boolean) => void;
    placeholder?: string;
    className?: string;
}

const USC_COORDS = { lat: 34.0224, lng: -118.2851 };
const MAX_DISTANCE_MILES = 15;

// LA area bounds
const LA_BOUNDS = {
    south: 33.7037,
    west: -118.6682,
    north: 34.3373,
    east: -117.9143
};

const LIBRARIES: ("places" | "geometry")[] = ['places', 'geometry'];

export default function GoogleAddressAutocomplete({
    value,
    onChange,
    onValidation,
    placeholder = 'Enter address near USC',
    className = ''
}: GoogleAddressAutocompleteProps) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries: LIBRARIES
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoaded || !inputRef.current) return;

        // Initialize Google Places Autocomplete
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
            bounds: new google.maps.LatLngBounds(
                new google.maps.LatLng(LA_BOUNDS.south, LA_BOUNDS.west),
                new google.maps.LatLng(LA_BOUNDS.north, LA_BOUNDS.east)
            ),
            strictBounds: true,
            types: ['address'],
            componentRestrictions: { country: 'us' },
            fields: ['formatted_address', 'geometry', 'name']
        });

        // Bias results towards USC
        autocomplete.setBounds(
            new google.maps.LatLngBounds(
                new google.maps.LatLng(USC_COORDS.lat - 0.1, USC_COORDS.lng - 0.1),
                new google.maps.LatLng(USC_COORDS.lat + 0.1, USC_COORDS.lng + 0.1)
            )
        );

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            if (!place.geometry || !place.geometry.location) {
                onValidation?.(false);
                return;
            }

            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Calculate distance from USC
            const distance = calculateDistance(USC_COORDS.lat, USC_COORDS.lng, lat, lng);

            if (distance > MAX_DISTANCE_MILES) {
                alert(`This address is ${distance.toFixed(1)} miles from USC. Please select an address within ${MAX_DISTANCE_MILES} miles.`);
                onValidation?.(false);
                return;
            }

            const address = place.formatted_address || place.name || '';
            onChange(address, [lng, lat]);
            onValidation?.(true);
        });

        autocompleteRef.current = autocomplete;

        return () => {
            if (autocompleteRef.current) {
                google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, [isLoaded, onChange, onValidation]);

    // Calculate distance between two coordinates in miles
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    if (!isLoaded) {
        return (
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    disabled
                    placeholder="Loading..."
                    className={`${className} opacity-50`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-brand rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={className}
                autoComplete="off"
            />
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-brand rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
