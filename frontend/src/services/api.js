import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://e-commerce-pxap.onrender.com/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT authorization token from storage
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 Unauthorized errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('userInfo');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
      }
    }
    return Promise.reject(error);
  }
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/uploads/placeholder.png';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Ensure we don't duplicate leading slash
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const backendBase = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'https://e-commerce-pxap.onrender.com');
  
  return `${backendBase}${path}`;
};

export default api;
