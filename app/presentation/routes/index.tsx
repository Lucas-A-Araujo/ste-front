import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../controllers/contexts/AuthContext";
import { logger } from "../../infrastructure/lib/logger";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/home", { replace: true });
      } else {
        logger.navigation('Redirecionando usuário não autenticado para login');
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null;
} 