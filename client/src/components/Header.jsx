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
    <header className="fixed w-full z-50 bg-gray-900 text-white shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 gap-3 sm:gap-0">

        {/* Logo / Title */}
        <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">
          Student LMS
        </h1>

        {/* Nav */}
        <nav className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          {!user ? (
            <Link to="/login" className="hover:text-gray-300 text-sm sm:text-base">
              Login
            </Link>
          ) : (
            <>
              <span className="text-xs sm:text-sm text-center sm:text-left">
                Welcome, {user?.name || "Student"}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition"
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