import { z } from "zod";

export const PersonSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  sexo: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  naturalidade: z.string().optional(),
  nacionalidade: z.string().optional(),
  cpf: z.string().min(1, "CPF é obrigatório"),
});

export type Person = z.infer<typeof PersonSchema>;

export interface APIPerson {
  id: number;
  name: string;
  gender: string;
  email: string;
  birthDate: string;
  naturalness: string;
  nationality: string;
  cpf: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export const mapAPIPersonToPerson = (apiPerson: APIPerson): Person => {
  return {
    id: apiPerson.id.toString(),
    nome: apiPerson.name,
    sexo: apiPerson.gender, 
    email: apiPerson.email || "",
    dataNascimento: apiPerson.birthDate.split('T')[0], 
    naturalidade: apiPerson.naturalness || "",
    nacionalidade: apiPerson.nationality || "",
    cpf: apiPerson.cpf,
  };
};

export const mapPersonToAPIPerson = (person: Person): Omit<APIPerson, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    name: person.nome,
    gender: person.sexo || "",
    email: person.email || "",
    birthDate: person.dataNascimento,
    naturalness: person.naturalidade || "",
    nationality: person.nacionalidade || "",
    cpf: person.cpf,
  };
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, "");
  
  if (cleanCPF.length !== 11) return false;
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, "");
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

export const formatDate = (date: string): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}; 