import createApiService from './api';
import { Country } from '../types/country';

const createRestCountriesService = () => {
  const api = createApiService('https://restcountries.com/v3.1');

  return {
    getAllCountries: (): Promise<Country[]> => api.get<Country[]>('/all'),
    getCountryByName: (name: string): Promise<Country[]> => api.get<Country[]>(`/name/${name}`),
    getCountryByCode: (code: string): Promise<Country[]> => api.get<Country[]>(`/alpha/${code}`),
    getCountriesByRegion: (region: string): Promise<Country[]> => api.get<Country[]>(`/region/${region}`),
    getCountriesByCurrency: (currency: string): Promise<Country[]> => api.get<Country[]>(`/currency/${currency}`),
  };
};

export const restCountriesService = createRestCountriesService();