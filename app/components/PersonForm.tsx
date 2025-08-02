import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Person } from "../types/person";
import { PersonSchema, validateCPF, formatCPF } from "../types/person";
import { HttpError } from "../lib/http";
import { Notification } from "./Notification";
import { AutocompleteInput } from "./AutocompleteInput";
import { referenceService } from "../services/referenceService";

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: Person) => Promise<void>;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<"success" | "error">("error");
  const [notificationMessage, setNotificationMessage] = useState("");
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<Person>({
    resolver: zodResolver(PersonSchema),
    defaultValues: person || {
      nome: "",
      sexo: "",
      email: "",
      dataNascimento: "",
      naturalidade: "",
      nacionalidade: "",
      cpf: "",
    },
  });

  const formatCPFInRealTime = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3)}`;
    } else if (limitedNumbers.length <= 9) {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}.${limitedNumbers.slice(3, 6)}.${limitedNumbers.slice(6, 9)}-${limitedNumbers.slice(9)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPFInRealTime(e.target.value);
    setValue("cpf", formattedValue);
  };

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

  const handleFormSubmit = async (data: Person) => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanCPF = data.cpf.replace(/\D/g, "");
      if (!validateCPF(cleanCPF)) {
        showError("CPF inválido!");
        setLoading(false);
        return;
      }

      await onSubmit({
        ...data,
        cpf: cleanCPF,
      });
      
      showSuccess(person ? "Pessoa atualizada com sucesso!" : "Pessoa cadastrada com sucesso!");
    } catch (error) {
      let errorMessage = 'Erro desconhecido';
      
      if (error instanceof HttpError) {
        errorMessage = error.messages.join(', ');
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const searchGenders = async (query: string): Promise<string[]> => {
    const suggestions = ["Masculino", "Feminino"];
    return suggestions.filter(gender => 
      gender.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <>
      <Notification
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        show={showNotification}
      />
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome (obrigatório)
            </label>
            <input
              {...register("nome")}
              type="text"
              id="nome"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
              CPF (obrigatório)
            </label>
            <input
              {...register("cpf")}
              type="text"
              id="cpf"
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={handleCPFChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.cpf && (
              <p className="mt-1 text-sm text-red-600">{errors.cpf.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento (obrigatório)
            </label>
            <input
              {...register("dataNascimento")}
              type="date"
              id="dataNascimento"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            {errors.dataNascimento && (
              <p className="mt-1 text-sm text-red-600">{errors.dataNascimento.message}</p>
            )}
          </div>

          <AutocompleteInput
            label="Sexo"
            placeholder="Digite para buscar..."
            value={watch("sexo") || ""}
            onChange={(value) => setValue("sexo", value)}
            onSearch={searchGenders}
            debounceDelay={100}
          />

          <AutocompleteInput
            label="Naturalidade"
            placeholder="Digite para buscar..."
            value={watch("naturalidade") || ""}
            onChange={(value) => setValue("naturalidade", value)}
            onSearch={referenceService.searchBirthplaces}
            debounceDelay={300}
          />

          <AutocompleteInput
            label="Nacionalidade"
            placeholder="Digite para buscar..."
            value={watch("nacionalidade") || ""}
            onChange={(value) => setValue("nacionalidade", value)}
            onSearch={referenceService.searchNationalities}
            debounceDelay={300}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : (person ? "Atualizar" : "Cadastrar")}
          </button>
        </div>
      </form>
    </>
  );
}; 