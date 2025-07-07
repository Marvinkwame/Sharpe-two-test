import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jsonPlaceholderService } from '../services/jsonPlaceholder';
import { User } from '../types/user';


export const useUsers = (options?: UseQueryOptions<User[], Error>) => {
  return useQuery<User[], Error>({
    queryKey: ['users'], 
    queryFn: () => jsonPlaceholderService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
    ...options,
  });
};

