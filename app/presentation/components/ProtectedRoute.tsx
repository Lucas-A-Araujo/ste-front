import React, { useEffect } from "react";
import { useAuth } from "../../controllers/contexts/AuthContext";
import { useNavigate } from "react-router";
import { logger } from "../../infrastructure/lib/logger";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      logger.navigation('Acesso negado a rota protegida, redirecionando para login');
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; 
  }

  return <>{children}</>;
}; 