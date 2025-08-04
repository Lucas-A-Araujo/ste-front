import React from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../controllers/contexts/AuthContext";
import { useNavigate } from "react-router";
import { FaSignOutAlt } from "react-icons/fa";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="header-content">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Sistema de Gerenciamento
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              
              {user && (
                <>
                  <div className="text-sm text-gray-700">
                    Olá, <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Sair
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}; 