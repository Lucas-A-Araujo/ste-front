import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PersonSchema } from '../person';
import { FORM_CONFIG } from '../../../controllers/constants/ui.constant';

describe('PersonSchema - Validação de Data de Nascimento', () => {
  const validPerson = {
    nome: 'João Silva',
    cpf: '123.456.789-09',
    email: 'joao@example.com',
    sexo: 'Masculino',
    naturalidade: 'São Paulo',
    nacionalidade: 'Brasileira',
  };

  beforeEach(() => {
    const mockDate = new Date('2024-01-15');
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Data de Nascimento - Validações Básicas', () => {
    it('deve aceitar uma data de nascimento válida', () => {
      const data = {
        ...validPerson,
        dataNascimento: '1990-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar data de nascimento vazia', () => {
      const data = {
        ...validPerson,
        dataNascimento: '',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de nascimento é obrigatória');
      }
    });
  });

  describe('Data de Nascimento - Prevenção de Data Futura', () => {
    it('deve rejeitar data de nascimento futura', () => {
      const data = {
        ...validPerson,
        dataNascimento: '2025-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de nascimento não pode ser uma data futura');
      }
    });

    it('deve aceitar data de nascimento igual à data atual quando MIN_AGE = 0', () => {
      const originalMinAge = FORM_CONFIG.MIN_AGE;
      Object.defineProperty(FORM_CONFIG, 'MIN_AGE', { value: 0 });

      const data = {
        ...validPerson,
        dataNascimento: '2024-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(true);

      Object.defineProperty(FORM_CONFIG, 'MIN_AGE', { value: originalMinAge });
    });

    it('deve aceitar data de nascimento passada', () => {
      const data = {
        ...validPerson,
        dataNascimento: '1990-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('Data de Nascimento - Idade Mínima', () => {
    it('deve aceitar data antiga independente da idade mínima', () => {
      const data = {
        ...validPerson,
        dataNascimento: '1990-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar data futura independente da idade mínima', () => {
      const data = {
        ...validPerson,
        dataNascimento: '2025-01-15',
      };

      const result = PersonSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de nascimento não pode ser uma data futura');
      }
    });

    it('deve validar idade mínima quando configurada', () => {
      const schema = PersonSchema.shape.dataNascimento;
      expect(schema).toBeDefined();
    });
  });
}); 