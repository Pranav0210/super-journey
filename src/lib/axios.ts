import Axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../config/index";

const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  config.headers = config.headers;
  return config;
};

let showToast: ((options: { message: string; type?: "success" | "error" | "info" | "warning"; duration?: number }) => void) | null = null;

export const setToastFunction = (toastFunction: typeof showToast) => {
  showToast = toastFunction;
};

export const responseInterceptor = (response: AxiosResponse) => {
  if (response.headers["content-type"].startsWith("application/json")) {
    return response?.data;
  }
  return response;
};

export const errorInterceptor = (error) => {
  if (error.response) {
    const { statusCode, message, path } = error.response.data;

    // Show toast if function is available
    if (showToast) {
      showToast({ message: message || `Error ${statusCode}`, type: "error" });
    }

    console.error(`API Error [${statusCode}] on ${path}: ${message}`);
  } else {
    if (showToast) {
      showToast({ message: "Network Error: Please check your connection.", type: "error" });
    }
    console.error("Network Error:", error);
  }

  return Promise.reject(error); // Propagate error to useQuery
}

export const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(responseInterceptor, errorInterceptor);
