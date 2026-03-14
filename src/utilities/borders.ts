import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const borderRules = [
  {
    // Border width: border, border-0, border-x-2, border-t-4, etc.
    match: /^border(-[xytrbl])?(-[0248])?$/,
    generate: (matches: string[]) => {
      const [, side, width] = matches;
      let w = width?.replace("-", "") || "1px";
      if (w.match(/^\d+$/)) w += "px";
      const s = side?.replace("-", "");
      if (!s) return `border-width: ${w}; border-style: solid;`;
      const props = { x: ["border-left-width", "border-right-width"], y: ["border-top-width", "border-bottom-width"], t: ["border-top-width"], r: ["border-right-width"], b: ["border-bottom-width"], l: ["border-left-width"] }[s as "x"|"y"|"t"|"r"|"b"|"l"];
      return props!.map(p => `${p}: ${w};`).join(" ") + " border-style: solid;";
    }
  },
  {
    // Border color: border-primary, border-slate-500, etc.
    match: /^border-(?!opacity-|t-|r-|b-|l-|x-|y-|rounded-|solid|dashed|dotted|double|none)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const color = matches[1]!;
      const hasThemeColor = resolveThemeColor(color, theme);
      const val = hasThemeColor ? `var(--color-${color.replace(/\./g, "\\.")})` : color;
      return `border-color: ${val};`;
    }
  },
  {
    // Rounded: rounded, rounded-md, rounded-t-lg, rounded-tr-xl, etc.
    match: /^rounded(-[trbl]|-(t|r|b|l)[trbl])?(-[a-z0-9]+)?$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, side, , size] = matches;
      const key = size?.replace("-", "") || "default";
      const themeValue = theme.borderRadius?.[key] || `var(--radius-${key})`;
      if (!side) return `border-radius: ${themeValue};`;
      const s = side.replace("-", "");
      const props: Record<string, string[]> = {
        t: ["border-top-left-radius", "border-top-right-radius"],
        r: ["border-top-right-radius", "border-bottom-right-radius"],
        b: ["border-bottom-left-radius", "border-bottom-right-radius"],
        l: ["border-top-left-radius", "border-bottom-left-radius"],
        tl: ["border-top-left-radius"], tr: ["border-top-right-radius"],
        bl: ["border-bottom-left-radius"], br: ["border-bottom-right-radius"]
      };
      return props[s]!.map(p => `${p}: ${themeValue};`).join(" ");
    }
  },
  {
    // Divide: divide-x-2, divide-y, divide-gray-500
    match: /^divide-([xy])(-[0248])?$/,
    generate: (matches: string[]) => {
      const [, axis, width] = matches;
      let w = width?.replace("-", "") || "1px";
      if (w.match(/^\d+$/)) w += "px";
      const prop = axis === "x" ? "border-left-width" : "border-top-width";
      return `& > * + * { ${prop}: ${w}; border-style: solid; }`;
    }
  },
  {
    // Ring: ring, ring-2, ring-primary
    match: /^ring(-[0248])?(-.+)?$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, width, color] = matches;
      let w = width?.replace("-", "") || "3px";
      if (w.match(/^\d+$/)) w += "px";
      const c = color?.replace("-", "");
      let colorVal = "rgb(59 130 246 / 0.5)";
      if (c) {
        const hasThemeColor = resolveThemeColor(c, theme);
        colorVal = hasThemeColor ? `var(--color-${c.replace(/\./g, "\\.")})` : c;
      }
      return `box-shadow: 0 0 0 ${w} ${colorVal};`;
    }
  },
  {
    // Border Style
    match: /^border-(solid|dashed|dotted|double|none)$/,
    generate: (matches: string[]) => `border-style: ${matches[1]};`
  },
  {
    // Outline
    match: /^outline-(none|dashed|dotted|double)$/,
    generate: (matches: string[]) => matches[1] === "none" ? "outline: 2px solid transparent; outline-offset: 2px;" : `outline-style: ${matches[1]};`
  }
];
