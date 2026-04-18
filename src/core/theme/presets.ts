import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

import { sharedComponentTokens, sharedTokens } from '@/core/theme/tokens';

export interface ThemePreset {
  name: string;
  label: string;
  algorithm: ThemeConfig['algorithm'];
  token: ThemeConfig['token'];
  components?: ThemeConfig['components'];
}

const lightPreset: ThemePreset = {
  name: 'light',
  label: 'Light',
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    colorBgBase: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgContainer: '#ffffff',
  },
};

const darkPreset: ThemePreset = {
  name: 'dark',
  label: 'Dark',
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    colorBgBase: '#141414',
    colorBgLayout: '#000000',
    colorBgContainer: '#141414',
  },
};

const presetRegistry = new Map<string, ThemePreset>();

presetRegistry.set('light', lightPreset);
presetRegistry.set('dark', darkPreset);

export function registerPreset(preset: ThemePreset): void {
  presetRegistry.set(preset.name, preset);
}

export function getPreset(name: string): ThemePreset | undefined {
  return presetRegistry.get(name);
}

export function getAllPresets(): ThemePreset[] {
  return [...presetRegistry.values()];
}

function mergeComponents(
  base: NonNullable<ThemeConfig['components']>,
  preset: ThemeConfig['components'],
): ThemeConfig['components'] {
  if (!preset) {
    return { ...base };
  }
  const merged: ThemeConfig['components'] = { ...base };
  for (const key of Object.keys(preset) as (keyof typeof preset)[]) {
    const basePart = merged[key];
    const presetPart = preset[key];
    merged[key] = { ...(basePart as object), ...(presetPart as object) } as never;
  }
  return merged;
}

export function buildThemeConfig(presetName: string): ThemeConfig {
  const preset = getPreset(presetName);
  if (!preset) {
    return {
      token: { ...sharedTokens },
      components: { ...sharedComponentTokens },
    };
  }
  return {
    algorithm: preset.algorithm,
    token: { ...sharedTokens, ...preset.token },
    components: mergeComponents(
      sharedComponentTokens as NonNullable<ThemeConfig['components']>,
      preset.components,
    ),
  };
}
