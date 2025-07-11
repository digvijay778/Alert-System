// frontend/src/routes.jsx

import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"; // UNCOMMENTED
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} /> {/* UNCOMMENTED */}
      {/* Admin-Only Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {" "}
            {/* WRAP THE ADMIN PAGE */}
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      {/* Fallback Route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
