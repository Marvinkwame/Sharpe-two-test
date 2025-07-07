import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { exchangeRateService } from '../services/exchangeRate';
import { ExchangeRateType } from '../types/country';

export const useExchangeRates = (
  baseCurrency = 'USD',
  options?: UseQueryOptions<ExchangeRateType, Error>
) => {
  return useQuery<ExchangeRateType, Error>({
    queryKey: ['exchangeRates', baseCurrency], 
    queryFn: () => exchangeRateService.getLatestRates(baseCurrency),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (cacheTime renamed to gcTime in v5)
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    ...options,
  });
};


