import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ManagerRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.roles;

        // Allow access if role is HOTEL_MANAGER or ADMIN
        if ((role !== 'HOTEL_MANAGER' && role !== 'ADMIN') && (!role.includes('HOTEL_MANAGER') && !role.includes('ADMIN'))) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ManagerRoute;
