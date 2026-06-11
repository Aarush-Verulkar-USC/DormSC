import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '../../types';

const USC = { lat: 34.0224, lng: -118.2851 };

interface HomeMapProps {
  listings: Listing[];
  className?: string;
}

export default function HomeMap({ listings, className = '' }: HomeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const navigate = useNavigate();

  // Create the map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [USC.lat, USC.lng],
      zoom: 14,
      scrollWheelZoom: false, // don't hijack page scroll
      zoomControl: false,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    // USC campus marker
    L.marker([USC.lat, USC.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div class="usc-pin"><span class="usc-pin-dot"></span>USC</div>',
        iconSize: [54, 26],
        iconAnchor: [27, 13],
      }),
      zIndexOffset: 1000,
      keyboard: false,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Sync listing markers
  useEffect(() => {
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    const withCoords = listings.filter(
      (l): l is Listing & { latitude: number; longitude: number } =>
        typeof l.latitude === 'number' && typeof l.longitude === 'number'
    );

    withCoords.forEach(l => {
      const marker = L.marker([l.latitude, l.longitude], {
        icon: L.divIcon({
          className: '',
          html: `<div class="price-pin">$${l.price.toLocaleString()}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
      });
      marker.bindTooltip(
        `<div class="pin-tip"><strong>${l.title.replace(/</g, '&lt;')}</strong><br/>${l.bedrooms} bed · ${l.bathrooms} bath</div>`,
        { direction: 'top', offset: [24, -8], opacity: 1 }
      );
      marker.on('click', () => navigate(`/listings/${l._id}`));
      layer.addLayer(marker);
    });

    if (withCoords.length > 0) {
      const bounds = L.latLngBounds([
        [USC.lat, USC.lng],
        ...withCoords.map(l => [l.latitude, l.longitude] as [number, number]),
      ]);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    }
  }, [listings, navigate]);

  return <div ref={containerRef} className={className} aria-label="Map of listings near USC" />;
}
