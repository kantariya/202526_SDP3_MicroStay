import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import HotelImageUploader from "../hotels/HotelImageUploader";

export default function HotelRooms() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get(`/admin/hotels/${id}`);
    setHotel(res.data);
  }

  function setRoom(i, path, value) {
    setHotel(prev => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let cur = copy.rooms[i];

      keys.slice(0, -1).forEach(k => {
        if (!cur[k]) cur[k] = {};
        cur = cur[k];
      });

      cur[keys.at(-1)] = value;
      return copy;
    });
  }

  function addRoom() {
    setHotel(prev => ({
      ...prev,
      rooms: [
        ...(prev.rooms || []),
        {
          roomId: "",
          roomType: "STANDARD",
          description: "",
          maxAdults: 2,
          maxChildren: 0,
          pricing: {
            basePrice: 0,
            currency: "INR",
            weekendMultiplier: 1.2
          },
          inventory: { totalRooms: 1 },
          amenities: [],
          images: [],
          availability: [],
          active: true
        }
      ]
    }));
  }

  function removeRoom(i) {
    setHotel(prev => {
      const copy = structuredClone(prev);
      copy.rooms.splice(i, 1);
      return copy;
    });
  }

  async function save() {
    await api.put(`/admin/hotels/${id}`, hotel);
    alert("Rooms saved");
  }

  if (!hotel) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Room Management — {hotel.name}
      </h1>

      <button
        onClick={addRoom}
        className="px-4 py-2 bg-black text-white rounded"
      >
        + Add Room Type
      </button>

      {hotel.rooms?.map((r, i) => (
        <div key={i} className="bg-white p-5 rounded shadow space-y-4">

          <div className="grid grid-cols-3 gap-3">

            <Input label="Room ID"
              v={r.roomId}
              f={v => setRoom(i, "roomId", v)} />

            <Select label="Room Type"
              v={r.roomType}
              f={v => setRoom(i, "roomType", v)}
              opts={["STANDARD","DELUXE","SUITE"]} />

            <Check label="Active"
              v={r.active}
              f={v => setRoom(i, "active", v)} />

            <Input label="Max Adults"
              type="number"
              v={r.maxAdults}
              f={v => setRoom(i, "maxAdults", +v)} />

            <Input label="Max Children"
              type="number"
              v={r.maxChildren}
              f={v => setRoom(i, "maxChildren", +v)} />

          </div>

          <Textarea label="Description"
            v={r.description}
            f={v => setRoom(i, "description", v)} />

          {/* PRICING */}
          <Section title="Pricing">

            <Input label="Base Price"
              type="number"
              v={r.pricing?.basePrice}
              f={v => setRoom(i, "pricing.basePrice", +v)} />

            <Input label="Currency"
              v={r.pricing?.currency}
              f={v => setRoom(i, "pricing.currency", v)} />

            <Input label="Weekend Multiplier"
              type="number"
              v={r.pricing?.weekendMultiplier}
              f={v => setRoom(i, "pricing.weekendMultiplier", +v)} />

          </Section>

          {/* INVENTORY */}
          <Section title="Inventory">
            <Input label="Total Rooms"
              type="number"
              v={r.inventory?.totalRooms}
              f={v => setRoom(i, "inventory.totalRooms", +v)} />
          </Section>

          {/* AMENITIES */}
          <AmenityEditor
            value={r.amenities}
            onChange={a => setRoom(i, "amenities", a)}
          />

          {/* IMAGES */}
          <HotelImageUploader
            value={r.images}
            onChange={imgs => setRoom(i, "images", imgs)}
          />

          <button
            onClick={() => removeRoom(i)}
            className="border px-3 py-1 rounded text-red-600"
          >
            Remove Room
          </button>

        </div>
      ))}

      <button
        onClick={save}
        className="px-6 py-3 bg-green-600 text-white rounded"
      >
        Save All Rooms
      </button>

    </div>
  );
}






/* ---------- UI Helpers ---------- */

function Input({ label, v, f, type="text" }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input type={type} value={v || ""}
        onChange={e => f(e.target.value)}
        className="border p-2 rounded w-full"/>
    </div>
  );
}

function Textarea({ label, v, f }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea value={v || ""}
        onChange={e => f(e.target.value)}
        className="border p-2 rounded w-full"/>
    </div>
  );
}

function Select({ label, v, f, opts }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select value={v}
        onChange={e => f(e.target.value)}
        className="border p-2 rounded w-full">
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Check({ label, v, f }) {
  return (
    <label className="flex gap-2 items-center">
      <input type="checkbox"
        checked={v}
        onChange={e => f(e.target.checked)} />
      {label}
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="border rounded p-3 space-y-2">
      <h4 className="font-semibold">{title}</h4>
      {children}
    </div>
  );
}

function AmenityEditor({ value=[], onChange }) {
  const [val,setVal] = useState("");
  return (
    <div>
      <label className="text-sm">Amenities</label>
      <div className="flex gap-2">
        <input value={val}
          onChange={e=>setVal(e.target.value)}
          className="border p-2 rounded flex-1"/>
        <button onClick={()=>{
          onChange([...value,val]);
          setVal("");
        }} className="border px-3 rounded">Add</button>
      </div>

      <div className="flex gap-2 flex-wrap mt-2">
        {value.map(a=>(
          <span key={a}
            onClick={()=>onChange(value.filter(x=>x!==a))}
            className="bg-gray-100 px-3 py-1 rounded text-sm cursor-pointer">
            {a} ✕
          </span>
        ))}
      </div>
    </div>
  );
}
