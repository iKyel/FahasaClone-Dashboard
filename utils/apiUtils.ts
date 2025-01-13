import { ApiResponse } from "@/types/api.type";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import * as cookie from "cookie";

export default class ApiUtils {
  private axiosInstance: AxiosInstance;
  private baseURL: string = "http://localhost:3412";

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Lấy cookies từ document.cookie
        const cookies = cookie.parse(document.cookie);
        const token = cookies.token; // Giả sử token được lưu dưới tên "token"

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  private async handleRequest<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
    params?: Record<string, string | number | boolean>
  ): Promise<ApiResponse<T>> {
    try {
      // Nếu có params, thêm chúng vào URL
      if (params && (method === "get" || method === "delete")) {
        const queryString = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            acc[key] = String(value); // Chuyển tất cả các giá trị thành chuỗi
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        url += `?${queryString}`;
      }

      let response: AxiosResponse<T>;

      if (method === "get" || method === "delete") {
        response = await this.axiosInstance[method](url, config);
      } else {
        response = await this.axiosInstance[method](url, data, config);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleAxiosError<T>(error);
    }
  }

  public async get<T>(
    url: string,
    params?: Record<string, string | number | boolean>, // Tham số query
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("get", url, undefined, config, params);
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("post", url, data, config);
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("put", url, data, config);
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("patch", url, data, config);
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.handleRequest<T>("delete", url, undefined, config);
  }

  private handleAxiosError<T>(error: unknown): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: {
          message:
            (axiosError.response?.data as { message?: string })?.message ||
            axiosError.message,
          status: axiosError.response?.status,
        },
      };
    }
    return {
      success: false,
      error: {
        message: "An unknown error occurred",
      },
    };
  }
}
