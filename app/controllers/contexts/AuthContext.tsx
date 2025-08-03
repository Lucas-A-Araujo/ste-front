import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState, LoginRequest, User, LoginResponse } from "../../domain/types/auth";
import { authRepository } from "../../infrastructure/repositories/authRepository";
import { useApi } from "../hooks/useApi";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { STORAGE_KEYS } from "../../infrastructure/constants";
import { AUTH_CONFIG } from "../../infrastructure/constants";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { execute } = useApi<LoginResponse>();

  const [authData, setAuthData, removeAuthData] = useLocalStorage(STORAGE_KEYS.AUTH_DATA, {
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await execute(() => authRepository.login(credentials));
      
      setAuthData({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      });
      
      console.log(AUTH_CONFIG.TOKEN_LOG_PREFIX + response.access_token.substring(0, 20) + '...');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }, [execute, setAuthData]);

  const logout = useCallback(() => {
    removeAuthData();
  }, [removeAuthData]);

  const checkAuth = useCallback(() => {
    return authData.isAuthenticated;
  }, [authData.isAuthenticated]);

  const contextValue: AuthContextType = {
    user: authData.user,
    token: authData.token,
    isAuthenticated: authData.isAuthenticated,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}; 