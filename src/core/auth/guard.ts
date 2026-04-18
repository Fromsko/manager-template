import { useAuthStore } from '@/stores/auth';

function canAccessPath(_path: string, _permissions?: string[]): boolean {
  return true;
}

export function normalizeAppPath(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}

export function checkAuth(locationPathname: string): {
  authenticated: boolean;
  hasPermission: boolean;
} {
  const { isAuthenticated, user } = useAuthStore.getState();
  if (!isAuthenticated) return { authenticated: false, hasPermission: false };

  const path = normalizeAppPath(locationPathname);
  if (path === '/403') return { authenticated: true, hasPermission: true };

  const hasPermission = canAccessPath(locationPathname, user?.permissions);
  return { authenticated: true, hasPermission };
}
