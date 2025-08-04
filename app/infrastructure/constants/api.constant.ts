// Configurações da API REST
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001',
  VERSION: 'v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: '/auth/login',
    PEOPLE: '/people',
    NATIONALITIES: '/reference/nationalities',
    BIRTHPLACES: '/reference/birthplaces',
  },
} as const;

export const AUTH_CONFIG = {
  TOKEN_PREFIX: 'Bearer ',
  TOKEN_LOG_PREFIX: 'Token salvo no localStorage: ',
} as const; 