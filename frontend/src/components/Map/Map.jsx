import MapLoader from "./MapLoader";

function MapWrapper() {
    return (
    <div style={{ width: 800, height: 600 }}>
      <MapLoader
        center={{ lat: 40.7128, lng: -74.0060 }}
        zoom={13}
        onMapLoad={(map, maps) => {
          // optional: store map, add markers, etc.
        }}
      />
    </div>
  );
}

export default MapWrapper;