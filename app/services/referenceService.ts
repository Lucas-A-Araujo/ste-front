import { httpClient, HttpError } from "../lib/http";
import { API_CONFIG } from "../config/api";

export { HttpError as ApiError } from "../lib/http";

export const referenceService = {
  async searchNationalities(query: string): Promise<string[]> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.NATIONALITIES}?q=${encodeURIComponent(query)}`;
    return httpClient.get<string[]>(searchUrl);
  },

  async searchBirthplaces(query: string): Promise<string[]> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.BIRTHPLACES}?q=${encodeURIComponent(query)}`;
    return httpClient.get<string[]>(searchUrl);
  },
}; 