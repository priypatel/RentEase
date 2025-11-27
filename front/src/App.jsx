import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import "./index.css";

import DashboardLayout from "./components/layout/DashboardLayout";

// DASHBOARD PAGES
import TenantDashboardContent from "./pages/dashboard/TenantDashboardContent";
import LandlordDashboardContent from "./pages/dashboard/LandlordDashboardContent";

// COMMON PAGES
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import AddProperty from "./pages/AddProperty";
import MyProperties from "./pages/MyProperties";
import ProfilePage from "./pages/ProfilePage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import TenantPropertyDetails from "./pages/tenant/TenantPropertyDetails";
import ScrollToTop from "./components/ScrollToTop";
import RentalStatusPage from "./pages/tenant/RentalStatusPage";
import TenantPropertiesPage from "./pages/tenant/TenantPropertiesPage";
import Requests from "./pages/landlord/Requests";
import Deposits from "./pages/landlord/Deposits";
import TenantDepositPage from "./pages/tenant/TenantDepositPage";
import Payments from "./pages/tenant/Payments";
import PaymentHistory from "./pages/tenant/PaymentHistory";
import LandlordPropertyPayments from "./pages/landlord/LandlordPropertyPayments";
import LandlordPaymentHistory from "./pages/landlord/LandlordPaymentHistory";
import TenantsPage from "./pages/landlord/TenantsPage";
import AvailableProperties from "./pages/tenant/AvailableProperties";
import Home from "./pages/Home";

function App() {
  return (
    <div className="bg-app">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Password */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* ============================================
           UNIFIED LAYOUT FOR BOTH ROLES
        ============================================ */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Landlord Routes */}
            <Route
              path="landlord/dashboard"
              element={<LandlordDashboardContent />}
            />
            <Route path="landlord/profile" element={<ProfilePage />} />
            <Route
              path="landlord/property/:id"
              element={<PropertyDetailsPage />}
            />
            <Route path="/landlord/requests" element={<Requests />} />
            <Route path="/landlord/deposits" element={<Deposits />} />
            <Route
              path="/landlord/payments"
              element={<LandlordPropertyPayments />}
            />

            <Route
              path="/landlord/payments/:id"
              element={<LandlordPaymentHistory />}
            />
            <Route path="landlord/tenants" element={<TenantsPage />} />

            {/* Common / Shared Routes */}
            <Route path="my-properties" element={<MyProperties />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="edit-property/:id" element={<AddProperty />} />
          </Route>

          {/* Tenant Routes (NO DASHBOARD LAYOUT) */}

          <Route
            path="/tenant/available-properties"
            element={
              <ProtectedRoute>
                <AvailableProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/property/:id"
            element={
              <ProtectedRoute>
                <TenantPropertyDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/my-properties"
            element={
              <ProtectedRoute>
                <TenantPropertiesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/rental-status/:id"
            element={
              <ProtectedRoute>
                <RentalStatusPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/payments"
            element={
              <ProtectedRoute>
                <Payments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/payments/:id"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/deposit/:id"
            element={
              <ProtectedRoute>
                <TenantDepositPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tenant/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
