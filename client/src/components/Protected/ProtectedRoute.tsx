import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRoles } from '@/redux/slices/authSlice';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
    requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRoles = [],
    requireAuth = true,
}) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userRoles = useSelector(selectUserRoles);
    const location = useLocation();

    // Check if authentication is required and user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if specific roles are required
    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

// Admin only route
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProtectedRoute requiredRoles={['admin']}>
            {children}
        </ProtectedRoute>
    );
};

// EA only route
export const EARoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProtectedRoute requiredRoles={['ea']}>
            {children}
        </ProtectedRoute>
    );
};

// Admin or EA route
export const AdminOrEARoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProtectedRoute requiredRoles={['admin', 'ea']}>
            {children}
        </ProtectedRoute>
    );
};

// Hook for checking permissions
export const usePermissions = () => {
    const userRoles = useSelector(selectUserRoles);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    return {
        isAuthenticated,
        isAdmin: userRoles.includes('admin'),
        isEA: userRoles.includes('ea'),
        hasRole: (role: string) => userRoles.includes(role),
        hasAnyRole: (roles: string[]) => roles.some(role => userRoles.includes(role)),
        userRoles,
    };
};