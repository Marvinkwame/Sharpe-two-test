import createApiService from './api';
import { ExchangeRate } from '../types/exchangeRate';

const createExchangeRateService = () => {
  const api = createApiService('https://api.exchangerate-api.com/v4');

  return {
    getLatestRates: (baseCurrency = 'USD'): Promise<ExchangeRate> => 
      api.get<ExchangeRate>(`/latest/${baseCurrency}`),
    // getHistoricalRates: (baseCurrency: string, date: string): Promise<ExchangeRate> => 
    //   api.get<ExchangeRate>(`/history/${baseCurrency}/${date}`),
    convertCurrency: async (
      amount: number,
      fromCurrency: string,
      toCurrency: string
    ): Promise<number> => {
      const rates = await api.get<ExchangeRate>(`/latest/${fromCurrency}`);
      const rate = rates.rates[toCurrency];
      
      if (!rate) {
        throw new Error(`Exchange rate not found for ${toCurrency}`);
      }
      
      return amount * rate;
    },
  };
};

export const exchangeRateService = createExchangeRateService();