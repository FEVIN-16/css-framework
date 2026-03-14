import type { ThemeConfig } from "../config/schema";

export const positionRules = [
  {
    // Position
    match: /^(static|fixed|absolute|relative|sticky)$/,
    generate: (matches: string[]) => `position: ${matches[1]};`
  },
  {
    // Inset, Top, Right, Bottom, Left
    match: /^-?(inset|top|right|bottom|left)(-[xy])?-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const isNegative = matches[0]!.startsWith("-");
      const [, type, axis, val] = matches;
      
      const resolveValue = (v: string) => {
        if (v === "auto") return "auto";
        if (v === "full") return "100%";
        if (v.includes("/")) {
          const [n, d] = v.split("/");
          return `${(parseInt(n!) / parseInt(d!)) * 100}%`;
        }
        const themeValue = theme.spacing?.[v];
        return themeValue || `var(--spacing-${v})`;
      };

      const value = resolveValue(val!);
      const finalValue = isNegative ? `calc(-1 * ${value})` : value;

      if (type === "inset") {
        if (axis === "-x") return `left: ${finalValue}; right: ${finalValue};`;
        if (axis === "-y") return `top: ${finalValue}; bottom: ${finalValue};`;
        return `top: ${finalValue}; right: ${finalValue}; bottom: ${finalValue}; left: ${finalValue};`;
      }
      return `${type}: ${finalValue};`;
    }
  },
  {
    // Float & Clear
    match: /^(float|clear)-(left|right|none|both)$/,
    generate: (matches: string[]) => `${matches[1]}: ${matches[2]};`
  },
  {
    // Isolation
    match: /^(isolate|isolation-auto)$/,
    generate: (matches: string[]) => `isolation: ${matches[1] === "isolate" ? "isolate" : "auto"};`
  },
  {
    // Object Fit & Position
    match: /^object-(contain|cover|fill|none|scale-down|bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/,
    generate: (matches: string[]) => {
      const val = matches[1]!;
      const fits = ["contain", "cover", "fill", "none", "scale-down"];
      if (fits.includes(val)) return `object-fit: ${val};`;
      return `object-position: ${val.replace("-", " ")};`;
    }
  },
  {
    // Overflow
    match: /^overflow(-[xy])?-(auto|hidden|clip|visible|scroll)$/,
    generate: (matches: string[]) => {
      const [, axis, val] = matches;
      const prop = axis ? `overflow${axis}` : "overflow";
      return `${prop}: ${val};`;
    }
  },
  {
    // Overscroll
    match: /^overscroll(-[xy])?-(auto|contain|none)$/,
    generate: (matches: string[]) => {
      const [, axis, val] = matches;
      const prop = axis ? `overscroll-behavior${axis}` : "overscroll-behavior";
      return `${prop}: ${val};`;
    }
  },
  {
    // Visibility
    match: /^(visible|invisible|collapse)$/,
    generate: (matches: string[]) => matches[1] === "visible" ? "visibility: visible;" : `visibility: ${matches[1]};`
  }
];
