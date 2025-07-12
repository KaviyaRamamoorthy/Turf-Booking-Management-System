import React from "react";
import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import { persistor, store } from "./store";

// Import PrimeReact CSS
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

// Import page components
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import HomePage from "./pages/HomePage";
import TurfManagementContainer from "./components/admin/TurfManagementContainer";
import TurfBookingsContainer from "./components/admin/TurfBookingsContainer";
import MyBookingsPage from "./pages/MyBookingsPage";

// Placeholder pages (to be created later)
const TurfsPage = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Turfs</h1>
    <p className="text-gray-600">Turf listing coming soon...</p>
  </div>
);

// const ProfilePage = () => (
//   <div className="text-center py-12">
//     <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>
//     <p className="text-gray-600">Profile page coming soon...</p>
//   </div>
// );

const VendorDashboard = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-800 mb-4">Vendor Dashboard</h1>
    <p className="text-gray-600">Vendor dashboard coming soon...</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            {/* Public Routes - No Layout */}
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Change Password Route - Protected but No Layout */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute requiredRoles={["admin", "customer", "vendor"]}>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />

            {/* Home Route - Protected with Layout */}
            <Route
              path="/home"
              element={
                <ProtectedRoute requiredRoles={["admin", "customer", "vendor"]}>
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - With Layout */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute requiredRoles={["customer"]}>
                  <AppLayout>
                    <CustomerDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/vendor"
              element={
                <ProtectedRoute requiredRoles={["vendor"]}>
                  <AppLayout>
                    <VendorDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRoles={["admin", "customer", "vendor"]}>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/turfs"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AppLayout>
                    <TurfManagementContainer />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AppLayout>
                    <TurfBookingsContainer />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
               <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRoles={["admin"]}>
                  <AppLayout>
                    <div className="text-center py-12">
                      <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Admin Panel
                      </h1>
                      <p className="text-gray-600">
                        Admin features coming soon...
                      </p>
                    </div>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute requiredRoles={["admin", "customer"]}>
                  <AppLayout>
                    <MyBookingsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/turfs"
              element={
                <ProtectedRoute requiredRoles={["admin", "customer", "vendor"]}>
                  <AppLayout>
                    <TurfsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
