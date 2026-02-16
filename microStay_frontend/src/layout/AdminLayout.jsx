import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      <div className="w-64 bg-gray-900 text-white p-5 space-y-3">
        <h2 className="text-xl font-bold">Hotel Admin</h2>

        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/hotels">Hotels</Link>
        <Link to="/admin/rooms">Rooms</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/reports">Reports</Link>
      </div>

      <div className="flex-1 bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
}
