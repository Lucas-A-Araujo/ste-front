import type { APIErrorResponse } from "../types/api";
import { getApiUrl, API_CONFIG } from "../config/api";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public errorType: string,
    public messages: string[]
  ) {
    super(messages.join(', '));
    this.name = 'ApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: APIErrorResponse = await response.json();
    throw new ApiError(
      errorData.statusCode,
      errorData.error,
      errorData.message
    );
  }
  
  return response.json();
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout da requisição');
    }
    throw error;
  }
};

export const referenceService = {
  async searchNationalities(query: string): Promise<string[]> {
    const searchUrl = `${getApiUrl(API_CONFIG.ENDPOINTS.NATIONALITIES)}?q=${encodeURIComponent(query)}`;
    const response = await fetchWithTimeout(searchUrl);
    return handleResponse<string[]>(response);
  },

  async searchBirthplaces(query: string): Promise<string[]> {
    const searchUrl = `${getApiUrl(API_CONFIG.ENDPOINTS.BIRTHPLACES)}?q=${encodeURIComponent(query)}`;
    const response = await fetchWithTimeout(searchUrl);
    return handleResponse<string[]>(response);
  },
}; 