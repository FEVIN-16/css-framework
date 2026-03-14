import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const effectRules = [
  {
    // Opacity: opacity-50, etc.
    match: /^opacity-(\d+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = matches[1];
      const themeValue = theme.opacity?.[val!];
      const value = themeValue || (val ? `0.${val}` : "1");
      return `opacity: ${value};`;
    }
  },
  {
    // Shadow: shadow, shadow-md, shadow-inner, etc.
    match: /^shadow(-[sm|md|lg|xl|2xl|none|inner])?$/,
    generate: (matches: string[]) => {
      const key = matches[1]?.replace("-", "") || "default";
      const shadows: Record<string, string> = {
        default: "0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
        sm: "0 1px 2px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05))",
        md: "0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
        lg: "0 10px 15px -3px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 4px 6px -4px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
        xl: "0 20px 25px -5px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 8px 10px -6px var(--tw-shadow-color, rgb(0 0 0 / 0.1))",
        "2xl": "0 25px 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25))",
        inner: "inset 0 2px 4px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05))",
        none: "0 0 #0000",
      };
      return `box-shadow: ${shadows[key]};`;
    }
  },
  {
    // Shadow Color: shadow-red-500
    match: /^shadow-(?!opacity-|inner|sm|md|lg|xl|2xl|none)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const rest = matches[1]!;
      const [colorPath, opacity] = rest.split("/");
      const hasThemeColor = resolveThemeColor(colorPath!, theme);
      if (!hasThemeColor) return `--tw-shadow-color: ${rest};`;

      const varName = `--color-${colorPath!.replace(/\./g, "\\.")}`;
      const colorValue = `var(${varName})`;

      if (opacity) {
        const opacityValue = theme.opacity?.[opacity] || (opacity.match(/^[0-9]+$/) ? `0.${opacity}` : opacity);
        return `--tw-shadow-color: color-mix(in srgb, ${colorValue}, transparent ${100 - (parseFloat(opacityValue) * 100)}%);`;
      }
      return `--tw-shadow-color: ${colorValue};`;
    }
  },
  {
    // Blend modes
    match: /^(mix|bg)-blend-(.+)$/,
    generate: (matches: string[]) => {
      const [, type, mode] = matches;
      const prop = type === "mix" ? "mix-blend-mode" : "background-blend-mode";
      return `${prop}: ${mode};`;
    }
  },
  {
    // Filters: blur-sm, brightness-50, contrast-125, grayscale, invert, sepia
    match: /^(blur|brightness|contrast|grayscale|invert|sepia)(-(\d+|sm|md|lg|xl|2xl))?$/,
    generate: (matches: string[]) => {
      const [, type, , val] = matches;
      if (type === "blur") {
        const blurMap: Record<string, string> = { sm: "4px", default: "8px", md: "12px", lg: "16px", xl: "24px", "2xl": "40px", none: "0" };
        return `filter: blur(${blurMap[val!] || val || "8px"});`;
      }
      if (["brightness", "contrast"].includes(type!)) return `filter: ${type}(${val ? parseInt(val) / 100 : 1});`;
      return `filter: ${type}(${val ? parseInt(val) / 100 : 1});`;
    }
  },
  {
    // Backdrop Filters
    match: /^backdrop-(blur|brightness|contrast|grayscale|invert|sepia)(-(\d+|sm|md|lg|xl|2xl))?$/,
    generate: (matches: string[]) => {
      const [, type, , val] = matches;
      if (type === "blur") {
        const blurMap: Record<string, string> = { sm: "4px", default: "8px", md: "12px", lg: "16px", xl: "24px", "2xl": "40px", none: "0" };
        return `backdrop-filter: blur(${blurMap[val!] || val || "8px"});`;
      }
      return `backdrop-filter: ${type}(${val ? parseInt(val) / 100 : 1});`;
    }
  }
];
