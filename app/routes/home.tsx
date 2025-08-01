import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { UserProvider, useUsers } from "../contexts/UserContext";
import { UserList } from "../components/UserList";
import { Layout } from "../components/Layout";
import { FaSearch } from "react-icons/fa";
import type { User } from "../types/user";

function HomeContent() {
  const navigate = useNavigate();
  const { users, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nome.toLowerCase().includes(term) ||
      user.cpf.includes(term) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.naturalidade && user.naturalidade.toLowerCase().includes(term)) ||
      (user.nacionalidade && user.nacionalidade.toLowerCase().includes(term))
    );
  }, [users, searchTerm]);

  const handleEdit = (user: User) => {
    navigate(`/user/${user.id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      deleteUser(id);
    }
  };

  const handleNewUser = () => {
    navigate("/user/new");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Usuários</h2>
            <p className="text-gray-600">Gerencie os usuários do sistema</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleNewUser}
              className="ml-4 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Novo Usuário
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <UserList
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}

export function meta() {
  return [
    { title: "Gerenciamento de Usuários" },
    { name: "description", content: "Sistema de gerenciamento de usuários" },
  ];
}

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
