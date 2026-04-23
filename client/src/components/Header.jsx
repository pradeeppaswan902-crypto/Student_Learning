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
    <header className="fixed  w-full z-50 flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow-md">
      <h1 className="text-xl font-bold">
        Student Learning Management
      </h1>

      <nav className="flex items-center space-x-4">
        {!user ? (
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
        ) : (
          <>
            
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;