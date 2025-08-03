export const NOTIFICATION_CONFIG = {
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
  },
} as const;

export const DEBOUNCE_CONFIG = {
  SEARCH: 500,
  REFERENCE_SEARCH: 300,
  GENDER_SEARCH: 100,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_VISIBLE_PAGES: 5,
} as const;

export const FORM_CONFIG = {
  CPF_MAX_LENGTH: 14,
  CPF_MASK: '000.000.000-00',
} as const; 