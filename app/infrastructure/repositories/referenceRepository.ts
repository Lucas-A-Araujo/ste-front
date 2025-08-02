import { httpClient } from "../lib/http";
import { API_CONFIG } from "../config/api";

export { HttpError } from "../lib/http";

export const referenceRepository = {
  async searchNationalities(query: string): Promise<string[]> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.NATIONALITIES}?q=${encodeURIComponent(query)}`;
    return httpClient.get<string[]>(searchUrl);
  },

  async searchBirthplaces(query: string): Promise<string[]> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.BIRTHPLACES}?q=${encodeURIComponent(query)}`;
    return httpClient.get<string[]>(searchUrl);
  },
}; 