import axios, { AxiosRequestConfig } from "axios";

declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>,
    request<T = any>(config: AxiosRequestConfig): Promise<T>,
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>,
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>,
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>,
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>,
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>,
    patch<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<T>
  }
}

export const instance = axios.create({
  baseURL: "https://api.realworld.io/api",
  timeout: 5_000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!["Authorization"] = `Token ${token}`;
  }
  return config;
});

instance.interceptors.response.use((response) => {
  if (response.status === 200) {
    return response.data;
  }
  return response;
});
