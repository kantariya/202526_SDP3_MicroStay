import { useState } from "react";
import api from "../../api";

export default function HotelImageUploader({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);

  async function upload(files) {
    const form = new FormData();
    [...files].forEach(f => form.append("files", f));

    setUploading(true);

    const res = await api.post(
      "/admin/upload/hotel-images",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    onChange([...value, ...res.data.urls]);
    setUploading(false);
  }

  function remove(url) {
    onChange(value.filter(i => i !== url));
  }

  return (
    <div className="space-y-3">

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={e => upload(e.target.files)}
      />

      {uploading && <p className="text-sm">Uploading...</p>}

      <div className="grid grid-cols-4 gap-3">
        {value.map(url => (
          <div key={url} className="relative">
            <img
              src={url}
              className="h-24 w-full object-cover rounded"
            />
            <button
              onClick={() => remove(url)}
              className="absolute top-1 right-1 bg-black text-white text-xs px-2 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
