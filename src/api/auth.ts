import { httpClient } from '@/core/http/client';
import type { AuthTokens, LoginRequest, User } from './schemas';

export const authApi = {
  login: (data: LoginRequest) => httpClient.post<AuthTokens>('/api/auth/login', data),
  logout: () => httpClient.post<void>('/api/auth/logout'),
  refresh: (refreshToken: string) =>
    httpClient.post<AuthTokens>('/api/auth/refresh', { refreshToken }),
  getUser: () => httpClient.get<User>('/api/auth/user'),
  getPermissions: () => httpClient.get<string[]>('/api/auth/permissions'),
};
