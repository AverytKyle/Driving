import { useEffect, useRef, useState } from 'react';

export default function MapDirections() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('DRIVING'); // DRIVING, WALKING, BICYCLING, TRANSIT
  const serviceRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    // wait for Maps JS to be ready and for your map to be exposed (window.__DRIVING_MAP)
    if (!window.google || !window.google.maps) return;
    if (!window.__DRIVING_MAP) return;

    if (!serviceRef.current) serviceRef.current = new window.google.maps.DirectionsService();
    if (!rendererRef.current) {
      rendererRef.current = new window.google.maps.DirectionsRenderer({
        map: window.__DRIVING_MAP,
        suppressMarkers: false, // set true to place custom markers instead
      });
      // Optionally attach textual panel
      const panel = document.getElementById('directions-panel');
      if (panel) rendererRef.current.setPanel(panel);
    }
  }, []);

  const calculateRoute = () => {
    if (!serviceRef.current) { alert('Maps not ready'); return; }
    serviceRef.current.route({
      origin,
      destination,
      travelMode: window.google.maps.TravelMode[mode],
      // optional: avoidTolls: true, provideRouteAlternatives: false, optimizeWaypoints: true
    }, (result, status) => {
      if (status === 'OK') {
        rendererRef.current.setDirections(result);
        // Access result.routes[0].legs to show distance/time in UI
      } else {
        alert('Directions failed: ' + status);
      }
    });
  };

  const clear = () => {
    if (rendererRef.current) rendererRef.current.set('directions', null);
  };

  return (
    <div style={{ position: 'absolute', right: 12, top: 12, zIndex: 1000, background: 'white', padding: 8 }}>
      <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Origin (address or lat,lng)" />
      <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="Destination" />
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="BICYCLING">Bicycling</option>
        <option value="TRANSIT">Transit</option>
      </select>
      <button onClick={calculateRoute}>Go</button>
      <button onClick={clear}>Clear</button>
      {/* optional textual directions container */}
      <div id="directions-panel" style={{ maxHeight: 300, overflow: 'auto' }} />
    </div>
  );
}