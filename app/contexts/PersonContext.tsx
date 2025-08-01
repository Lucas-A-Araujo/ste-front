import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Person } from "../types/person";

interface PersonContextType {
  persons: Person[];
  addPerson: (person: Person) => void;
  updatePerson: (id: string, person: Person) => void;
  deletePerson: (id: string) => void;
  getPersonById: (id: string) => Person | undefined;
  isCPFUnique: (cpf: string, excludeId?: string) => boolean;
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

  const addPerson = (person: Person) => {
    const newPerson = {
      ...person,
      id: Date.now().toString(),
    };
    setPersons(prev => [...prev, newPerson]);
  };

  const updatePerson = (id: string, updatedPerson: Person) => {
    setPersons(prev => 
      prev.map(person => 
        person.id === id ? { ...updatedPerson, id } : person
      )
    );
  };

  const deletePerson = (id: string) => {
    setPersons(prev => prev.filter(person => person.id !== id));
  };

  const getPersonById = (id: string) => {
    return persons.find(person => person.id === id);
  };

  const isCPFUnique = (cpf: string, excludeId?: string) => {
    return !persons.some(person => 
      person.cpf === cpf && person.id !== excludeId
    );
  };

  const value: PersonContextType = {
    persons,
    addPerson,
    updatePerson,
    deletePerson,
    getPersonById,
    isCPFUnique,
  };

  return (
    <PersonContext.Provider value={value}>
      {children}
    </PersonContext.Provider>
  );
}; 