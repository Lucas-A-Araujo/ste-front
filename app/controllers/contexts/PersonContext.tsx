import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Person } from "../../domain/types/person";
import { personRepository } from "../../infrastructure/repositories/personRepository";
import { useApi } from "../hooks/useApi";

interface PersonContextType {
  persons: Person[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
  addPerson: (person: Omit<Person, 'id'>) => Promise<void>;
  updatePerson: (id: string, person: Omit<Person, 'id'>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  searchPeople: (query: string) => Promise<void>;
  getPersonById: (id: string) => Person | undefined;
  isCPFUnique: (cpf: string, excludeId?: string) => boolean;
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
  const [initialLoading, setInitialLoading] = useState(true);
  const { loading, error, execute } = useApi<Person[]>();

  const loadPersons = useCallback(async () => {
    try {
      const data = await execute(() => personRepository.getPeople());
      setPersons(data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [execute]);

  const searchPeople = useCallback(async (query: string) => {
    if (!query.trim()) {
      await loadPersons();
      return;
    }

    setSearchLoading(true);
    try {
      const data = await personRepository.searchPeople(query);
      setPersons(data);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      await loadPersons();
    } finally {
      setSearchLoading(false);
    }
  }, [loadPersons]);

  useEffect(() => {
    loadPersons();
  }, [loadPersons]);

  const addPerson = useCallback(async (person: Omit<Person, 'id'>) => {
    try {
      const newPerson = await personRepository.createPerson(person);
      setPersons(prev => [...prev, newPerson]);
    } catch (error) {
      throw error;
    }
  }, []);

  const updatePerson = useCallback(async (id: string, updatedPerson: Omit<Person, 'id'>) => {
    try {
      const updated = await personRepository.updatePerson(id, updatedPerson);
      setPersons(prev => 
        prev.map(person => 
          person.id === id ? updated : person
        )
      );
    } catch (error) {
      throw error;
    }
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    try {
      await personRepository.deletePerson(id);
      setPersons(prev => prev.filter(person => person.id !== id));
    } catch (error) {
      throw error;
    }
  }, []);

  const getPersonById = useCallback((id: string) => {
    return persons.find(person => person.id === id);
  }, [persons]);

  const isCPFUnique = useCallback((cpf: string, excludeId?: string) => {
    return !persons.some(person => 
      person.cpf === cpf && person.id !== excludeId
    );
  }, [persons]);

  const refreshPersons = useCallback(async () => {
    await loadPersons();
  }, [loadPersons]);

  const value: PersonContextType = {
    persons,
    loading: loading || initialLoading,
    searchLoading,
    error,
    addPerson,
    updatePerson,
    deletePerson,
    searchPeople,
    getPersonById,
    isCPFUnique,
    refreshPersons,
  };

  return (
    <PersonContext.Provider value={value}>
      {children}
    </PersonContext.Provider>
  );
}; 