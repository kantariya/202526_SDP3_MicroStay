import { useEffect, useState } from "react";
import api from "../../api";
import HotelForm from "./HotelForm";
import HotelRow from "./HotelRow";

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHotels();
  }, []);

  async function loadHotels() {
    setLoading(true);
    const res = await api.get("/admin/hotels");
    setHotels(res.data);
    setLoading(false);
  }

  async function deleteHotel(id) {
    if (!confirm("Delete hotel?")) return;
    await api.delete(`/admin/hotels/${id}`);
    loadHotels();
  }

  async function toggleStatus(h) {
    const newStatus = h.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await api.patch(`/admin/hotels/${h.id}/status`, { status: newStatus });
    loadHotels();
  }

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Hotels</h1>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-black text-white rounded"
        >
          + Add Hotel
        </button>
      </div>

      <input
        placeholder="Search hotel..."
        className="border p-2 rounded w-64"
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-sm bg-white shadow rounded">

  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 text-left">Name</th>
      <th className="p-2">City</th>
      <th className="p-2">Stars</th>
      <th className="p-2">Status</th>
      <th className="p-2">Rooms</th>
      <th className="p-2">Actions</th>
    </tr>
  </thead>

  <tbody>
    {filtered.map(h => (
      <HotelRow
        key={h.id}
        hotel={h}
        onEdit={(hotel) => {
          setEditing(hotel);
          setShowForm(true);
        }}
        onDelete={deleteHotel}
        onToggleStatus={toggleStatus}
      />
    ))}
  </tbody>

</table>
      )}

      {showForm && (
        <HotelForm
          hotel={editing}
          onClose={() => setShowForm(false)}
          onSaved={loadHotels}
        />
      )}

    </div>
  );
}
