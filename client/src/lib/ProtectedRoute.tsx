// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from './auth.context';
// import LoadingSpinner from '../components/LoadingSpinner';

// interface ProtectedRouteProps {
//     children: JSX.Element;
//     requiredRoles?: string[];
// }

// export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
//     const { isAuthenticated, isLoading, hasAnyRole } = useAuth();
//     const location = useLocation();

//     if (isLoading) {
//         return <LoadingSpinner />;
//     }

//     if (!isAuthenticated) {
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }

//     if (requiredRoles && !hasAnyRole(requiredRoles)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
// };