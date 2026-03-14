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
  const fileTokens = new Map<string, Set<string>>();
  const virtualModuleId = "virtual:framify.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  const invalidateModule = () => {
    if (server) {
      const { moduleGraph } = server;
      const mod = moduleGraph.getModuleById(resolvedVirtualModuleId);
      if (mod) {
        server.moduleGraph.invalidateModule(mod);
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
      
      // Handle file deletions to purge tokens
      server.watcher.on("unlink", (file) => {
        const normalizedFile = path.resolve(file);
        if (fileTokens.has(normalizedFile)) {
          fileTokens.delete(normalizedFile);
          invalidateModule();
        }
      });
    },

    async handleHotUpdate({ file }) {
      const normalizedFile = path.resolve(file).toLowerCase();
      const normalizedConfig = configFile ? path.resolve(configFile).toLowerCase() : "";

      if (normalizedFile === normalizedConfig) {
        const result = await loadConfig();
        config = result.config;
        invalidateModule();
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
        const allTokens = new Set<string>();
        for (const tokens of fileTokens.values()) {
          for (const token of tokens) {
            allTokens.add(token);
          }
        }
        return generateCSS(allTokens, config);
      }
    },

    async transform(code: string, id: string) {
      if (id.includes("node_modules")) return;
      if (!id.match(/\.(html|js|ts|jsx|tsx|vue|svelte)$/)) return;
      
      const newTokens = extractTokens(code);
      const oldTokens = fileTokens.get(id);

      // Check if tokens changed for this file
      const changed = !oldTokens || 
        newTokens.size !== oldTokens.size || 
        [...newTokens].some(t => !oldTokens.has(t));

      if (changed) {
        fileTokens.set(id, newTokens);
        invalidateModule();
      }
    },
  };
}
