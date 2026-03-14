import type { ThemeConfig } from "../config/schema";

export const typographyRules = [
  {
    // Font size: text-sm, text-lg, etc.
    match: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, size] = matches;
      const themeValue = theme.fontSize?.[size as string] || {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      }[size as string];
      return `font-size: ${themeValue};`;
    }
  },
  {
    // Font weight: font-bold, font-medium, etc.
    match: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    generate: (matches: string[]) => {
      const [, weight] = matches;
      const value = {
        thin: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        black: "900",
      }[weight as string];
      return `font-weight: ${value};`;
    }
  },
  {
    // Text align: text-left, text-center, etc.
    match: /^text-(left|center|right|justify|start|end)$/,
    generate: (matches: string[]) => {
      return `text-align: ${matches[1]};`;
    }
  },
  {
    // Text transform: uppercase, lowercase, capitalize, normal-case
    match: /^(uppercase|lowercase|capitalize|normal-case)$/,
    generate: (matches: string[]) => {
      const value = matches[1] === "normal-case" ? "none" : matches[1];
      return `text-transform: ${value};`;
    }
  }
];
