import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Listing } from '../../types';

const USC = { lat: 34.0224, lng: -118.2851 };

interface HomeMapProps {
  listings: Listing[];
  className?: string;
}

function addFallbackTiles(map: L.Map): L.LayerGroup {
  return L.layerGroup([
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, OpenStreetMap contributors, and the GIS community',
        maxZoom: 19,
      }
    ),
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    ),
  ]).addTo(map);
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

    const accessToken = import.meta.env['VITE_MAPBOX_ACCESS_TOKEN']?.trim();
    if (accessToken) {
      const mapboxTiles = L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/512/{z}/{x}/{y}?access_token=${encodeURIComponent(accessToken)}`,
        {
          attribution:
            '&copy; <a href="https://www.mapbox.com/about/maps">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://apps.mapbox.com/feedback/" target="_blank" rel="noopener">Improve this map</a></strong>',
          maxZoom: 19,
          tileSize: 512,
          zoomOffset: -1,
        }
      ).addTo(map);

      const logo = new L.Control({ position: 'bottomleft' });
      logo.onAdd = () => {
        const link = L.DomUtil.create('a', 'mapboxgl-ctrl-logo');
        link.href = 'https://www.mapbox.com/';
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', 'Mapbox');
        return link;
      };
      logo.addTo(map);

      let fellBack = false;
      mapboxTiles.on('tileerror', () => {
        if (fellBack) return;
        fellBack = true;
        map.removeLayer(mapboxTiles);
        logo.remove();
        addFallbackTiles(map);
      });
    } else {
      addFallbackTiles(map);
    }

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
