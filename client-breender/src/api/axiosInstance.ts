import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = cookies.get('access_token');
  const refreshToken = cookies.get('refresh_token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Check if the token is expired
  const isTokenExpired = () => {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  if (isTokenExpired() && refreshToken) {
    try {
      // Refresh the token
      const response = await axios.post('http://localhost:3000/api/v1/auth/refresh', {}, { withCredentials: true });
      cookies.set('accessToken', response.data.accessToken, { path: '/', secure: true, sameSite: 'strict' });
      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
    } catch (error) {
      console.error('Token refresh failed', error);
      cookies.remove('accessToken');
      cookies.remove('refreshToken');
      window.location.href = '/login'; // Redirect to login
      return Promise.reject(error);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
