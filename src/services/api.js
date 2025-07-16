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

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // PERBAIKAN: Jangan redirect otomatis untuk endpoint login
    if (error.response?.status === 401) {
      // Cek apakah ini request ke endpoint login
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginRequest) {
        // Hanya redirect jika bukan login request
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      // Jika login request, biarkan error di-handle oleh komponen
    }
    
    return Promise.reject(error);
  }
);

// Auth Service
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
      throw error; // Throw error biar bisa di-handle di AuthContext
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

// User Service
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

  getUserByUid: async (uid) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.USERS}/uid/${uid}`);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching user by UID:', error);
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

// Access Logs Service
export const accessLogsApi = {
  async getAll() {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.ACCESS_LOGS);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching access logs:', error);
      throw error;
    }
  },

  async getByUid(uid) {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.ACCESS_LOGS}/uid/${uid}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching access logs by UID:', error);
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

  async processRFIDAccess(uid, imageFile) {
    try {
      const formData = new FormData();
      formData.append('uid', uid);
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