import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Portfolio from "./components/Portfolio";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy-load admin dashboard (only loads when user visits /admin)
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const AnalyticsDashboard = lazy(() => import("./components/AnalyticsDashboard"));

// Loading fallback
function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#032d60] to-[#0d2035]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#00a1e0]" />
        <p className="text-white/60">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <AdminDashboard />
                </Suspense>
              }
            />
            <Route
              path="/analytics"
              element={
                <Suspense fallback={<LoadingScreen />}>
                  <AnalyticsDashboard />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
