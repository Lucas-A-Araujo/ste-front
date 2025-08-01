import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { PersonProvider, usePersons } from "../contexts/PersonContext";
import { PersonList } from "../components/PersonList";
import { Layout } from "../components/Layout";
import { FaSearch } from "react-icons/fa";
import type { Person } from "../types/person";

function HomeContent() {
  const navigate = useNavigate();
  const { persons, deletePerson } = usePersons();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return persons;
    }
    
    const term = searchTerm.toLowerCase();
    return persons.filter(person => 
      person.nome.toLowerCase().includes(term) ||
      person.cpf.includes(term) ||
      (person.email && person.email.toLowerCase().includes(term)) ||
      (person.naturalidade && person.naturalidade.toLowerCase().includes(term)) ||
      (person.nacionalidade && person.nacionalidade.toLowerCase().includes(term))
    );
  }, [persons, searchTerm]);

  const handleEdit = (person: Person) => {
    navigate(`/person/${person.id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este pessoa?")) {
      deletePerson(id);
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
            <h2 className="text-2xl font-bold text-gray-900">pessoas</h2>
            <p className="text-gray-600">Gerencie os pessoas do sistema</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar pessoas..."
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
              Novo pessoa
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <PersonList
            persons={filteredUsers}
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
    { title: "Gerenciamento de pessoas" },
    { name: "description", content: "Sistema de gerenciamento de pessoas" },
  ];
}

export default function Home() {
  return (
    <PersonProvider>
      <HomeContent />
    </PersonProvider>
  );
}
