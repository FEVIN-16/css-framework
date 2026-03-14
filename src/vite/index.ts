import type { Plugin, ViteDevServer } from "vite";
import * as path from "node:path";
import { loadConfig } from "../config/loader";
import { extractTokens } from "../scanner/extractor";
import { generateCSS } from "../generator";
import type { Config } from "../config/schema";

export function framify(): Plugin {
  let config: Config;
  let configFile: string | undefined;
  let server: ViteDevServer;
  let tokens = new Set<string>();
  const virtualModuleId = "virtual:framify.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const invalidateModule = () => {
    if (server) {
      const { moduleGraph } = server;
      const mod = moduleGraph.getModuleById(resolvedVirtualModuleId);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
        // Virtual modules don't have real file URLs so the browser can't
        // hot-swap them with css-update. A full-reload is the reliable approach.
        server.ws.send({ type: "full-reload" });
      }
    }
  };

  return {
    name: "vite-plugin-framify",
    
    async configResolved() {
      const result = await loadConfig();
      config = result.config;
      configFile = result.configFile;
    },

    configureServer(_server) {
      server = _server;
      if (configFile) {
        server.watcher.add(configFile);
      }
    },

    async handleHotUpdate({ file }) {
      // Normalize paths for comparison — on Windows, Vite may use a different slash style
      const normalizedFile = path.resolve(file).toLowerCase();
      const normalizedConfig = configFile ? path.resolve(configFile).toLowerCase() : "";

      if (normalizedFile === normalizedConfig) {
        const result = await loadConfig();
        config = result.config;
        invalidateModule();
        // Return empty array to suppress Vite's default HMR for this file
        return [];
      }
    },

    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },

    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return generateCSS(tokens, config);
      }
    },

    async transform(code: string, id: string) {
      if (id.includes("node_modules")) return;
      if (!id.match(/\.(html|js|ts|jsx|tsx|vue|svelte)$/)) return;
      
      const newTokens = extractTokens(code);
      let changed = false;
      for (const token of newTokens) {
        if (!tokens.has(token)) {
          tokens.add(token);
          changed = true;
        }
      }

      if (changed) {
        invalidateModule();
      }
    },
  };
}
