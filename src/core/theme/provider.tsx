import { App as AntdApp, ConfigProvider } from 'antd';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { buildThemeConfig, getPreset } from '@/core/theme/presets';
import { ThemeContext, type ThemeContextValue } from '@/core/theme/use-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultPreset?: string;
}

function resolveInitialPreset(defaultPreset: string): string {
  if (typeof window === 'undefined') {
    return defaultPreset;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : defaultPreset;
}

export function ThemeProvider({
  children,
  defaultPreset = 'light',
}: ThemeProviderProps) {
  const [presetName, setPresetName] = useState(() => resolveInitialPreset(defaultPreset));

  const themeConfig = useMemo(() => buildThemeConfig(presetName), [presetName]);

  const isDark = presetName === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const setPreset = useCallback((name: string) => {
    if (getPreset(name)) {
      setPresetName(name);
    }
  }, []);

  const toggle = useCallback(() => {
    setPresetName((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      presetName,
      themeConfig,
      toggle,
      setPreset,
    }),
    [isDark, presetName, themeConfig, toggle, setPreset],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
