import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const colorRules = [
  {
    // text-black, bg-red-500, bg-primary/50
    match: /^(text|bg)-(?!opacity-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, type, rest] = matches;
      if (!rest) return "";
      
      const [colorPath, opacity] = rest.split("/");
      const prop = type === "text" ? "color" : "background-color";
      
      const hasThemeColor = resolveThemeColor(colorPath!, theme);
      if (!hasThemeColor) return `${prop}: ${rest};`;

      const varName = `--color-${colorPath!.replace(/\./g, "\\.")}`;
      const colorValue = `var(${varName})`;

      if (opacity) {
        const opacityValue = theme.opacity?.[opacity] || (opacity.match(/^[0-9]+$/) ? `0.${opacity}` : opacity);
        return `${prop}: color-mix(in srgb, ${colorValue}, transparent ${100 - (parseFloat(opacityValue) * 100)}%);`;
      }

      return `${prop}: ${colorValue};`;
    }
  },
  {
    // text-opacity-50, bg-opacity-25
    match: /^(text|bg)-opacity-(\d+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, type, value] = matches;
      const prop = type === "text" ? "--tw-text-opacity" : "--tw-bg-opacity";
      const opacityValue = theme.opacity?.[value!] || `0.${value}`;
      return `${prop}: ${opacityValue};`;
    }
  }
];
