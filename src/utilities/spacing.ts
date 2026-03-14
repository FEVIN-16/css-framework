import type { ThemeConfig } from "../config/schema";

function getSpacingValue(value: string, theme: ThemeConfig): string {
  const isNegative = value.startsWith("-");
  const baseValue = isNegative ? value.slice(1) : value;
  
  // Fractional support: 1/2, 1/3, etc.
  if (baseValue.includes("/")) {
    const [num, den] = baseValue.split("/").map(Number);
    if (num !== undefined && den !== undefined && den !== 0) {
      const result = `${(num / den) * 100}%`;
      return isNegative ? `calc(-1 * ${result})` : result;
    }
  }

  const themeValue = theme.spacing?.[baseValue];
  if (themeValue) {
    const escapedBase = baseValue.replace(/\./g, "\\.");
    const varValue = `var(--spacing-${escapedBase})`;
    return isNegative ? `calc(-1 * ${varValue})` : varValue;
  }

  // Raw values (px, rem, etc.)
  if (baseValue.match(/^[0-9.]+(px|rem|em|%|vh|vw)$/)) {
    return value;
  }

  return value;
}

export const spacingRules = [
  {
    // Margin: m-4, mt-2, mx-4, -m-1, etc.
    match: /^-?(m|mt|mr|mb|ml|mx|my)-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [full] = matches;
      const isNegative = full!.startsWith("-");
      const side = matches[1];
      const value = (isNegative ? "-" : "") + matches[2];
      
      const spacingValue = getSpacingValue(value, theme);
      
      const props = {
        m: ["margin"],
        mt: ["margin-top"],
        mr: ["margin-right"],
        mb: ["margin-bottom"],
        ml: ["margin-left"],
        mx: ["margin-left", "margin-right"],
        my: ["margin-top", "margin-bottom"],
      }[side as string];

      return props!.map(p => `${p}: ${spacingValue};`).join(" ");
    }
  },
  {
    // Padding: p-4, pt-2, px-4, etc.
    match: /^(p|pt|pr|pb|pl|px|py)-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, side, value] = matches;
      const spacingValue = getSpacingValue(value!, theme);
      
      const props = {
        p: ["padding"],
        pt: ["padding-top"],
        pr: ["padding-right"],
        pb: ["padding-bottom"],
        pl: ["padding-left"],
        px: ["padding-left", "padding-right"],
        py: ["padding-top", "padding-bottom"],
      }[side as string];

      return props!.map(p => `${p}: ${spacingValue};`).join(" ");
    }
  },
  {
    // Space Between: space-x-4, space-y-2, space-x-reverse, etc.
    match: /^space-([xy])(-reverse|-(.+))$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, axis, val, rawValue] = matches;
      if (val === "-reverse") {
        return `& > * + * { --tw-space-${axis}-reverse: 1; }`;
      }
      
      const spacingValue = getSpacingValue(rawValue!, theme);
      const axisKey = axis === "x" ? "left" : "top";
      const revKey = axis === "x" ? "right" : "bottom";
      
      return `& > * + * { 
        --tw-space-${axis}-reverse: 0;
        margin-${axisKey}: calc(${spacingValue} * calc(1 - var(--tw-space-${axis}-reverse)));
        margin-${revKey}: calc(${spacingValue} * var(--tw-space-${axis}-reverse));
      }`;
    }
  }
];
