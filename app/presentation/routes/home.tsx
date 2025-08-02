import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PersonProvider, usePersons } from "../../controllers/contexts/PersonContext";
import { PersonList } from "../components/PersonList";
import { Layout } from "../components/Layout";
import { Notification } from "../components/Notification";
import { ConfirmModal } from "../components/ConfirmModal";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { FaSearch, FaPlus } from "react-icons/fa";
import { useDebounce } from "../../controllers/hooks/useDebounce";
import type { Person } from "../../domain/types/person";

function HomeContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    persons, 
    deletePerson, 
    loading, 
    error, 
    searchLoading, 
    searchPeople, 
    loadPeople,
    pagination,
  } = usePersons();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("error");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const urlSearch = searchParams.get("q");
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get("q");
    const urlPage = parseInt(searchParams.get("page") || "1");
    
    if (urlSearch) {
      searchPeople(urlSearch, urlPage);
    } else {
      loadPeople(urlPage);
    }
  }, [searchParams, searchPeople, loadPeople]);

  useEffect(() => {
    if (debouncedSearchTerm !== searchParams.get("q")) {
      const newSearchParams = new URLSearchParams(searchParams);
      
      if (debouncedSearchTerm) {
        newSearchParams.set("q", debouncedSearchTerm);
        newSearchParams.set("page", "1");
      } else {
        newSearchParams.delete("q");
      }
      
      setSearchParams(newSearchParams);
    }
  }, [debouncedSearchTerm, searchParams, setSearchParams]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const showError = (message: string) => {
    setNotificationType("error");
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const showSuccess = (message: string) => {
    setNotificationType("success");
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleEdit = (person: Person) => {
    navigate(`/person/${person.id}`);
  };

  const handleDelete = (id: string) => {
    const person = persons.find(p => p.id === id);
    if (person) {
      setPersonToDelete(person);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!personToDelete) return;
    
    setDeletingId(personToDelete.id!);
    setShowDeleteModal(false);
    
    try {
      await deletePerson(personToDelete.id!);
      showSuccess("Pessoa excluída com sucesso!");
      
      // Recarregar a lista após excluir
      const currentPage = parseInt(searchParams.get("page") || "1");
      const currentSearch = searchParams.get("q");
      
      if (currentSearch) {
        await searchPeople(currentSearch, currentPage);
      } else {
        await loadPeople(currentPage);
      }
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      showError('Erro ao excluir pessoa. Tente novamente.');
    } finally {
      setDeletingId(null);
      setPersonToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPersonToDelete(null);
  };

  const handleNewUser = () => {
    navigate("/person/new");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a pessoa "${personToDelete?.nome}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        loading={deletingId !== null}
      />
      
      <Layout>
        <Notification
          type={notificationType}
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          show={showNotification}
        />
        
        <div className="space-y-6">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pessoas</h2>
              <p className="text-gray-600">Gerencie as pessoas do sistema</p>
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
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </Layout>
    </>
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
    <ProtectedRoute>
      <PersonProvider>
        <HomeContent />
      </PersonProvider>
    </ProtectedRoute>
  );
}
