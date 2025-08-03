import type { Person, APIPerson, PaginatedResponse, PaginationParams } from "../../domain/types/person";
import { mapAPIPersonToPerson, mapPersonToAPIPerson } from "../../domain/types/person";
import { httpClient } from "../lib/http";
import { API_CONFIG } from "../constants/api.constant";

export { HttpError } from "../lib/http";

export const personRepository = {
  async getPeople(params?: PaginationParams): Promise<PaginatedResponse<Person>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('q', params.search);
    
    const url = `${API_CONFIG.ENDPOINTS.PEOPLE}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response: PaginatedResponse<APIPerson> = await httpClient.get<PaginatedResponse<APIPerson>>(url);
    
    return {
      data: response.data.map(mapAPIPersonToPerson),
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      hasPrevious: response.hasPrevious,
      hasNext: response.hasNext
    };
  },

  async searchPeople(query: string, params?: PaginationParams): Promise<PaginatedResponse<Person>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const searchUrl = `${API_CONFIG.ENDPOINTS.PEOPLE}?${searchParams.toString()}`;
    const response: PaginatedResponse<APIPerson> = await httpClient.get<PaginatedResponse<APIPerson>>(searchUrl);
    
    return {
      data: response.data.map(mapAPIPersonToPerson),
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages,
      hasPrevious: response.hasPrevious,
      hasNext: response.hasNext
    };
  },

  async getPersonById(id: string): Promise<Person> {
    const apiPerson: APIPerson = await httpClient.get<APIPerson>(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`);
    return mapAPIPersonToPerson(apiPerson);
  },

  async createPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const apiPersonData = mapPersonToAPIPerson(person as Person);
    const createdApiPerson: APIPerson = await httpClient.post<APIPerson>(API_CONFIG.ENDPOINTS.PEOPLE, apiPersonData);
    return mapAPIPersonToPerson(createdApiPerson);
  },

  async updatePerson(id: string, person: Omit<Person, 'id'>): Promise<Person> {
    const apiPersonData = mapPersonToAPIPerson(person as Person);
    const updatedApiPerson: APIPerson = await httpClient.put<APIPerson>(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`, apiPersonData);
    return mapAPIPersonToPerson(updatedApiPerson);
  },

  async deletePerson(id: string): Promise<void> {
    await httpClient.delete(`${API_CONFIG.ENDPOINTS.PEOPLE}/${id}`);
  },
}; 