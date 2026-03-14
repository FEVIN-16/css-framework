import { loadConfig } from "../config/loader";
import { watchFiles } from "../watcher";
import { build } from "./build";

export async function dev() {
  const config = await loadConfig();
  console.log("Framify: Starting watch mode...");
  
  // Initial build
  await build();
  
  watchFiles(config, async (event, path) => {
    console.log(`Framify: File ${event} - ${path}. Rebuilding...`);
    await build();
  });
}
