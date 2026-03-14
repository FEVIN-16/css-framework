import type { FramifyPlugin } from "../plugins/index";

export interface Config {
  content: string[];
  theme?: ThemeConfig;
  plugins?: FramifyPlugin[];
}

export interface ThemeConfig {
  colors?: Record<string, string>;
  spacing?: Record<string, string>;
  [key: string]: any;
}

export function defineConfig(config: Config): Config {
  return config;
}
