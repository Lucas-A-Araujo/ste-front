import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { PersonProvider, usePersons } from "../../controllers/contexts/PersonContext";
import { useAuth } from "../../controllers/contexts/AuthContext";
import { PersonList } from "../components/PersonList";
import { Layout } from "../components/Layout";
import { Notification } from "../components/Notification";
import { ConfirmModal } from "../components/ConfirmModal";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { BaseInput } from "../components/inputs";
import { FaPlus } from "react-icons/fa";
import { useDebounce } from "../../controllers/hooks/useDebounce";
import { useSessionStorage } from "../../controllers/hooks/useSessionStorage";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import { STORAGE_KEYS } from "../../infrastructure/constants";
import { NOTIFICATION_CONFIG, DEBOUNCE_CONFIG } from "../../controllers/constants";
import type { Person } from "../../domain/types/person";

function HomeContent() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  const [notificationData, setNotificationData, removeNotificationData] = useSessionStorage(STORAGE_KEYS.NOTIFICATION_DATA, {
    showSuccessToast: false,
    successMessage: ''
  });

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_CONFIG.SEARCH);

  useEffect(() => {
    const urlSearch = searchParams.get("q");
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const urlSearch = searchParams.get("q");
      const urlPage = parseInt(searchParams.get("page") || "1");
      
      if (urlSearch) {
        searchPeople(urlSearch, urlPage);
      } else {
        loadPeople(urlPage);
      }
    }
  }, [searchParams, searchPeople, loadPeople, isAuthenticated, authLoading]);

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

  useEffect(() => {
    if (notificationData.showSuccessToast && notificationData.successMessage) {
      showSuccess(notificationData.successMessage);
      removeNotificationData(); 
    }
  }, [notificationData, removeNotificationData]); 

  const showError = (message: string) => {
    setNotificationType(NOTIFICATION_CONFIG.TYPES.ERROR);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), NOTIFICATION_CONFIG.ERROR_DURATION);
  };

  const showSuccess = (message: string) => {
    setNotificationType(NOTIFICATION_CONFIG.TYPES.SUCCESS);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), NOTIFICATION_CONFIG.SUCCESS_DURATION);
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
      showSuccess(SUCCESS_MESSAGES.PERSON_DELETED);
      
      const currentPage = parseInt(searchParams.get("page") || "1");
      const currentSearch = searchParams.get("q");
      
      if (currentSearch) {
        await searchPeople(currentSearch, currentPage);
      } else {
        await loadPeople(currentPage);
      }
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      showError(ERROR_MESSAGES.DELETE_ERROR);
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
                <BaseInput
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Buscar pessoas..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  loading={searchLoading}
                />
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
