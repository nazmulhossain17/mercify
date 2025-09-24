import { clearCredentials, setCredentials } from "@/store/slice/authSlice";
import { store } from "@/store/store";
import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
  timeout: 10000,
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log("🌐 API Request:", config.method?.toUpperCase(), config.url);

    const state = store.getState();
    const token = state.auth.accessToken;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Added auth token to request");
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    console.error("❌ API Error:", error.response?.status, error.config?.url);

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("🔄 Attempting token refresh...");

      try {
        const refreshResponse = await axios.get<{ accessToken: string }>(
          `${import.meta.env.VITE_API_URL}/member/refresh-token`,
          {
            withCredentials: true,
            timeout: 5000,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        console.log("✅ Token refreshed successfully");

        // Update Redux store with new token
        const state = store.getState();
        if (state.auth.user) {
          store.dispatch(
            setCredentials({
              accessToken: newAccessToken,
              user: state.auth.user,
            })
          );

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          console.log("🔄 Retrying original request with new token");
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("💥 Token refresh failed:", refreshError);

        // Clear auth state and redirect to login
        store.dispatch(clearCredentials());

        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/sign-in") {
          window.location.href = "/sign-in";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
