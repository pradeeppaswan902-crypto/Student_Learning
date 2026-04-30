import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ✅ Auto token attach (BEST FIX)
api.interceptors.request.use((config) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (storedUser?.token) {
    config.headers.Authorization = `Bearer ${storedUser.token}`;
  }

  return config;
});

export default api;