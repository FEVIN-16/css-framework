import * as fs from "node:fs/promises";
import * as path from "node:path";
import { loadConfig } from "../config/loader";
import { scanFiles } from "../scanner";
import { extractTokens } from "../scanner/extractor";
import { generateCSS } from "../generator";

export async function build() {
  const config = await loadConfig();
  const files = await scanFiles(config);
  const allTokens = new Set<string>();
  
  for (const file of files) {
    const content = await fs.readFile(file, "utf-8");
    const tokens = extractTokens(content);
    tokens.forEach(t => allTokens.add(t));
  }
  
  const css = generateCSS(allTokens, config);
  const outDir = path.join(process.cwd(), "dist");
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "framify.css"), css);
  
  console.log("Framify: CSS built successfully!");
}
