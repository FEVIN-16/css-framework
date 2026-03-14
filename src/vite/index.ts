import type { Plugin, ViteDevServer } from "vite";
import { loadConfig } from "../config/loader";
import { extractTokens } from "../scanner/extractor";
import { generateCSS } from "../generator";
import type { Config } from "../config/schema";

export function framify(): Plugin {
  let config: Config;
  let server: ViteDevServer;
  let tokens = new Set<string>();
  const virtualModuleId = "virtual:framify.css";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;

  return {
    name: "vite-plugin-framify",
    
    async configResolved() {
      config = await loadConfig();
    },

    configureServer(_server) {
      server = _server;
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

      if (changed && server) {
        // Trigger reload of the virtual CSS module
        const { moduleGraph } = server;
        const mod = moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({
            type: "update",
            updates: [{
              type: "css-update",
              path: virtualModuleId,
              acceptedPath: virtualModuleId,
              timestamp: Date.now()
            }]
          });
        }
      }
    },
  };
}
