import { useEffect, useRef, useState } from "react";

function loadGoogleMaps(apiKey) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window is not available'));

  // If API already present, immediately resolve
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);

  // Reuse a single promise so multiple callers wait for the same load
  if (window.__googleMapsPromise) return window.__googleMapsPromise;

  if (!apiKey) return Promise.reject(new Error('Missing Google Maps API key'));

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    // If a script tag was already injected, attach listeners instead of injecting again
    const existing = document.querySelector('script[data-google-maps-loader]');
    if (existing) {
      existing.addEventListener('load', () => {
        if (window.google && window.google.maps) resolve(window.google.maps);
        else reject(new Error('Google Maps loaded but API not found'));
      }, { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')), { once: true });
      return;
    }

    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    s.async = true;
    s.defer = true;
    s.setAttribute('data-google-maps-loader', 'true');

    s.onload = () => {
      if (window.google && window.google.maps) resolve(window.google.maps);
      else reject(new Error('Google Maps script loaded but API unavailable'));
    };
    s.onerror = () => reject(new Error('Failed to load Google Maps script'));

    document.head.appendChild(s);
  });

  return window.__googleMapsPromise;
}

export default function MapLoader({ center = { lat: 37.7749, lng: -122.4194 }, zoom = 12, options = {}, onMapLoad }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      const msg = 'Missing API key: set VITE_GOOGLE_MAPS_API_KEY in your frontend/.env (Vite env var)';
      console.error(msg);
      setError(msg);
      return () => { mounted = false; };
    }

    loadGoogleMaps(apiKey)
      .then((maps) => {
        if (!mounted || !containerRef.current) return;
        if (!mapRef.current) {
          mapRef.current = new maps.Map(containerRef.current, {
            center,
            zoom,
            ...options,
          });
          if (typeof onMapLoad === 'function') onMapLoad(mapRef.current, maps);
        } else {
          mapRef.current.setCenter(center);
          mapRef.current.setZoom(zoom);
        }
      })
      .catch((err) => {
        console.error('Google Maps failed to load:', err);
        if (mounted) setError(err.message || String(err));
      });

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center?.lat, center?.lng, zoom, JSON.stringify(options)]);

  return (
    <div style={{ width: '300px', height: '300px' }} ref={containerRef} data-testid="google-map-container">
      {error && <div style={{ color: 'red', padding: 8 }}>Google Maps error: {error}</div>}
    </div>
  );
}