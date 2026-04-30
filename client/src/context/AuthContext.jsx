import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardRefreshTick, setDashboardRefreshTick] = useState(0);

  // ✅ Load user on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser?.token) {
      setUser(storedUser);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = (token, userData = {}) => {
    const userObj = {
      token,
      _id: userData._id,
      name: userData.name || "Student",
      email: userData.email,
    };

    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ✅ Refresh dashboard
  const refreshDashboard = () => {
    setDashboardRefreshTick((t) => t + 1);
  };

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