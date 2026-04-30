// Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white shadow-md">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center px-4 py-3 gap-3 sm:gap-4">
        {/* Logo / Title */}
        <h1 className="text-base sm:text-lg md:text-xl font-bold text-center sm:text-left">
          Student Learning Management
        </h1>

        {/* Nav */}
        <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {!user ? (
            <Link 
              to="/login" 
              className="hover:text-gray-300 text-sm sm:text-base px-3 py-1 rounded-md transition"
            >
              Login
            </Link>
          ) : (
            <>
              <span className="text-xs sm:text-sm text-center sm:text-left truncate max-w-[150px] sm:max-w-none">
                Welcome, {user?.name || "Student"}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition w-full sm:w-auto"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;