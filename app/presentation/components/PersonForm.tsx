import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Person } from "../../domain/types/person";
import { PersonSchema, validateCPF } from "../../domain/types/person";
import { Notification } from "./Notification";
import { BaseInput, AutocompleteInput } from "./inputs";
import { referenceRepository } from "../../infrastructure/repositories/referenceRepository";
import { FORM_CONFIG } from "../../controllers/constants/ui.constant";

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: Person) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  showNotification?: boolean;
  notificationType?: "success" | "error";
  notificationMessage?: string;
  onHideNotification?: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ 
  person, 
  onSubmit, 
  onCancel,
  loading = false,
  showNotification = false,
  notificationType = "error",
  notificationMessage = "",
  onHideNotification
}) => {
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  const getMaxDate = () => {
    const today = new Date();
    if (FORM_CONFIG.MIN_AGE <= 0) {
      return today.toISOString().split('T')[0];
    }
    
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - FORM_CONFIG.MIN_AGE);
    return maxDate.toISOString().split('T')[0];
  };

  const { register, handleSubmit, formState: { errors }, watch, setValue, setError, trigger } = useForm<Person>({
    resolver: zodResolver(PersonSchema),
    mode: "onSubmit",
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

  const handleFieldChange = (field: keyof Person) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFormSubmit = async (data: Person) => {
    setValidationErrors({});
    
    const newErrors: { [key: string]: string } = {};
    
    const cleanCPF = data.cpf.replace(/\D/g, "");
    if (!validateCPF(cleanCPF)) {
      newErrors.cpf = "CPF inválido!";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      
      Object.keys(newErrors).forEach(field => {
        setError(field as keyof Person, { type: "manual", message: newErrors[field] });
      });
      
      return;
    }

    try {
      await onSubmit(data); 
    } catch (error) {
      console.error('Erro no formulário:', error);
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
        onClose={onHideNotification || (() => {})}
        show={showNotification}
      />
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseInput
            id="nome"
            name="nome"
            label="Nome"
            type="text"
            placeholder="Digite o nome completo"
            value={watch("nome") || ""}
            onChange={(e) => {
              register("nome").onChange(e);
              handleFieldChange("nome");
            }}
            error={errors.nome?.message || validationErrors.nome}
            required
            showRequiredIndicator
          />

          <BaseInput
            id="cpf"
            name="cpf"
            label="CPF"
            type="cpf"
            placeholder="000.000.000-00"
            value={watch("cpf") || ""}
            onChange={(e) => {
              register("cpf").onChange(e);
              handleFieldChange("cpf");
            }}
            error={errors.cpf?.message || validationErrors.cpf}
            required
            showRequiredIndicator
          />

          <BaseInput
            id="email"
            name="email"
            label="E-mail"
            type="email"
            placeholder="Digite o e-mail"
            value={watch("email") || ""}
            onChange={(e) => {
              register("email").onChange(e);
              handleFieldChange("email");
            }}
            error={errors.email?.message || validationErrors.email}
          />

          <BaseInput
            id="dataNascimento"
            name="dataNascimento"
            label="Data de Nascimento"
            type="date"
            value={watch("dataNascimento") || ""}
            onChange={(e) => {
              register("dataNascimento").onChange(e);
              handleFieldChange("dataNascimento");
            }}
            error={errors.dataNascimento?.message || validationErrors.dataNascimento}
            max={getMaxDate()}
            required
            showRequiredIndicator
          />

          <AutocompleteInput
            label="Sexo"
            placeholder="Digite para buscar..."
            value={watch("sexo") || ""}
            onChange={(value) => {
              setValue("sexo", value);
              handleFieldChange("sexo");
            }}
            onSearch={searchGenders}
            debounceDelay={100}
            error={validationErrors.sexo}
          />

          <AutocompleteInput
            label="Naturalidade"
            placeholder="Digite para buscar..."
            value={watch("naturalidade") || ""}
            onChange={(value) => {
              setValue("naturalidade", value);
              handleFieldChange("naturalidade");
            }}
            onSearch={referenceRepository.searchBirthplaces}
            debounceDelay={300}
            error={validationErrors.naturalidade}
          />

          <AutocompleteInput
            label="Nacionalidade"
            placeholder="Digite para buscar..."
            value={watch("nacionalidade") || ""}
            onChange={(value) => {
              setValue("nacionalidade", value);
              handleFieldChange("nacionalidade");
            }}
            onSearch={referenceRepository.searchNationalities}
            debounceDelay={300}
            error={validationErrors.nacionalidade}
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