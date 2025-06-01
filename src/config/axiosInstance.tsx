import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";

// Create an instance with default settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:3900/", // Default base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to handle common logic (e.g., authentication token)
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: any) => {
    console.log("Interceptor triggered");
    // Here, you can add authentication tokens, etc., if needed
    // const token = localStorage.getItem("accessToken");
    const token = localStorage.getItem("komaxiviustudent");
    if (token) {
      const parsed = JSON.parse(token);
      const tok = parsed.accessToken;
      config.headers["Authorization"] = `Bearer ${tok}`;
    }
    return config;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (error: any) => {
    return Promise.reject(error);
  }
);

// Handle errors globally using interceptors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const response = error?.response as AxiosResponse;
    if (response?.status === 400 || response?.status === 401) {
      const errorData =
        response?.data?.errors ||
        response?.data?.message ||
        "Server error. Please contact admin.";

      // Normalize and display errors
      if (Array.isArray(errorData)) {
        // Case: Array of errors
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorData.forEach((err: any) => {
          toast.error(typeof err === "string" ? err : JSON.stringify(err));
        });
      } else if (typeof errorData === "string") {
        // Case: Single string message
        toast.error(errorData);
      } else if (typeof errorData === "object") {
        // Case: Object of errors (e.g., field-based)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(errorData).forEach((val: any) => {
          if (Array.isArray(val)) {
            val.forEach((msg) => toast.error(msg));
          } else {
            toast.error(val);
          }
        });
      } else {
        // Fallback
        toast.error("Unexpected error format.");
      }
    } else {
      // Handle other status codes (optional)
      toast.error(response?.data?.message || "An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
