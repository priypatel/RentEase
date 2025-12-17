// routes.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// COMMON PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import ProfilePage from "./pages/ProfilePage";
import Todo from "./pages/Todo";

// LANDLORD
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandlordDashboardContent from "./pages/dashboard/LandlordDashboardContent";
import MyProperties from "./pages/MyProperties";
import AddProperty from "./pages/landlord/AddProperty";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import Requests from "./pages/landlord/Requests";
import Deposits from "./pages/landlord/Deposits";
import LandlordPropertyPayments from "./pages/landlord/LandlordPropertyPayments";
import LandlordPaymentHistory from "./pages/landlord/LandlordPaymentHistory";
import TenantsPage from "./pages/landlord/TenantsPage";

// TENANT
import AvailableProperties from "./pages/tenant/AvailableProperties";
import TenantPropertyDetails from "./pages/tenant/TenantPropertyDetails";
import TenantPropertiesPage from "./pages/tenant/TenantPropertiesPage";
import RentalStatusPage from "./pages/tenant/RentalStatusPage";
import Payments from "./pages/tenant/Payments";
import PaymentHistory from "./pages/tenant/PaymentHistory";
import TenantDepositPage from "./pages/tenant/TenantDepositPage";
import Tailwind from "./pages/Tailwind";
const appRoutes = [
  // Public
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/todo", element: <Todo /> },
  { path: "/tailwind", element: <Tailwind /> },

  // Landlord (Protected + Dashboard Layout)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "landlord/dashboard", element: <LandlordDashboardContent /> },
      { path: "landlord/profile", element: <ProfilePage /> },
      { path: "landlord/property/:id", element: <PropertyDetailsPage /> },
      { path: "landlord/requests", element: <Requests /> },
      { path: "landlord/deposits", element: <Deposits /> },
      { path: "landlord/payments", element: <LandlordPropertyPayments /> },
      { path: "landlord/payments/:id", element: <LandlordPaymentHistory /> },
      { path: "landlord/tenants", element: <TenantsPage /> },

      // Shared
      { path: "my-properties", element: <MyProperties /> },
      { path: "add-property", element: <AddProperty /> },
      { path: "edit-property/:id", element: <AddProperty /> },
    ],
  },

  // Tenant (No Dashboard Layout)
  { path: "/available-properties", element: <AvailableProperties /> },

  {
    path: "/tenant",
    children: [
      {
        path: "property/:id",
        element: (
          <ProtectedRoute>
            <TenantPropertyDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-properties",
        element: (
          <ProtectedRoute>
            <TenantPropertiesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "rental-status/:id",
        element: (
          <ProtectedRoute>
            <RentalStatusPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        ),
      },
      {
        path: "payments/:id",
        element: (
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "deposit/:id",
        element: (
          <ProtectedRoute>
            <TenantDepositPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },

  { path: "*", element: <Navigate to="/" /> },
];

export default appRoutes;
