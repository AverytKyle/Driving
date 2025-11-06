import { useEffect, useRef } from 'react';

function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Wait until Google Maps has loaded and window.google is available
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      // optional: restrict types or componentRestrictions
      // types: ['(cities)'],
    });

    const marker = new window.google.maps.Marker({
      map: window.__DRIVING_MAP || null,
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert('No details available for selected place');
        return;
      }
      const loc = place.geometry.location;
      // center the exposed map
      if (window.__DRIVING_MAP) {
        window.__DRIVING_MAP.panTo(loc);
        window.__DRIVING_MAP.setZoom(15);
      } 
    //   else {
    //     // fallback: open the coords in Google Maps in a new tab
    //     window.open(`https://www.google.com/maps/@${loc.lat()},${loc.lng()},15z`, '_blank');
    //   }
      // move the marker
      marker.setPosition(loc);
      marker.setMap(window.__DRIVING_MAP);
    });

    return () => {
      if (autocomplete) window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  return (
    <div >
      <input
        ref={inputRef}
        placeholder="Search places..."
        style={{ width: 260, padding: '8px 10px', borderRadius: 4 }}
      />
    </div>
  );
}

export default SearchBox;