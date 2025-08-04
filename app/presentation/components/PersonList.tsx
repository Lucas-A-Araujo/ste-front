import React from "react";
import type { Person } from "../../domain/types/person";
import { formatMaskedCPF, formatDate } from "../../domain/types/person";
import { Pagination } from "./Pagination";
import noDataSvg from "../../../assets/undraw_no-data_ig65.svg";

interface PersonListProps {
  persons: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  deletingId?: string | null;
  loading?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  } | null;
  onPageChange?: (page: number) => void;
}

export const PersonList: React.FC<PersonListProps> = ({ 
  persons, 
  onEdit, 
  onDelete, 
  deletingId,
  loading = false,
  pagination,
  onPageChange
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando pessoas...</p>
      </div>
    );
  }

  if (persons.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <img 
            src={noDataSvg} 
            alt="Nenhum dado encontrado" 
            className="mx-auto h-48 w-48 text-gray-400"
          />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pessoa cadastrada</h3>
        <p className="text-gray-500">Comece adicionando uma nova pessoa ao sistema.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Nascimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sexo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {persons.map((person) => (
              <tr key={person.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{person.nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatMaskedCPF(person.cpf)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{person.email || "-"}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(person.dataNascimento)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {person.sexo || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(person)}
                    disabled={deletingId === person.id}
                    className="text-primary hover:text-primary-hover mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(person.id!)}
                    disabled={deletingId === person.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === person.id ? "Excluindo..." : "Excluir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {pagination && onPageChange && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            hasPrevious={pagination.hasPrevious}
            hasNext={pagination.hasNext}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}; 