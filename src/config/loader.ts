import * as path from "node:path";
import * as fs from "node:fs/promises";
import { createJiti } from "jiti";
import type { Config } from "./schema";
import { DEFAULT_THEME } from "../theme/default";


function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export async function loadConfig(cwd: string = process.cwd()): Promise<{ config: Config, configFile: string | undefined }> {
  const configFiles = [
    "framify.config.ts",
    "framify.config.js",
    "framify.config.mjs",
    "framify.config.cjs",
  ];

  let userConfig: Partial<Config> = {};

  // Create a fresh jiti instance on every call so the module cache is not reused.
  // This ensures that re-importing the config file always picks up the latest changes.
  const jiti = createJiti(import.meta.url, { moduleCache: false });

  let configFile: string | undefined;
  for (const file of configFiles) {
    const filePath = path.resolve(cwd, file);
    try {
      await fs.access(filePath);
      configFile = filePath;
      // use jiti for universal loading (TS, ESM, CJS)
      const module = await jiti.import(filePath) as any;
      userConfig = module.default || module;
      break;
    } catch {
      continue;
    }
  }

  // Handle theme merging with 'extend' support
  const baseTheme = { ...DEFAULT_THEME };
  const userTheme = userConfig.theme || {};

  // 1. If user provided a top-level theme (not inside extend), it overrides defaults
  const theme = deepMerge(baseTheme, { ...userTheme });
  delete (theme as any).extend;

  // 2. If user provided 'extend', merge those into the theme
  if (userTheme.extend) {
    deepMerge(theme, userTheme.extend);
  }

  const config: Config = {
    content: userConfig.content || ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
    theme,
    plugins: userConfig.plugins || [],
  };

  return { config, configFile };
}
