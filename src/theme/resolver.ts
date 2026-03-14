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
    screens: "--screen-",
    zIndex: "--z-",
    opacity: "--opacity-",
    fontFamily: "--font-",
  };

  const flatten = (obj: any, prefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      const escapedKey = key.replace(/\./g, "\\.");
      const currentPrefix = `${prefix}${escapedKey}`;
      
      if (value && typeof value === "object" && !Array.isArray(value)) {
        flatten(value, `${currentPrefix}-`);
      } else if (Array.isArray(value)) {
        if (typeof value[0] === "string" && (typeof value[1] !== "object" || value[1] === null)) {
          // Join with commas for things like fontFamily
          css += `  ${currentPrefix}: ${value.join(", ")};\n`;
        } else {
          // Handle fontSize: [size, { lineHeight }]
          css += `  ${currentPrefix}: ${value[0]};\n`;
          if (value[1] && typeof value[1] === "object") {
            if (value[1].lineHeight) {
              css += `  ${currentPrefix}-lh: ${value[1].lineHeight};\n`;
            }
            if (value[1].letterSpacing) {
              css += `  ${currentPrefix}-ls: ${value[1].letterSpacing};\n`;
            }
          }
        }
      } else {
        css += `  ${currentPrefix}: ${value};\n`;
      }
    }
  };

  for (const [category, prefix] of Object.entries(categories)) {
    const values = theme[category];
    if (values && typeof values === "object") {
      flatten(values, prefix);
    }
  }
  
  css += "}\n";
  return css;
}
