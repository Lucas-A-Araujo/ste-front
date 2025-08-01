import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../types/user";
import { UserSchema, validateCPF, formatCPF } from "../types/user";

interface UserFormProps {
  user?: User;
  onSubmit: (data: User) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<User>({
    resolver: zodResolver(UserSchema),
    defaultValues: user || {
      nome: "",
      sexo: "",
      email: "",
      dataNascimento: "",
      naturalidade: "",
      nacionalidade: "",
      cpf: "",
    },
  });

  const watchedCPF = watch("cpf");

  React.useEffect(() => {
    if (watchedCPF) {
      const formatted = formatCPF(watchedCPF);
      if (formatted !== watchedCPF) {
        setValue("cpf", formatted);
      }
    }
  }, [watchedCPF, setValue]);

  const handleFormSubmit = (data: User) => {
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
            Nome *
          </label>
          <input
            {...register("nome")}
            type="text"
            id="nome"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-red-600">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
            CPF *
          </label>
          <input
            {...register("cpf")}
            type="text"
            id="cpf"
            placeholder="000.000.000-00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700 mb-1">
            Data de Nascimento *
          </label>
          <input
            {...register("dataNascimento")}
            type="date"
            id="dataNascimento"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {user ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}; 