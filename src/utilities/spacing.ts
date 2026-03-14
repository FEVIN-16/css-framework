import type { ThemeConfig } from "../config/schema";

export const spacingRules = [
  {
    // Margin: m-4, mt-2, etc.
    match: /^(m|mt|mr|mb|ml)-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, side, value] = matches;
      if (!value) return "";
      const prop = {
        m: "margin",
        mt: "margin-top",
        mr: "margin-right",
        mb: "margin-bottom",
        ml: "margin-left",
      }[side as "m" | "mt" | "mr" | "mb" | "ml"];
      
      const themeValue = theme.spacing?.[value] 
        ? `var(--spacing-${value.replace(/\./g, "\\.")})` 
        : value;
      return `${prop}: ${themeValue};`;
    }
  },
  {
    // Padding: p-4, pt-2, etc.
    match: /^(p|pt|pr|pb|pl)-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, side, value] = matches;
      if (!value) return "";
      const prop = {
        p: "padding",
        pt: "padding-top",
        pr: "padding-right",
        pb: "padding-bottom",
        pl: "padding-left",
      }[side as "p" | "pt" | "pr" | "pb" | "pl"];
      
      const themeValue = theme.spacing?.[value] 
        ? `var(--spacing-${value.replace(/\./g, "\\.")})` 
        : value;
      return `${prop}: ${themeValue};`;
    }
  }
];
