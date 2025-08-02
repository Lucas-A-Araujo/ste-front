import type { Person, APIPerson } from "../../domain/types/person";
import { mapAPIPersonToPerson, mapPersonToAPIPerson } from "../../domain/types/person";
import { httpClient } from "../lib/http";
import { API_CONFIG } from "../config/api";

export { HttpError } from "../lib/http";

export const personRepository = {
  async getPeople(): Promise<Person[]> {
    const apiPeople: APIPerson[] = await httpClient.get<APIPerson[]>(API_CONFIG.ENDPOINTS.PEOPLE);
    return apiPeople.map(mapAPIPersonToPerson);
  },

  async searchPeople(query: string): Promise<Person[]> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.PEOPLE}?q=${encodeURIComponent(query)}`;
    const apiPeople: APIPerson[] = await httpClient.get<APIPerson[]>(searchUrl);
    return apiPeople.map(mapAPIPersonToPerson);
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