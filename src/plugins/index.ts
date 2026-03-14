import type { Config, ThemeConfig } from "../config/schema";

export interface UtilityRule {
  match: RegExp;
  generate: (match: string[], theme: ThemeConfig) => string;
}

export interface FramifyPlugin {
  name: string;
  setup?: (config: Config) => void;
  rules?: UtilityRule[];
}

export function createPlugin(plugin: FramifyPlugin): FramifyPlugin {
  return plugin;
}
