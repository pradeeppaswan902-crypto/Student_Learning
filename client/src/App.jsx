import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashborads";
import { AuthProvider, useAuth } from "./context/AuthContext";

// 👇 ADD THIS
import { Toaster } from "react-hot-toast";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">

          {/* 👇 TOAST CONTAINER (IMPORTANT) */}
          <Toaster position="top-right" reverseOrder={false} />

          <Header />

          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;