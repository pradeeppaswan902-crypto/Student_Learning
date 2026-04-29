import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashborads";
import Quizes from "./pages/dashboard/Quizes";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// ✅ Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">

          {/* Toast Notifications */}
          <Toaster position="top-right" reverseOrder={false} />

          {/* Header */}
          <Header />

          {/* Routes */}
          <Routes>

            {/* Default route */}
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ QUIZ ROUTE (FIXED) */}
            <Route
              path="/quiz/:quizId"
              element={
                <ProtectedRoute>
                  <Quizes />
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<div>404 Page Not Found</div>} />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;