import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        // Assuming the role is stored in 'role' or 'roles' inside the JWT payload
        // Adjust this according to your actual JWT structure
        const role = decoded.role || decoded.roles;

        // Check if role is ADMIN
        if (role !== 'ADMIN' && !role.includes('ADMIN')) {
            // Redirect to user dashboard or unauthorized page if not admin
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default AdminRoute;
