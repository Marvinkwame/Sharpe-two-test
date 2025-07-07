// src/hooks/useComments.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jsonPlaceholderService } from '../services/jsonPlaceholder';
import { Comment } from '../types/user';

export const useComments = (options?: UseQueryOptions<Comment[], Error>) => {
  return useQuery<Comment[], Error>({
    queryKey: ['comments'],
    queryFn: () => jsonPlaceholderService.getComments(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};