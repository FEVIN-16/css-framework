import type { ThemeConfig } from "../config/schema";

export const zIndexRules = [
  {
    // Z-Index: z-0, z-10, z-auto, etc.
    match: /^-?z-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const isNegative = matches[0]!.startsWith("-");
      const val = matches[1]!;
      const themeValue = theme.zIndex?.[val];
      const finalValue = themeValue || val;
      return `z-index: ${isNegative ? `calc(-1 * ${finalValue})` : finalValue};`;
    }
  }
];
