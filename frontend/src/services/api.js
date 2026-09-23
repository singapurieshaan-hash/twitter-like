import axios from "axios";

// All requests go to the same origin under /api; Vite proxies to the backend.
const api = axios.create({ baseURL: "/api" });

let token = null;

// Called by AuthContext whenever the token changes (login / logout / refresh).
export const setToken = (newToken) => {
  token = newToken;
};

// Attach the JWT as `Authorization: Bearer <token>` on every request.
api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
