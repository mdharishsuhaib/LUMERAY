import axios from "axios";

const API = axios.create({
  baseURL: "https://lumeray.onrender.com/api"
});

// ✅ Attach JWT token automatically to every request
// This is why delete and profile update were failing —
// the backend auth middleware was never receiving the token.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default API;
