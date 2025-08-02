import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Person } from "../types/person";
import { PersonSchema, validateCPF, formatCPF } from "../types/person";

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: Person) => void;
  onCancel: () => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ person, onSubmit, onCancel }) => {
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

  const handleFormSubmit = (data: Person) => {
    const cleanCPF = data.cpf.replace(/\D/g, "");
    if (!validateCPF(cleanCPF)) {
      alert("CPF inválido!");
      return;
    }

    onSubmit({
      ...data,
      cpf: cleanCPF,
    });
  };

  return (
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

        <div>
          <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-1">
            Sexo
          </label>
          <select
            {...register("sexo")}
            id="sexo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Selecione...</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>

        <div>
          <label htmlFor="naturalidade" className="block text-sm font-medium text-gray-700 mb-1">
            Naturalidade
          </label>
          <input
            {...register("naturalidade")}
            type="text"
            id="naturalidade"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="nacionalidade" className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidade
          </label>
          <input
            {...register("nacionalidade")}
            type="text"
            id="nacionalidade"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {person ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}; 