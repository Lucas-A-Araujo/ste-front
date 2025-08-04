import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Person } from "../../domain/types/person";
import { PersonSchema, validateCPF, formatCPF } from "../../domain/types/person";
import { Notification } from "./Notification";
import { AutocompleteInput } from "./AutocompleteInput";
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
    
    if (validationErrors.cpf) {
      setValidationErrors(prev => ({ ...prev, cpf: "" }));
    }
  };

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
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome (obrigatório)
            </label>
            <input
              {...register("nome")}
              type="text"
              id="nome"
              onChange={(e) => {
                register("nome").onChange(e);
                handleFieldChange("nome");
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.nome ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.nome || validationErrors.nome) && (
              <p className="mt-1 text-sm text-red-600">{errors.nome?.message || validationErrors.nome}</p>
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
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.cpf || validationErrors.cpf ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.cpf || validationErrors.cpf) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.cpf?.message || validationErrors.cpf}
              </p>
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
              onChange={(e) => {
                register("email").onChange(e);
                handleFieldChange("email");
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.email || validationErrors.email) && (
              <p className="mt-1 text-sm text-red-600">{errors.email?.message || validationErrors.email}</p>
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
              max={getMaxDate()}
              onChange={(e) => {
                register("dataNascimento").onChange(e);
                handleFieldChange("dataNascimento");
              }}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.dataNascimento ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {(errors.dataNascimento || validationErrors.dataNascimento) && (
              <p className="mt-1 text-sm text-red-600">{errors.dataNascimento?.message || validationErrors.dataNascimento}</p>
            )}
          </div>

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