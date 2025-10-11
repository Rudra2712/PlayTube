import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://play-tube-backend-flax.vercel.app/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});