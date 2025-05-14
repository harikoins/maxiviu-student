import axios, { AxiosError, type AxiosResponse } from 'axios';
import {  toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

// Create an instance with default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3900/', // Default base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to handle common logic (e.g., authentication token)
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config:any) => {
    // Here, you can add authentication tokens, etc., if needed
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error:any) => {
    return Promise.reject(error);
  }
);

// Handle errors globally using interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.status === 400) {
      console.log(((error?.response) as AxiosResponse)?.data  )

      const errors = ((error?.response) as AxiosResponse)?.data?.errors ?? "Server error contact admin!"
        
      // Display each error as a separate toast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors.forEach((err:any) => {
          toast.error(err);
      });

   //   toast.error(((error?.response) as AxiosResponse)?.data?.errors ?? "Server error contact admin!");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
