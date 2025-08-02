import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  sexo: z.string().nullable().optional(),
  email: z.string().email("E-mail inválido").nullable().optional().or(z.literal("")),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  naturalidade: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  cpf: z.string().min(1, "CPF é obrigatório").refine((cpf) => {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    return true;
  }, "CPF inválido"),
});

export type Person = z.infer<typeof PersonSchema>;

export interface APIPerson {
  id: number;
  name: string;
  gender?: string | null;
  email?: string | null;
  birthDate: string;
  naturalness?: string | null;
  nationality?: string | null;
  cpf: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mapAPIPersonToPerson = (apiPerson: APIPerson): Person => {
  return {
    id: apiPerson.id.toString(),
    nome: apiPerson.name,
    sexo: apiPerson.gender || "", 
    email: apiPerson.email || "",
    dataNascimento: apiPerson.birthDate.split('T')[0], 
    naturalidade: apiPerson.naturalness || "",
    nacionalidade: apiPerson.nationality || "",
    cpf: formatCPF(apiPerson.cpf), 
  };
};

export const mapPersonToAPIPerson = (person: Person): Omit<APIPerson, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    name: person.nome,
    gender: person.sexo || null,
    email: person.email || null,
    birthDate: person.dataNascimento,
    naturalness: person.naturalidade || null,
    nationality: person.nacionalidade || null,
    cpf: person.cpf, 
  };
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  
  if (cleanCPF.length !== 11) return false;
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  return true;
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, "");
  
  // Aplica formatação progressiva conforme o usuário digita
  if (cleanCPF.length <= 3) {
    return cleanCPF;
  } else if (cleanCPF.length <= 6) {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`;
  } else if (cleanCPF.length <= 9) {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`;
  } else {
    return `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9, 11)}`;
  }
};

export const formatDate = (date: string): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

// Tipos para paginação - estrutura correta da API
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
} 