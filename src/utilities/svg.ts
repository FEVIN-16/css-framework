import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const svgRules = [
  {
    // Fill
    match: /^fill-(?!opacity-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const color = matches[1]!;
      const hasThemeColor = resolveThemeColor(color, theme);
      const val = hasThemeColor ? `var(--color-${color.replace(/\./g, "\\.")})` : color;
      return `fill: ${val};`;
    }
  },
  {
    // Fill Opacity
    match: /^fill-opacity-(\d+)$/,
    generate: (matches: string[]) => `fill-opacity: ${parseInt(matches[1]!) / 100};`
  },
  {
    // Stroke
    match: /^stroke-(?!opacity-|width-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const color = matches[1]!;
      const hasThemeColor = resolveThemeColor(color, theme);
      const val = hasThemeColor ? `var(--color-${color.replace(/\./g, "\\.")})` : color;
      return `stroke: ${val};`;
    }
  },
  {
    // Stroke Opacity
    match: /^stroke-opacity-(\d+)$/,
    generate: (matches: string[]) => `stroke-opacity: ${parseInt(matches[1]!) / 100};`
  },
  {
    // Stroke Width
    match: /^stroke-(\d+)$/,
    generate: (matches: string[]) => `stroke-width: ${matches[1]};`
  }
];
