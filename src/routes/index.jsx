import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy load all pages
const Landing = lazy(() => import("../pages/Landing"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Room = lazy(() => import("../pages/Room"));
const Profile = lazy(() => import("../pages/Profile"));
const Students = lazy(() => import("../pages/Students"));
const UserProfile = lazy(() => import("../pages/UserProfile"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
