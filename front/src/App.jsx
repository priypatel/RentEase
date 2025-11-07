import Login from "./pages/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Register from "./Pages/Register";
import "./index.css";
import TenantDashboard from "./pages/TenantDashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/landlord/dashboard"
          element={
            <ProtectedRoute>
              <LandlordDashboard />
            </ProtectedRoute>
          }
        />
        {/* //  <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
