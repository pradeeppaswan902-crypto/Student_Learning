import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (token) {
      // Set user with token and stored user data
      setUser({ 
        token, 
        name: userName || "Student",
        email: userEmail || ""
      });
    }
    setLoading(false);
  }, []);

  const login = (token, userData = {}) => {
    localStorage.setItem("token", token);
    if (userData.name) localStorage.setItem("userName", userData.name);
    if (userData.email) localStorage.setItem("userEmail", userData.email);
    
    setUser({ 
      token, 
      name: userData.name || "Student",
      email: userData.email || "",
      ...userData
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  // Set axios default header
  if (user?.token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};