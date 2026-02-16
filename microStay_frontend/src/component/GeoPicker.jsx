import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

function MarkerPicker({ value, onChange }) {
  const [pos, setPos] = useState(value);

  useMapEvents({
    click(e) {
      const p = [e.latlng.lat, e.latlng.lng];
      setPos(p);
      onChange(p);
    }
  });

  if (!pos) return null;
  return <Marker position={pos} draggable
    eventHandlers={{
      dragend: (e) => {
        const m = e.target.getLatLng();
        onChange([m.lat, m.lng]);
      }
    }}
  />;
}

export default function GeoPicker({ value, onChange }) {
  const center = value || [23.0225, 72.5714]; // default Ahmedabad

  return (
    <div className="space-y-2">

      <MapContainer
        center={center}
        zoom={13}
        className="h-72 w-full rounded"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerPicker
          value={value}
          onChange={(latlng) => {
            onChange({
              type: "Point",
              coordinates: [latlng[1], latlng[0]] // lng, lat
            });
          }}
        />

      </MapContainer>

      {value && (
        <p className="text-sm">
          Lng: {value.coordinates[0].toFixed(5)} |
          Lat: {value.coordinates[1].toFixed(5)}
        </p>
      )}

    </div>
  );
}
