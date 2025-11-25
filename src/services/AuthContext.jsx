import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authService.getProfile();

        console.log('Profile data received:', userData);

        const userInfo = {
          id: userData.id || userData.user_id,
          name: userData.name || userData.username,
          email: userData.email,
          role: userData.role || 'user'
        };

        console.log('Processed user info:', userInfo);

        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      console.log('Login response:', response);

      let access_token, userInfo;

      if (response.data) {
        access_token = response.data.access_token;
        userInfo = {
          id: response.data.id || response.data.user_id,
          name: response.data.name || response.data.username,
          email: response.data.email,
          role: response.data.role || 'user'
        };
      } else {
        access_token = response.access_token;
        userInfo = {
          id: response.id || response.user_id,
          name: response.name || response.username,
          email: response.email,
          role: response.role || 'user'
        };
      }

      console.log('Processed login user info:', userInfo);

      localStorage.setItem('access_token', access_token);
      setUser(userInfo);
      setIsAuthenticated(true);

      return { success: true, data: response };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};