import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    // Ignore cancelled requests
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error)
    }

    // Show network error only for real network failures
    if (!error.response && error.code === "ERR_NETWORK") {
      toast.error("Unable to connect to the server.")
      return Promise.reject(error)
    }

    if (error.response?.status >= 500) {
      toast.error("Server error. Please try again.")
    } else if (
      error.response?.data?.detail &&
      error.response.status !== 404
    ) {
      toast.error(error.response.data.detail)
    }

    return Promise.reject(error)
  }
)