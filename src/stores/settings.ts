import { createPersistentStore } from './createPersistentStore';

interface SettingsState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  themePreset: string;
  locale: string;

  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setThemePreset: (preset: string) => void;
  setLocale: (locale: string) => void;
}

export const useSettingsStore = createPersistentStore<SettingsState>(
  (set) => ({
    darkMode:
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false,
    sidebarCollapsed: false,
    themePreset: 'light',
    locale: 'zh-CN',

    setDarkMode: (dark) =>
      set({ darkMode: dark, themePreset: dark ? 'dark' : 'light' }),
    toggleDarkMode: () =>
      set((s) => ({
        darkMode: !s.darkMode,
        themePreset: !s.darkMode ? 'dark' : 'light',
      })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    toggleSidebar: () =>
      set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setThemePreset: (preset) => set({ themePreset: preset }),
    setLocale: (locale) => set({ locale }),
  }),
  {
    name: 'settings-storage',
  },
);
