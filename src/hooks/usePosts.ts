import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { jsonPlaceholderService } from '../services/jsonPlaceholder';
import { Post } from '../types/user';

export const usePosts = (options?: UseQueryOptions<Post[], Error>) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: () => jsonPlaceholderService.getPosts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};