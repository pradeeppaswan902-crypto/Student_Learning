import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardRefreshTick, setDashboardRefreshTick] = useState(0);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userId) {
      setUser({
        token,
        _id: userId,
        name: userName || "Student",
        email: userEmail || "",
      });

      // axios default header set
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = (token, userData = {}) => {
    localStorage.setItem("token", token);

    if (userData._id) localStorage.setItem("userId", userData._id);
    if (userData.name) localStorage.setItem("userName", userData.name);
    if (userData.email) localStorage.setItem("userEmail", userData.email);

    setUser({
      token,
      _id: userData._id,
      name: userData.name || "Student",
      email: userData.email || "",
    });

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // ✅ Dashboard refresh trigger
  const refreshDashboard = () =>
    setDashboardRefreshTick((t) => t + 1);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        dashboardRefreshTick,
        refreshDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};