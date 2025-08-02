import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { PersonProvider, usePersons } from "../contexts/PersonContext";
import { PersonList } from "../components/PersonList";
import { Layout } from "../components/Layout";
import { FaSearch, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { useDebounce } from "../hooks/useDebounce";
import type { Person } from "../types/person";

function HomeContent() {
  const navigate = useNavigate();
  const { persons, deletePerson, loading, error, searchLoading, searchPeople, refreshPersons } = usePersons();
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (hasSearched || searchTerm) {
      searchPeople(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, searchPeople, hasSearched]);

  const handleEdit = (person: Person) => {
    navigate(`/person/${person.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta pessoa?")) {
      setDeletingId(id);
      try {
        await deletePerson(id);
      } catch (error) {
        console.error('Erro ao excluir pessoa:', error);
        alert('Erro ao excluir pessoa. Tente novamente.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleNewUser = () => {
    navigate("/person/new");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHasSearched(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Pessoas</h2>
            <p className="text-gray-600">Gerencie as pessoas do sistema</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={refreshPersons}
                    className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            </div>
          )}
          
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
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                />
                {searchLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleNewUser}
              className="ml-4 px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Adicionar pessoa
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <PersonList
            persons={persons}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
            loading={loading}
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
