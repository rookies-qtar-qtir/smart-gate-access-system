import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "./api";
import type { AuthLoginResponse, AuthProfile } from "../domain/auth";
import type { ApiError } from "./api";

type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; data?: AuthLoginResponse; message?: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const mapToUser = (userData: AuthProfile | AuthLoginResponse): AuthUser => ({
  id: (userData as AuthProfile).id || (userData as AuthProfile).user_id,
  name: (userData as AuthProfile).name || (userData as AuthLoginResponse).username,
  email: userData.email,
  role: userData.role || "user",
});

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    void checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        const userData = await authService.getProfile();

        console.log("Profile data received:", userData);

        const userInfo = mapToUser(userData);

        console.log("Processed user info:", userInfo);

        setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      console.log("Login response:", response);

      const access_token = response.access_token;
      const userInfo = mapToUser(response);

      console.log("Processed login user info:", userInfo);

      localStorage.setItem("access_token", access_token);
      setUser(userInfo);
      setIsAuthenticated(true);

      return { success: true, data: response };
    } catch (error) {
      console.error("Login error:", error);
      const normalized = error as ApiError;
      return {
        success: false,
        message: normalized.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
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
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
