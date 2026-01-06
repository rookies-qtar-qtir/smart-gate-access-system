import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

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

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('access_token');

      if (token) {
        const decoded = jwtDecode(token);

        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          console.warn('Token expired');
          logout();
          setLoading(false);
          return;
        }

        console.log('Decoded token:', decoded);

        const userInfo = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          pid: decoded.pid
        };

        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Token invalid:', error);
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
      } else {
        access_token = response.access_token;
      }

      localStorage.setItem('access_token', access_token);

      const decoded = jwtDecode(access_token);

      userInfo = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        pid: decoded.pid
      };

      console.log('User info set from token:', userInfo);

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