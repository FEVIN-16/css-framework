import type { ThemeConfig } from "../../config/schema";

export const colorRules = {
  match: /^(text|bg)-(.+)$/,
  generate: (matches: string[], theme: ThemeConfig) => {
    const [, type, color] = matches;
    if (!color) return "";
    const prop = type === "text" ? "color" : "background-color";
    const themeValue = theme.colors?.[color] 
      ? `var(--color-${color.replace(/\./g, "\\.")})` 
      : color;
    return `${prop}: ${themeValue};`;
  }
};
