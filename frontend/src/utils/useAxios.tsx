import { useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

const baseURL = 'http://127.0.0.1:8000/api';

interface DecodedToken {
  exp: number; // UNIX timestamp
}

const useAxios = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAxios must be used within an AuthProvider');
  }

  const { authTokens, setAuthToken, setUser, logoutUser } = context;
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });

  // Function to refresh tokens
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens?.refresh,
      });

      if (response.status === 200) {
        setAuthToken(response.data);
        setUser(jwtDecode(response.data.access));
        // toast.success('Token refreshed successfully.');
        return response.data.access;
      } else {
        logoutUser();
        // toast.error('Failed to refresh token. Please log in again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      // toast.error('Session expired. Please log in again.');
      logoutUser();
      navigate('/login');
    }
  };

  // Function to set up token auto-refresh
  const setupAutoRefresh = () => {
    if (authTokens?.access) {
      const decodedToken = jwtDecode<DecodedToken>(authTokens.access);
      const expiresAt = dayjs.unix(decodedToken.exp);
      const now = dayjs();

      // Calculate time remaining until token expiration
      const expirationTimeInMs = expiresAt.diff(now) - 30000; // Refresh 30 seconds before expiration

      if (expirationTimeInMs > 0) {
        setTimeout(async () => {
          const newAccessToken = await refreshAccessToken();
          axiosInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }, expirationTimeInMs);
      } else {
        refreshAccessToken(); // Immediate refresh if expired
      }
    }
  };

  // Refresh the token automatically when the component mounts and when tokens change
  useEffect(() => {
    if (authTokens?.access) {
      setupAutoRefresh();
    }
  }, [authTokens]); // Watch for changes to authTokens

  // Axios interceptor for attaching the token to outgoing requests
  axiosInstance.interceptors.request.use(async (config) => {
    const decodedToken = jwtDecode<DecodedToken>(authTokens?.access);
    const isExpired = dayjs().isAfter(dayjs.unix(decodedToken.exp));

    if (isExpired) {
      const newAccessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${authTokens?.access}`;
    }

    return config;
  });

  // Axios interceptor for handling responses and errors
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error('Unauthorized access. Please log in.');
        logoutUser();
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('Forbidden access.');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
