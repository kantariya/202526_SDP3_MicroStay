import { useState } from "react";
import api from "../../api";
import HotelImageUploader from "./HotelImageUploader";
import GeoPicker from "./GeoPicker";

export default function HotelForm({ hotel, onClose, onSaved }) {

  const [form, setForm] = useState(
    hotel || {
      name: "",
      brand: "",
      description: "",
      starRating: 3,
      status: "ACTIVE",
      checkInTime: "14:00",
      checkOutTime: "11:00",
      facilities: [],
      images: [],
      location: {
        city: "",
        address: "",
        state: "",
        country: "",
        pincode: "",
        geo: null
      },
      contact: { phone: "", email: "" },
      policies: {
        cancellation: "",
        petsAllowed: false,
        smokingAllowed: false
      }
    }
  );

  // safer nested setter
  function set(path, value) {
    setForm(prev => {
      const copy = structuredClone(prev);
      const keys = path.split(".");
      let cur = copy;
      keys.slice(0, -1).forEach(k => {
        if (!cur[k]) cur[k] = {};
        cur = cur[k];
      });
      cur[keys.at(-1)] = value;
      return copy;
    });
  }

  function addFacility(f) {
    if (!f || form.facilities.includes(f)) return;
    set("facilities", [...form.facilities, f]);
  }

  function removeFacility(f) {
    set("facilities", form.facilities.filter(x => x !== f));
  }

  async function save() {
    if (hotel)
      await api.put(`/admin/hotels/${hotel.id}`, form);
    else
      await api.post("/admin/hotels", form);

    onSaved();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 w-[900px] rounded space-y-4 max-h-[90vh] overflow-y-auto">

        <h2 className="text-xl font-bold">
          {hotel ? "Edit Hotel" : "Add Hotel"}
        </h2>

        {/* BASIC INFO */}
        <Section title="Basic Info">

          <Input label="Name"
            value={form.name}
            onChange={v => set("name", v)} />

          <Input label="Brand"
            value={form.brand}
            onChange={v => set("brand", v)} />

          <Textarea label="Description"
            value={form.description}
            onChange={v => set("description", v)} />

          <Input label="Star Rating"
            type="number"
            value={form.starRating}
            onChange={v => set("starRating", +v)} />

        </Section>

        {/* LOCATION */}
        <Section title="Location">

          <Input label="City"
            value={form.location.city}
            onChange={v => set("location.city", v)} />

          <Input label="Address"
            value={form.location.address}
            onChange={v => set("location.address", v)} />

          <Input label="State"
            value={form.location.state}
            onChange={v => set("location.state", v)} />

          <Input label="Country"
            value={form.location.country}
            onChange={v => set("location.country", v)} />

          <Input label="Pincode"
            value={form.location.pincode}
            onChange={v => set("location.pincode", v)} />

          <GeoPicker
            value={form.location.geo}
            onChange={(geo) => set("location.geo", geo)}
          />

        </Section>

        {/* CONTACT */}
        <Section title="Contact">

          <Input label="Phone"
            value={form.contact.phone}
            onChange={v => set("contact.phone", v)} />

          <Input label="Email"
            value={form.contact.email}
            onChange={v => set("contact.email", v)} />

        </Section>

        {/* POLICIES */}
        <Section title="Policies">

          <Input label="Cancellation Policy"
            value={form.policies.cancellation}
            onChange={v => set("policies.cancellation", v)} />

          <Check
            label="Pets Allowed"
            checked={form.policies.petsAllowed}
            onChange={v => set("policies.petsAllowed", v)}
          />

          <Check
            label="Smoking Allowed"
            checked={form.policies.smokingAllowed}
            onChange={v => set("policies.smokingAllowed", v)}
          />

        </Section>

        {/* FACILITIES */}
        <Section title="Facilities">

          <FacilityInput onAdd={addFacility} />

          <div className="flex gap-2 flex-wrap">
            {form.facilities.map(f => (
              <span key={f}
                className="px-3 py-1 bg-gray-100 rounded text-sm cursor-pointer"
                onClick={() => removeFacility(f)}
              >
                {f} ✕
              </span>
            ))}
          </div>

        </Section>

        {/* IMAGES */}
        <Section title="Images">

          <HotelImageUploader
            value={form.images}
            onChange={(imgs) => set("images", imgs)}
          />

        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">

          <button onClick={onClose}
            className="border px-4 py-2 rounded">
            Cancel
          </button>

          <button onClick={save}
            className="bg-black text-white px-6 py-2 rounded">
            Save Hotel
          </button>

        </div>

      </div>
    </div>
  );
}






/* ---------- Small UI Helpers ---------- */

function Section({ title, children }) {
  return (
    <div className="space-y-3 border rounded p-4">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className="border p-2 rounded w-full"
      />
    </div>
  );
}

function Check({ label, checked, onChange }) {
  return (
    <label className="flex gap-2 items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function FacilityInput({ onAdd }) {
  const [val, setVal] = useState("");

  return (
    <div className="flex gap-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        className="border p-2 rounded flex-1"
        placeholder="Add facility"
      />
      <button
        onClick={() => {
          onAdd(val.trim());
          setVal("");
        }}
        className="border px-4 rounded"
      >
        Add
      </button>
    </div>
  );
}
