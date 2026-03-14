import type { ThemeConfig } from "../config/schema";

export const transformRules = [
  {
    // Base Transform (enables composition)
    match: /^transform$/,
    generate: () => `--tw-translate-x: 0; --tw-translate-y: 0; --tw-rotate: 0; --tw-skew-x: 0; --tw-skew-y: 0; --tw-scale-x: 1; --tw-scale-y: 1; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));`
  },
  {
    // Scale
    match: /^-?scale(-[xy])?-(\d+)$/,
    generate: (matches: string[]) => {
      const isNegative = matches[0]!.startsWith("-");
      const [, axis, val] = matches;
      const scale = parseInt(val!) / 100;
      const finalScale = isNegative ? -scale : scale;
      if (axis === "-x") return `--tw-scale-x: ${finalScale};`;
      if (axis === "-y") return `--tw-scale-y: ${finalScale};`;
      return `--tw-scale-x: ${finalScale}; --tw-scale-y: ${finalScale};`;
    }
  },
  {
    // Rotate
    match: /^-?rotate-(\d+)$/,
    generate: (matches: string[]) => {
      const isNegative = matches[0]!.startsWith("-");
      const val = matches[1]!;
      return `--tw-rotate: ${isNegative ? "-" : ""}${val}deg;`;
    }
  },
  {
    // Translate
    match: /^-?translate-([xy])-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const isNegative = matches[0]!.startsWith("-");
      const [, axis, val] = matches;
      
      const resolveValue = (v: string) => {
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
      return `--tw-translate-${axis}: ${finalValue};`;
    }
  },
  {
    // Skew
    match: /^-?skew-([xy])-(\d+)$/,
    generate: (matches: string[]) => {
      const isNegative = matches[0]!.startsWith("-");
      const [, axis, val] = matches;
      return `--tw-skew-${axis}: ${isNegative ? "-" : ""}${val}deg;`;
    }
  },
  {
    // Transform Origin
    match: /^origin-(center|top|top-right|right|bottom-right|bottom|bottom-left|left|top-left)$/,
    generate: (matches: string[]) => `transform-origin: ${matches[1]!.replace("-", " ")};`
  }
];
