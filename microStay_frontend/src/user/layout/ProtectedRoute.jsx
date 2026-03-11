import { Navigate, Outlet } from "react-router-dom";

// 1. For pages like Dashboard, Profile, etc.
export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // If no token exists, redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

// 2. For pages like Login and Register
export const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // If token exists, redirect to dashboard (or home)
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export const ProtectedAdminRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const { role } = JSON.parse(atob(token.split(".")[1]));

    if (role !== "ADMIN") {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
  } catch {
    return <Navigate to="/login" replace />;
  }
};