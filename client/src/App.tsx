
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Hero from "./page/Hero";
import { AdminDashboard } from "./page/AdminDashboard";
// import { EADashboard } from "./page/EADashboard";
import { ProtectedRoute } from "@/components/Protected/ProtectedRoute";
import { DashboardRedirect } from '@/components/Redirects/DashboardRedirect';

import UnauthorizedPage from "./page/UnAuthorizedPage";


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Hero />} />

          {/* Protected Role-Based Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* EA Dashboard - Uncomment when available */}
          {/* <Route
            path="/ea-dashboard"
            element={
              <ProtectedRoute requiredRoles={['ea']}>
                <EADashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Unauthorized and 404 Fallback */}
          <Route path="/error" element={<UnauthorizedPage />} />
          <Route path="*" element={<Hero />} />
        </Routes>

      </BrowserRouter>
    </Provider>
  );
}

export default App;