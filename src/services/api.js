import axios from 'axios';

const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://[::1]:3000',
  ENDPOINTS: {
    USERS: '/users',
    ACCESS_LOGS: '/access-logs',
    AUTH: '/auth',
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');

      if (!isLoginRequest) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post(`${API_CONFIG.ENDPOINTS.AUTH}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.AUTH}/profile`);
      return response.data.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
  }
};

export const userService = {
  getUsers: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.USERS);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  getUserByPid: async (pid) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USERS}/pid/${pid}`);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching user by PID:', error);
      throw error;
    }
  },

  searchUsers: async (query) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USERS}/search?q=${encodeURIComponent(query)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.USERS, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.patch(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export const accessLogsApi = {
  async getSummary() {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/summary`);
      return response.data.data || { total: 0, granted: 0, denied: 0 };
    } catch (error) {
      console.error('Error fetching access logs summary:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.ACCESS_LOGS);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching access logs:', error);
      throw error;
    }
  },

  async getByPid(pid) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/pid/${pid}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching access logs by PID:', error);
      throw error;
    }
  },

  async getByDateRange(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/date-range?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching access logs by date range:', error);
      throw error;
    }
  },

  async getGranted() {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/granted`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching granted access logs:', error);
      throw error;
    }
  },

  async getDenied() {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/denied`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching denied access logs:', error);
      throw error;
    }
  },

  async processRFIDAccess(pid, imageFile) {
    try {
      const formData = new FormData();
      formData.append('pid', pid);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await api.post(
        `${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/process`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error processing RFID access:', error);
      return {
        access: false,
        message: 'System error during access processing',
        user: null,
        accessLog: null
      };
    }
  },
};

export { api, API_CONFIG };
export default userService;