import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { APIErrorResponse } from '../types/api';
import { API_CONFIG } from '../config/api';

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

class HttpClient {
  private client: AxiosInstance;

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