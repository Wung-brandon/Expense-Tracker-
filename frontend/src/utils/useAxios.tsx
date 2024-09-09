import { useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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

  const { authTokens, setAuthToken, setUser } = context;
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(async (config) => {
    if (authTokens?.access) {
      const user = jwtDecode<DecodedToken>(authTokens.access);
      const isExpired = dayjs().isAfter(dayjs.unix(user.exp));
      console.log("bool", isExpired)

      if (isExpired) {
        try {
          const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: authTokens.refresh,
          });
          if (response.status === 200) {
            setAuthToken(response.data);
            console.log("refresh tokens:",response.data)
            setUser(jwtDecode(response.data.access));
            config.headers.Authorization = `Bearer ${response.data.access}`;
            // toast.success("Token refreshed successfully.");
          } else {
            // toast.error('Token refresh failed. Please login again.');
            navigate('/login');
          }
        } catch (error) {
          console.error(error);
          toast.error('Session expired. Please login again.');
          navigate('/login');
        }
      } else {
        config.headers.Authorization = `Bearer ${authTokens.access}`;
      }
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