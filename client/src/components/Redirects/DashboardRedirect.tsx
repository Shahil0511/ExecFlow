import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '@/components/Protected/ProtectedRoute';

export const DashboardRedirect = () => {
    console.log('🧭 DashboardRedirect file loaded');
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin, isEA, userRoles } = usePermissions();



    useEffect(() => {
        if (!isAuthenticated) {
            console.log("⛔ Not authenticated — navigating to /login");
            navigate('/login');
        } else if (userRoles.length === 0) {
            console.log("⏳ Waiting for roles to load...");
            return;
        } else if (isAdmin) {
            console.log("✅ Is Admin — navigating to /admin-dashboard");
            navigate('/admin-dashboard');
        } else if (isEA) {
            console.log("✅ Is EA — navigating to /ea-dashboard");
            navigate('/ea-dashboard');
        } else {
            console.log("❌ No matching role — navigating to /error");
            navigate('/error');
        }
    }, [isAuthenticated, userRoles, isAdmin, isEA, navigate]);


    return null;
};
