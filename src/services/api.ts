import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError } from '../types/error';


const createApiService = (baseURL: string, timeout = 10000) => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const setupInterceptors = (retryAttempts = 3, retryDelay = 1000) => {
    // Request interceptor
    instance.interceptors.request.use(
      (config) => {
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status >= 500 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          for (let i = 0; i < retryAttempts; i++) {
            try {
              await new Promise(resolve => setTimeout(resolve, retryDelay * (i + 1)));
              return await instance(originalRequest);
            } catch (retryError) {
              if (i === retryAttempts - 1) {
                throw retryError;
              }
            }
          }
        }

        const apiError: ApiError = {
          message: error.response?.data?.message || error.message || 'An error occurred',
          status: error.response?.status,
          code: error.code,
        };

        return Promise.reject(apiError);
      }
    );
  };

  setupInterceptors();

  return {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await instance.get<T>(url, config);
      return response.data;
    },
    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await instance.post<T>(url, data, config);
      return response.data;
    },
    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await instance.put<T>(url, data, config);
      return response.data;
    },
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await instance.delete<T>(url, config);
      return response.data;
    },
  };
};

export default createApiService;