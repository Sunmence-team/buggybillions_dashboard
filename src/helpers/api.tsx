import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupInterceptors = (logout: () => void) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.code === "ERR_NETWORK") {
        console.error("No internet or server down");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Logging out...");
        logout();
      }
      return Promise.reject(error);
    }
  );
};

export default api;