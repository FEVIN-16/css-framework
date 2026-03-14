import glob from "fast-glob";
import type { Config } from "../config/schema";

export async function scanFiles(config: Config): Promise<string[]> {
  return await glob(config.content, {
    absolute: true,
    onlyFiles: true,
  });
}
