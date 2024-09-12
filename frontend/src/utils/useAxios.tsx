/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react';
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

let isRefreshing = false; // Flag to track if token refresh is in progress
let failedQueue: any[] = []; // Queue to hold failed requests

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });

  failedQueue = [];
};

const useAxios = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAxios must be used within an AuthProvider');
  }

  const { authTokens, setAuthToken, setUser } = context;
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(async (config) => {
    if (!authTokens?.access) return config;

    const user = jwtDecode<DecodedToken>(authTokens.access);
    const isAccessExpired = dayjs().isAfter(dayjs.unix(user.exp));
    console.log("isAccessExpired", isAccessExpired);

    if (!isAccessExpired) {
      config.headers.Authorization = `Bearer ${authTokens.access}`;
      return config;
    }

    if (isRefreshing) {
      // If refresh is in progress, queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            config.headers.Authorization = `Bearer ${token}`;
            resolve(config);
          },
          reject: (err: any) => reject(err),
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${baseURL}/token/refresh/`, {
        refresh: authTokens.refresh,
      });

      if (response.status === 200) {
        setAuthToken(response.data);
        setUser(jwtDecode(response.data.access));
        console.log("refresh tokens:",response.data)
        localStorage.setItem('authTokens', JSON.stringify(response.data));

        config.headers.Authorization = `Bearer ${response.data.access}`;
        processQueue(null, response.data.access);

        return config;
      }
    } catch (error) {
      processQueue(error, null);
      console.error(error);
      toast.error('Session expired. Please login again.');
      navigate('/login');
    } finally {
      isRefreshing = false;
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again.');
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
