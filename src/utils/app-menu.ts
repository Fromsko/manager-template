interface AppMenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  permissions?: string[];
  children?: AppMenuItem[];
}

export const APP_MENU_TREE: AppMenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: 'LayoutDashboard',
    path: '/dashboard',
  },
  {
    key: 'users',
    label: '用户管理',
    icon: 'Users',
    path: '/users',
    permissions: ['user:read'],
  },
  {
    key: 'system',
    label: '系统管理',
    icon: 'Settings',
    children: [
      {
        key: 'settings',
        label: '系统设置',
        icon: 'Settings',
        path: '/settings',
        permissions: ['system:settings'],
      },
    ],
  },
];

export function filterMenuTreeByPermissions(
  tree: AppMenuItem[],
  permissions: string[],
): AppMenuItem[] {
  return tree
    .map((item) => {
      if (item.children) {
        const filteredChildren = filterMenuTreeByPermissions(item.children, permissions);
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }
      if (item.permissions && item.permissions.length > 0) {
        const hasPermission = item.permissions.some((p) => permissions.includes(p));
        if (!hasPermission) return null;
      }
      return item;
    })
    .filter(Boolean) as AppMenuItem[];
}

function collectPathPermissions(tree: AppMenuItem[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  function walk(items: AppMenuItem[]) {
    for (const item of items) {
      if (item.path && item.permissions) {
        map.set(normalizeAppPath(item.path), item.permissions);
      }
      if (item.children) walk(item.children);
    }
  }
  walk(tree);
  return map;
}

export function normalizeAppPath(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

export function canAccessPath(pathname: string, permissions?: string[]): boolean {
  if (!permissions) return false;
  const pathPermMap = collectPathPermissions(APP_MENU_TREE);
  const normalized = normalizeAppPath(pathname);
  const required = pathPermMap.get(normalized);
  if (!required || required.length === 0) return true;
  return required.some((p) => permissions.includes(p));
}
