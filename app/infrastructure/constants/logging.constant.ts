export const LOGGING_CONFIG = {
  LEVELS: {
    DEVELOPMENT: ['debug', 'info', 'warn', 'error'],
    PRODUCTION: ['warn', 'error'],
  },
  
  CONTEXTS: {
    AUTH: 'AUTH',
    API: 'API',
    NAVIGATION: 'NAVIGATION',
    PERFORMANCE: 'PERFORMANCE',
    USER_ACTION: 'USER_ACTION',
    PERSON: 'PERSON',
    HTTP: 'HTTP',
  },
  
  EXTERNAL_SERVICES: {
    SENTRY_ENABLED: false,
    LOGROCKET_ENABLED: false,
    ANALYTICS_ENABLED: false,
  },
} as const; 