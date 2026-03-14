import type { ThemeConfig } from "../config/schema";

export function resolveTheme(theme?: ThemeConfig): string {
  if (!theme) return "";
  
  let css = ":root {\n";
  
  const categories = {
    colors: "--color-",
    spacing: "--spacing-",
    borderRadius: "--radius-",
    fontSize: "--text-",
    maxWidth: "--max-w-",
  };

  for (const [category, prefix] of Object.entries(categories)) {
    const values = theme[category];
    if (values && typeof values === "object") {
      for (const [name, value] of Object.entries(values)) {
        const escapedName = name.replace(/\./g, "\\.");
        css += `  ${prefix}${escapedName}: ${value};\n`;
      }
    }
  }
  
  css += "}\n";
  return css;
}
