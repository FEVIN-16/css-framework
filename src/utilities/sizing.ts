import type { ThemeConfig } from "../config/schema";

export const sizingRules = [
  {
    // Width: w-4, w-full, w-screen, w-auto
    match: /^w-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, value] = matches;
      if (!value) return "";
      const special = {
        full: "100%",
        screen: "100vw",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        auto: "auto",
      }[value];
      
      const themeValue = special || (theme.spacing?.[value] 
        ? `var(--spacing-${value.replace(/\./g, "\\.")})` 
        : (value.match(/^[0-9]+(px|rem|em|%|vh|vw)$/) ? value : null));
      
      if (!themeValue) return "";
      return `width: ${themeValue};`;
    }
  },
  {
    // Height: h-4, h-full, h-screen, h-auto
    match: /^h-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, value] = matches;
      if (!value) return "";
      const special = {
        full: "100%",
        screen: "100vh",
        min: "min-content",
        max: "max-content",
        fit: "fit-content",
        auto: "auto",
      }[value];
      
      const themeValue = special || (theme.spacing?.[value] 
        ? `var(--spacing-${value.replace(/\./g, "\\.")})` 
        : (value.match(/^[0-9]+(px|rem|em|%|vh|vw)$/) ? value : null));
      
      if (!themeValue) return "";
      return `height: ${themeValue};`;
    }
  },
  {
    // Max-width: max-w-lg, max-w-full
    match: /^max-w-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, value] = matches;
      if (!value) return "";
      
      const themeValue = theme.maxWidth?.[value] 
        ? `var(--max-w-${value.replace(/\./g, "\\.")})` 
        : (value.match(/^[0-9]+(px|rem|em|%|vh|vw)$/) ? value : null);
      
      if (!themeValue) return "";
      return `max-width: ${themeValue};`;
    }
  }
];
