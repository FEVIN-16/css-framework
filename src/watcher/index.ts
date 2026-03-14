import chokidar from "chokidar";
import type { Config } from "../config/schema.js";

export function watchFiles(config: Config, callback: (event: string, path: string) => void) {
  const watcher = chokidar.watch(config.content, {
    ignoreInitial: true,
  });

  watcher.on("all", (event, path) => {
    callback(event, path);
  });

  return watcher;
}
