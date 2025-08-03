import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { PersonProvider, usePersons } from "../../controllers/contexts/PersonContext";
import { PersonForm } from "../components/PersonForm";
import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { personRepository } from "../../infrastructure/repositories/personRepository";
import { useSessionStorage } from "../../controllers/hooks/useSessionStorage";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../constants";
import { STORAGE_KEYS } from "../../infrastructure/constants";
import { NOTIFICATION_CONFIG } from "../../controllers/constants";
import { HttpError } from "../../infrastructure/lib/http";
import type { Person } from "../../domain/types/person";

function UserDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updatePerson, addPerson } = usePersons();
  const [person, setPerson] = useState<Person | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("error");
  const [notificationMessage, setNotificationMessage] = useState("");

  const [notificationData, setNotificationData, removeNotificationData] = useSessionStorage(STORAGE_KEYS.NOTIFICATION_DATA, {
    showSuccessToast: false,
    successMessage: ''
  });

  const isNewUser = id === "new";

  useEffect(() => {
    const loadPerson = async () => {
      if (id && id !== "new") {
        try {
          const personData = await personRepository.getPersonById(id);
          setPerson(personData);
        } catch (error) {
          showError(ERROR_MESSAGES.PERSON_NOT_FOUND);
        }
      }
    };

    loadPerson();
  }, [id]);

  const showSuccess = (message: string) => {
    setNotificationType(NOTIFICATION_CONFIG.TYPES.SUCCESS);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), NOTIFICATION_CONFIG.SUCCESS_DURATION);
  };

  const showError = (message: string) => {
    setNotificationType(NOTIFICATION_CONFIG.TYPES.ERROR);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), NOTIFICATION_CONFIG.ERROR_DURATION);
  };

  const handleSubmit = async (personData: Person) => {
    setLoading(true);
    
    try {
      if (isNewUser) {
        await addPerson(personData);
        setNotificationData({
          showSuccessToast: true,
          successMessage: SUCCESS_MESSAGES.PERSON_CREATED
        });
        navigate("/");
      } else {
        if (person?.id) {
          await updatePerson(person.id, personData);
          showSuccess(SUCCESS_MESSAGES.PERSON_UPDATED);
        }
        navigate("/");
      }
    } catch (error) {
      let errorMessage: string = ERROR_MESSAGES.UNKNOWN_ERROR;
      
      if (error instanceof HttpError) {
        errorMessage = error.messages.join(', ');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (id && id !== "new" && !person) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pessoa não encontrada</h2>
          <p className="text-gray-600 mb-6">A pessoa que você está procurando não existe.</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Voltar para a lista
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isNewUser ? "Nova pessoa" : "Editar pessoa"}
            </h2>
            <p className="text-gray-600">
              {isNewUser ? "Cadastre uma nova pessoa no sistema" : "Atualize as informações da pessoa"}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Voltar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <PersonForm
            person={person}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            showNotification={showNotification}
            notificationType={notificationType}
            notificationMessage={notificationMessage}
            onHideNotification={() => setShowNotification(false)}
          />
        </div>
      </div>
    </Layout>
  );
}

export function meta() {
  return [
    { title: "Detalhes da Pessoa - Sistema de Pessoas" },
    { name: "description", content: "Visualizar e editar dados da pessoa" },
  ];
}

export default function UserDetail() {
  return (
    <ProtectedRoute>
      <PersonProvider>
        <UserDetailContent />
      </PersonProvider>
    </ProtectedRoute>
  );
} 