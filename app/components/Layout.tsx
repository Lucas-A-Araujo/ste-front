import React from "react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
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
            <nav className="flex space-x-4">
              <span className="text-sm text-gray-500">
                Gerenciamento de pessoas
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}; 