import type { ThemeConfig } from "../config/schema";

export function resolveThemeColor(colorPath: string, theme: ThemeConfig): string | null {
  if (!theme.colors) return null;
  const parts = colorPath.split("-");
  let current: any = theme.colors;
  
  for (const part of parts) {
    if (current[part] === undefined) return null;
    current = current[part];
    if (typeof current === "string") return current;
  }
  return typeof current === "string" ? current : null;
}
