import createApiService from './api';
import { User, Post, Comment } from '../types/user';

const createJsonPlaceholderService = () => {
  const api = createApiService('https://jsonplaceholder.typicode.com');

  return {
    getUsers: (): Promise<User[]> => api.get<User[]>('/users'),
    getUser: (id: number): Promise<User> => api.get<User>(`/users/${id}`),
    getPosts: (): Promise<Post[]> => api.get<Post[]>('/posts'),
    getPost: (id: number): Promise<Post> => api.get<Post>(`/posts/${id}`),
    getUserPosts: (userId: number): Promise<Post[]> => api.get<Post[]>(`/users/${userId}/posts`),
    getComments: (): Promise<Comment[]> => api.get<Comment[]>('/comments'),
    getPostComments: (postId: number): Promise<Comment[]> => api.get<Comment[]>(`/posts/${postId}/comments`),
  };
};

export const jsonPlaceholderService = createJsonPlaceholderService();