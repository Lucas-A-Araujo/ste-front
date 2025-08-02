export type APIErrorType = 
  | 'ROUTE_NOT_FOUND'
  | 'RESOURCE_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'PERSON_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INVALID_CPF'
  | 'INVALID_EMAIL'
  | 'REQUIRED_FIELD'
  | 'CONFLICT_ERROR'
  | 'PERSON_ALREADY_EXISTS'
  | 'EMAIL_ALREADY_EXISTS'
  | 'INTERNAL_SERVER_ERROR'
  | 'DATABASE_ERROR'
  | 'UNKNOWN_ERROR';

export interface APIErrorResponse {
  statusCode: number;
  error: APIErrorType;
  message: string[];
  timestamp: string;
  path: string;
}

export interface APIResponse<T> {
  data?: T;
  error?: APIErrorResponse;
}

export const API_ERROR_MESSAGES: Record<APIErrorType, string> = {
  ROUTE_NOT_FOUND: 'Rota não encontrada',
  RESOURCE_NOT_FOUND: 'Recurso não encontrado',
  USER_NOT_FOUND: 'Usuário não encontrado',
  PERSON_NOT_FOUND: 'Pessoa não encontrada',
  VALIDATION_ERROR: 'Erro de validação',
  INVALID_CPF: 'CPF inválido',
  INVALID_EMAIL: 'E-mail inválido',
  REQUIRED_FIELD: 'Campo obrigatório não preenchido',
  CONFLICT_ERROR: 'Conflito de dados',
  PERSON_ALREADY_EXISTS: 'Pessoa já existe',
  EMAIL_ALREADY_EXISTS: 'E-mail já existe',
  INTERNAL_SERVER_ERROR: 'Erro interno do servidor',
  DATABASE_ERROR: 'Erro no banco de dados',
  UNKNOWN_ERROR: 'Erro desconhecido',
};

export const getErrorMessage = (errorResponse: APIErrorResponse): string => {
  if (errorResponse.error === 'UNKNOWN_ERROR') {
    return errorResponse.message[0] || API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
  }
  
  return API_ERROR_MESSAGES[errorResponse.error] || API_ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}; 