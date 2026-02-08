// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add auth token automatically if using Clerk
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("clerk-db-jwt"); // or however you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;