import type { ThemeConfig } from "../config/schema";

export const borderRules = [
  {
    // Border width: border, border-0, border-2, border-x, border-t, etc.
    match: /^border(-[xytrbl])?(-[0248])?$/,
    generate: (matches: string[]) => {
      const [, side, width] = matches;
      const w = width?.replace("-", "") || "1px";
      const s = side?.replace("-", "");
      
      if (!s) return `border-width: ${w}; border-style: solid;`;
      
      const props = {
        x: ["border-left-width", "border-right-width"],
        y: ["border-top-width", "border-bottom-width"],
        t: ["border-top-width"],
        r: ["border-right-width"],
        b: ["border-bottom-width"],
        l: ["border-left-width"],
      }[s as "x"|"y"|"t"|"r"|"b"|"l"];
      
      return props.map(p => `${p}: ${w};`).join(" ") + " border-style: solid;";
    }
  },
  {
    // border-color: border-primary, border-white, etc.
    match: /^border-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, color] = matches;
      if (!color || ["0","2","4","8"].includes(color)) return ""; // Skip if it matched width rule
      const themeValue = theme.colors?.[color] 
        ? `var(--color-${color.replace(/\./g, "\\.")})` 
        : color;
      return `border-color: ${themeValue};`;
    }
  },
  {
    // border-radius: rounded, rounded-md, rounded-full
    match: /^rounded(-[sm|md|lg|xl|2xl|3xl|full|none])?$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, size] = matches;
      const key = size?.replace("-", "") || "default";
      const themeValue = theme.borderRadius?.[key] || {
        default: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
        none: "0px",
      }[key];
      return `border-radius: ${themeValue};`;
    }
  }
];
