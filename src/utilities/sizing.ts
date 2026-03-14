import type { ThemeConfig } from "../config/schema";

function getSizingValue(value: string, theme: ThemeConfig, category: "spacing" | "maxWidth" = "spacing"): string | null {
  const special = {
    full: "100%",
    screen: category === "spacing" ? "100vh" : "100vw", // Note: h-screen is 100vh, w-screen is 100vw
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    auto: "auto",
    none: "none",
    0: "0px",
  }[value];

  if (special) return special;

  if (value.includes("/")) {
    const [num, den] = value.split("/").map(Number);
    if (num !== undefined && den !== undefined && den !== 0) {
      return `${(num / den) * 100}%`;
    }
  }

  const themeValue = category === "maxWidth" ? theme.maxWidth?.[value] : theme.spacing?.[value];
  if (themeValue) {
    const prefix = category === "maxWidth" ? "--max-w-" : "--spacing-";
    return `var(${prefix}${value.replace(/\./g, "\\.")})`;
  }

  if (value.match(/^[0-9.]+(px|rem|em|%|vh|vw)$/)) {
    return value;
  }

  return null;
}

export const sizingRules = [
  {
    // Width: w-4, w-1/2, w-full, etc.
    match: /^w-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      if (val === "100vh") return "width: 100vw;"; // Correction for w-screen
      return val ? `width: ${val};` : "";
    }
  },
  {
    // Min-width: min-w-0, min-w-full, etc.
    match: /^min-w-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      return val ? `min-width: ${val};` : "";
    }
  },
  {
    // Max-width: max-w-lg, max-w-full, etc.
    match: /^max-w-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme, "maxWidth");
      return val ? `max-width: ${val};` : "";
    }
  },
  {
    // Height: h-4, h-1/2, h-screen, etc.
    match: /^h-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      return val ? `height: ${val};` : "";
    }
  },
  {
    // Min-height: min-h-0, min-h-full, etc.
    match: /^min-h-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      return val ? `min-height: ${val};` : "";
    }
  },
  {
    // Max-height: max-h-4, max-h-full, etc.
    match: /^max-h-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      return val ? `max-height: ${val};` : "";
    }
  },
  {
    // Size: size-4, size-full, etc.
    match: /^size-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = getSizingValue(matches[1]!, theme);
      return val ? `width: ${val}; height: ${val};` : "";
    }
  }
];
