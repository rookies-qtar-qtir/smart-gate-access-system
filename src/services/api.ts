import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type Method } from "axios";
import type { AccessLogEntry } from "../domain/accessLog";
import type { User } from "../domain/user";
import type { AuthLoginResponse, AuthProfile } from "../domain/auth";

export interface ApiConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
  access?: boolean;
}

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      headers: config.headers,
    });
    this.attachInterceptors();
  }

  private attachInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        console.error("API Response Error:", error.response?.data || error.message);

        if (error.response?.status === 401) {
          const isLoginRequest = error.config?.url?.includes("/auth/login");
          if (!isLoginRequest) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    return {
      status: error.response?.status,
      message: (error.response?.data as { message?: string })?.message || error.message,
      data: error.response?.data,
    };
  }

  private async request<T>(method: Method, url: string, data?: unknown, config?: AxiosRequestConfig) {
    const response = await this.client.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }

  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>("get", url, undefined, config);
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>("post", url, data, config);
  }

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>("put", url, data, config);
  }

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.request<T>("patch", url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.request<T>("delete", url, undefined, config);
  }
}

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://[::1]:3000",
  ENDPOINTS: {
    USERS: "/users",
    ACCESS_LOGS: "/access-logs",
    AUTH: "/auth",
  },
  HEADERS: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
};

class AuthService {
  constructor(private readonly client: ApiClient) {}

  async login(email: string, password: string): Promise<AuthLoginResponse> {
    const response = await this.client.post<ApiEnvelope<AuthLoginResponse>>(
      `${API_CONFIG.ENDPOINTS.AUTH}/login`,
      { email, password }
    );
    return (response as ApiEnvelope<AuthLoginResponse>).data ?? (response as unknown as AuthLoginResponse);
  }

  async getProfile(): Promise<AuthProfile> {
    const response = await this.client.get<ApiEnvelope<AuthProfile>>(
      `${API_CONFIG.ENDPOINTS.AUTH}/profile`
    );
    return response.data ?? (response as unknown as AuthProfile);
  }

  logout() {
    localStorage.removeItem("access_token");
  }
}

class UserService {
  constructor(private readonly client: ApiClient) {}

  async getUsers(): Promise<User[]> {
    const response = await this.client.get<ApiEnvelope<User[]>>(API_CONFIG.ENDPOINTS.USERS);
    return response.data ?? [];
  }

  async getUserById(id: string | number): Promise<User> {
    const response = await this.client.get<ApiEnvelope<User>>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
    return response.data;
  }

  async getUserByUid(pid: string): Promise<User | null> {
    try {
      const response = await this.client.get<ApiEnvelope<User>>(`${API_CONFIG.ENDPOINTS.USERS}/pid/${pid}`);
      return response.data ?? null;
    } catch (error) {
      const normalized = error as ApiError;
      if (normalized.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await this.client.get<ApiEnvelope<User[]>>(
      `${API_CONFIG.ENDPOINTS.USERS}/search?q=${encodeURIComponent(query)}`
    );
    return response.data ?? [];
  }

  async createUser(userData: Partial<User>) {
    return this.client.post<ApiEnvelope<User>>(API_CONFIG.ENDPOINTS.USERS, userData);
  }

  async updateUser(id: string | number, userData: Partial<User>) {
    return this.client.patch<ApiEnvelope<User>>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, userData);
  }

  async deleteUser(id: string | number) {
    return this.client.delete<ApiEnvelope<{ success: boolean }>>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
  }
}

export interface AccessProcessResponse {
  access?: boolean;
  message?: string;
  user?: User | null;
  accessLog?: AccessLogEntry | null;
  data?: {
    access?: boolean;
    message?: string;
    [key: string]: unknown;
  };
}

class AccessLogService {
  constructor(private readonly client: ApiClient) {}

  async getAll(): Promise<AccessLogEntry[]> {
    const response = await this.client.get<ApiEnvelope<AccessLogEntry[]>>(API_CONFIG.ENDPOINTS.ACCESS_LOGS);
    return response.data ?? [];
  }

  async getByUid(pid: string): Promise<AccessLogEntry[]> {
    const response = await this.client.get<ApiEnvelope<AccessLogEntry[]>>(
      `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/pid/${pid}`
    );
    return response.data ?? [];
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<AccessLogEntry[]> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    const response = await this.client.get<ApiEnvelope<AccessLogEntry[]>>(
      `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/date-range?${params.toString()}`
    );
    return response.data ?? [];
  }

  async getGranted(): Promise<AccessLogEntry[]> {
    const response = await this.client.get<ApiEnvelope<AccessLogEntry[]>>(
      `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/granted`
    );
    return response.data ?? [];
  }

  async getDenied(): Promise<AccessLogEntry[]> {
    const response = await this.client.get<ApiEnvelope<AccessLogEntry[]>>(
      `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/denied`
    );
    return response.data ?? [];
  }

  async processRFIDAccess(pid: string, imageFile?: Blob | null): Promise<AccessProcessResponse> {
    const formData = new FormData();
    formData.append("pid", pid);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await this.client.post<AccessProcessResponse>(
        `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/process`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error processing RFID access:", error);
      return {
        access: false,
        message: "System error during access processing",
        user: null,
        accessLog: null,
      };
    }
  }
}

const apiClient = new ApiClient({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
});

export const authService = new AuthService(apiClient);
export const userService = new UserService(apiClient);
export const accessLogsApi = new AccessLogService(apiClient);

export { apiClient as api };
export default userService;
