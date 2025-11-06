export function createAdvancedMarker(map, maps, position, options = {}) {
  const AdvancedMarker = maps?.marker?.AdvancedMarkerElement || window.google?.maps?.marker?.AdvancedMarkerElement;

  // If AdvancedMarker isn't available, fall back to classic Marker
  if (!AdvancedMarker) {
    const fallback = new maps.Marker({
      position,
      map,
      title: options.title || '',
      icon: options.icon || undefined,
    });
    return {
      marker: fallback,
      setPosition: (p) => fallback.setPosition(p),
      remove: () => fallback.setMap(null),
    };
  }
  
  const el = document.createElement('div');
  el.className = 'adv-marker-root';
  el.innerHTML = `
    <div class="adv-marker-pin">
      <div class="adv-marker-pulse"></div>
      ${options.avatar ? `<img class="adv-marker-avatar" src="${options.avatar}" alt="marker avatar" />` : `<div class="adv-marker-dot"></div>`}
    </div>
    ${options.label ? `<div class="adv-marker-label">${options.label}</div>` : ''}
  `;

  const marker = new AdvancedMarker({
    position,
    map,
    title: options.title || '',
    content: el,
  });

  return {
    marker,
    setPosition: (p) => {
      try { marker.position = p; }
      catch (e) { marker.setPosition ? marker.setPosition(p) : (marker.position = p); }
    },
    remove: () => {
      if (marker.map) marker.map = null;
      if (marker.setMap) marker.setMap(null);
      if (marker.element && marker.element.remove) marker.element.remove();
    }
  };
}