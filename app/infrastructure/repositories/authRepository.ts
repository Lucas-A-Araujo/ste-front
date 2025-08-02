import type { LoginRequest, LoginResponse } from "../../domain/types/auth";
import { httpClient } from "../lib/http";
import { API_CONFIG } from "../config/api";

export const authRepository = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: LoginResponse = await httpClient.post<LoginResponse>(
      API_CONFIG.ENDPOINTS.AUTH,
      credentials
    );
    return response;
  },
}; 