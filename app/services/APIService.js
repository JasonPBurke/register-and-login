import axios from "axios";
import mem from "mem";
import AuthService from "./AuthService";

// TODO: Get these from env config
const API_URL = "http://localhost:3030/v1";
const TOKEN_REFRESH_MIN = 20000 // Minimum interval which token can be refreshed

// Used for accessing unauthenticated API urls
export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Used for accessing private API urls with a JWT access token
export const axiosPrivate = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor adds the Bearer auth token to private API requests
axiosPrivate.interceptors.request.use(
  async (config) => {
    const accessToken = AuthService.getAccessToken();

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${session?.accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor checks for an auth failure and refreshes the token before resending the original request
const memoizedRefreshToken = mem(AuthService.refreshLogin, { maxAge: TOKEN_REFRESH_MIN });
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error?.config;
  
      if (error?.response?.status === 401 && !config?.sent) {
        config.sent = true;
  
        await memoizedRefreshToken();
        return axiosPrivate(config);
      }
      return Promise.reject(error);
    }
  );
  