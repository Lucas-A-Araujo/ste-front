import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { APIErrorResponse } from '../../domain/types/api';
import { API_CONFIG, AUTH_CONFIG, STORAGE_KEYS } from '../constants';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public errorType: string,
    public messages: string[]
  ) {
    super(messages.join(', '));
    this.name = 'HttpError';
  }
}

const getAuthToken = (): string | null => {
  try {
    const authData = localStorage.getItem(STORAGE_KEYS.AUTH_DATA);
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.token) {
        return parsed.token;
      }
    }
    return null;
  } catch (error) {
    console.error('Erro ao acessar token de autenticação:', error);
    return null;
  }
};

const removeAuthData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_DATA);
  } catch (error) {
    console.error('Erro ao remover dados de autenticação:', error);
  }
};

class HttpClient {
  private client: AxiosInstance;
  private isRedirecting = false;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = AUTH_CONFIG.TOKEN_PREFIX + token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          const errorData = error.response.data as APIErrorResponse;
          
          if (error.response.status === 401 && !this.isRedirecting) {
            this.isRedirecting = true;
            removeAuthData();
            
            setTimeout(() => {
              if (window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              this.isRedirecting = false;
            }, 100);
          }
          
          throw new HttpError(
            errorData.statusCode,
            errorData.error,
            errorData.message
          );
        } else if (error.code === 'ECONNABORTED') {
          throw new HttpError(
            408,
            'TIMEOUT_ERROR',
            ['Timeout da requisição']
          );
        } else {
          throw new HttpError(
            500,
            'NETWORK_ERROR',
            ['Erro de conexão']
          );
        }
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }
}

export const httpClient = new HttpClient(); 