import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";

import TenantDashboard from "./pages/TenantDashboard";
import TenantLayout from "./components/layout/TenantLayout";
import LandlordDashboard from "./pages/LandlordDashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* =============== TENANT ROUTES =============== */}
        <Route
          path="/tenant"
          element={
            <ProtectedRoute>
              <TenantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TenantDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* =============== LANDLORD ROUTES =============== */}
        <Route
          path="/landlord"
          element={
            <ProtectedRoute>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<LandlordDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* =============== PROPERTY ROUTES =============== */}
        <Route
          path="/my-properties"
          element={
            <ProtectedRoute>
              <MyProperties />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-property"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-property/:id"
          element={
            <ProtectedRoute>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        {/* Password */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
