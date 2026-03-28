import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HotelMap = ({ lat, lng, name }) => {
  if (!lat || !lng) return null;

  return (
    <div className="w-full h-64 rounded-2xl overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HotelMap;