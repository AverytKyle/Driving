import { useEffect, useState, useRef } from "react";
import MapLoader from "./MapLoader";
import { createAdvancedMarker } from "./AdvancedMapMarker";
import "./Map.css"

function MapWrapper() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const zoomListenerRef = useRef(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        setLocationError("Unable to retrieve your location.");
      }
    );
  }, []);

  // helper: returns a google maps Icon object using an SVG data URL sized for zoom
  const makeSvgIcon = (maps, zoom) => {
    // tune the base and scale factor to taste
    const base = 8;
    const size = Math.max(12, Math.round(base + zoom * 2)); // px
    const radius = Math.round(size / 2);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <circle cx='${radius}' cy='${radius - 2}' r='${radius - 4}' fill='#1976D2' stroke='#000000ff' stroke-width='2'/>
      </svg>`;
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new maps.Size(size, size),
      anchor: new maps.Point(Math.round(size / 2), size) // bottom-center anchor
    };
  };

  const handleMapLoad = (map, maps) => {
    // keep refs so other effects can use them
    mapRef.current = map;
    mapsRef.current = maps;

    // create marker if we already have userLocation
    if (userLocation) {
      if (!markerRef.current) {
        markerRef.current = new maps.Marker({
          position: userLocation,
          map,
          title: "You are here",
          icon: makeSvgIcon(maps, map.getZoom() ?? 13)
        });
      } else {
        markerRef.current.setPosition(userLocation);
      }
      map.setCenter(userLocation);
    }

    // add zoom listener once
    if (!zoomListenerRef.current) {
      zoomListenerRef.current = map.addListener('zoom_changed', () => {
        const z = map.getZoom();
        if (markerRef.current && mapsRef.current) {
          markerRef.current.setIcon(makeSvgIcon(mapsRef.current, z));
        }
      });
    }
  };

  useEffect(() => {
    // Wait until map is loaded (mapRef/mapsRef populated by handleMapLoad)
    if (!mapRef.current || !mapsRef.current) return;
    if (!userLocation) return;

    const maps = mapsRef.current;
    const map = mapRef.current;

    if (!markerRef.current) {
      markerRef.current = new maps.Marker({
        position: userLocation,
        map,
        title: "You are here",
        icon: makeSvgIcon(maps, map.getZoom() ?? 13)
      });
    } else {
      markerRef.current.setPosition(userLocation);
    }
    map.setCenter(userLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation?.lat, userLocation?.lng]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (zoomListenerRef.current) {
        // google maps listeners return an object with remove()
        try { zoomListenerRef.current.remove(); } catch (e) { /* ignore */ }
        zoomListenerRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="map-search-container">
        <div className="map-loader">
          <MapLoader
            center={userLocation}
            zoom={13}
            options={{ mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID }}
            onMapLoad={handleMapLoad}
          />
        </div>
      </div>
    </>
  );
}

export default MapWrapper;