import { Link } from "react-router-dom";

export default function HotelRow({
  hotel,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  return (
    <tr className="border-t hover:bg-gray-50">

      <td className="p-2">{hotel.name}</td>

      <td className="p-2">
        {hotel.location?.city || "-"}
      </td>

      <td className="p-2">
        ⭐ {hotel.starRating || 0}
      </td>

      <td className="p-2">
        <button
          onClick={() => onToggleStatus(hotel)}
          className={`px-2 py-1 border rounded text-xs
            ${hotel.status === "ACTIVE"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-600"
            }`}
        >
          {hotel.status}
        </button>
      </td>

      <td className="p-2">
        {hotel.rooms?.length || 0}
      </td>

      <td className="p-2 space-x-2">

        <button
          onClick={() => onEdit(hotel)}
          className="border px-2 py-1 rounded"
        >
          Edit
        </button>

        <Link
          to={`/admin/hotels/${hotel.id}/rooms`}
          className="border px-2 py-1 rounded"
        >
          Rooms
        </Link>

        <button
          onClick={() => onDelete(hotel.id)}
          className="border px-2 py-1 rounded text-red-600"
        >
          Delete
        </button>

      </td>

    </tr>
  );
}
