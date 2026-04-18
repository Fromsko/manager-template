import { httpClient } from '@/core/http/client';
import type {
  CreateUserRequest,
  PaginatedResponse,
  UpdateUserRequest,
  User,
} from './schemas';

interface UserListParams {
  limit?: number;
  offset?: number;
  sortField?: string | null;
  sortOrder?: 'ascend' | 'descend' | null;
  keyword?: string;
  role?: string;
}

export const userApi = {
  list: (params?: UserListParams) =>
    httpClient.get<PaginatedResponse<User>>('/api/users', {
      params: params as Record<string, string | number | boolean | null | undefined>,
    }),
  getById: (id: string) => httpClient.get<User>(`/api/users/${id}`),
  create: (data: CreateUserRequest) => httpClient.post<User>('/api/users', data),
  update: (id: string, data: UpdateUserRequest) =>
    httpClient.put<User>(`/api/users/${id}`, data),
  delete: (id: string) => httpClient.delete<void>(`/api/users/${id}`),
};
