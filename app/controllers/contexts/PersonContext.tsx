import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Person, PaginatedResponse, PaginationParams } from "../../domain/types/person";
import { personRepository } from "../../infrastructure/repositories/personRepository";
import { useApi } from "../hooks/useApi";

interface PersonContextType {
  persons: Person[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  } | null;
  currentSearch: string;
  addPerson: (person: Omit<Person, 'id'>) => Promise<void>;
  updatePerson: (id: string, person: Omit<Person, 'id'>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  searchPeople: (query: string, page?: number) => Promise<void>;
  loadPeople: (page?: number) => Promise<void>;
  getPersonById: (id: string) => Person | undefined;
  refreshPersons: () => Promise<void>;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export const usePersons = () => {
  const context = useContext(PersonContext);
  if (!context) {
    throw new Error("usePersons deve ser usado dentro de um PersonProvider");
  }
  return context;
};

interface PersonProviderProps {
  children: ReactNode;
}

export const PersonProvider: React.FC<PersonProviderProps> = ({ children }) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  } | null>(null);
  const [currentSearch, setCurrentSearch] = useState("");
  const { loading, error, execute } = useApi<PaginatedResponse<Person>>();
  const { execute: executePerson } = useApi<Person>();

  const loadPeople = useCallback(async (page: number = 1) => {
    try {
      const params: PaginationParams = {
        page,
        limit: 10, // Itens por página
        search: undefined // Sempre carregar todas as pessoas
      };
      
      const data = await execute(() => personRepository.getPeople(params));
      setPersons(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext
      });
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [execute]);

  const searchPeople = useCallback(async (query: string, page: number = 1) => {
    setCurrentSearch(query);
    
    if (!query.trim()) {
      setCurrentSearch("");
      await loadPeople(page);
      return;
    }

    setSearchLoading(true);
    try {
      const params: PaginationParams = {
        page,
        limit: 10,
        search: query
      };
      
      const data = await execute(() => personRepository.searchPeople(query, params));
      setPersons(data.data);
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext
      });
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      await loadPeople(page);
    } finally {
      setSearchLoading(false);
    }
  }, [execute, loadPeople]);

  const addPerson = useCallback(async (person: Omit<Person, 'id'>) => {
    try {
      const newPerson = await executePerson(() => personRepository.createPerson(person));
      setPersons(prev => [...prev, newPerson]);
      // Atualizar contagem total
      if (pagination) {
        setPagination(prev => prev ? { ...prev, total: prev.total + 1 } : null);
      }
    } catch (error) {
      throw error;
    }
  }, [pagination, executePerson]);

  const updatePerson = useCallback(async (id: string, updatedPerson: Omit<Person, 'id'>) => {
    try {
      const updated = await executePerson(() => personRepository.updatePerson(id, updatedPerson));
      setPersons(prev => 
        prev.map(person => 
          person.id === id ? updated : person
        )
      );
    } catch (error) {
      throw error;
    }
  }, [executePerson]);

  const deletePerson = useCallback(async (id: string) => {
    try {
      await executePerson(() => personRepository.deletePerson(id));
      setPersons(prev => prev.filter(person => person.id !== id));
      // Atualizar contagem total
      if (pagination) {
        setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : null);
      }
    } catch (error) {
      throw error;
    }
  }, [pagination, executePerson]);

  const getPersonById = useCallback((id: string) => {
    return persons.find(person => person.id === id);
  }, [persons]);

  const refreshPersons = useCallback(async () => {
    if (currentSearch) {
      await searchPeople(currentSearch, pagination?.page || 1);
    } else {
      await loadPeople(pagination?.page || 1);
    }
  }, [currentSearch, pagination?.page, searchPeople, loadPeople]);

  const value: PersonContextType = {
    persons,
    loading: loading || initialLoading,
    searchLoading,
    error,
    pagination,
    currentSearch,
    addPerson,
    updatePerson,
    deletePerson,
    searchPeople,
    loadPeople,
    getPersonById,
    refreshPersons,
  };

  return (
    <PersonContext.Provider value={value}>
      {children}
    </PersonContext.Provider>
  );
}; 