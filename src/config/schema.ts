import type { FramifyPlugin } from "../plugins/index";

export interface Config {
  content: string[];
  theme?: ThemeConfig;
  plugins?: FramifyPlugin[];
  darkMode?: "media" | "selector" | ["selector", string];
  preflight?: boolean;
}

export interface ThemeConfig {
  colors?: Record<string, string | Record<string, string>>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  fontSize?: Record<string, string | [string, { lineHeight?: string, letterSpacing?: string }]>;
  screens?: Record<string, string>;
  [key: string]: any;
}

export function defineConfig(config: Config): Config {
  return config;
}
