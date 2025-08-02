export const API_CONFIG = {
  BASE_URL: 'http://localhost:4001',
  VERSION: 'v1',
  TIMEOUT: 10000,
  ENDPOINTS: {
    PEOPLE: '/people',
    NATIONALITIES: '/reference/nationalities',
    BIRTHPLACES: '/reference/birthplaces',
  },
} as const; 