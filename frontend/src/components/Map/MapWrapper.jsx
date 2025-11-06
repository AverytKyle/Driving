import MapWrapper from './Map';
import SearchBox from './SearchBox';
import MapDirections from './MapDirections';

export default function MapPage() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <SearchBox />
      <MapDirections />
      <MapWrapper />
    </div>
  );
}