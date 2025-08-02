import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState, LoginRequest, User, LoginResponse } from "../../domain/types/auth";
import { authRepository } from "../../infrastructure/repositories/authRepository";
import { useApi } from "../hooks/useApi";

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
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  const { loading, error, execute } = useApi<LoginResponse>();

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    
    if (token && userStr) {
      try {
        const user: User = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        logout();
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      const response = await execute(() => authRepository.login(credentials));
      
      // Salvar dados no localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      console.log('Token salvo no localStorage:', response.access_token.substring(0, 20) + '...');
      
      setAuthState({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }, [execute]);

  const logout = useCallback(() => {
    // Limpar dados do localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
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