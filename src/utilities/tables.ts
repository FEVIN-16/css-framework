import type { ThemeConfig } from "../config/schema";

export const tableRules = [
  {
    // Border Collapse
    match: /^border-(collapse|separate)$/,
    generate: (matches: string[]) => `border-collapse: ${matches[1]};`
  },
  {
    // Border Spacing
    match: /^border-spacing(-[xy])?-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, axis, val] = matches;
      const spacingValue = theme.spacing?.[val!] || `var(--spacing-${val})`;
      if (axis === "-x") return `--tw-border-spacing-x: ${spacingValue}; border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);`;
      if (axis === "-y") return `--tw-border-spacing-y: ${spacingValue}; border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);`;
      return `--tw-border-spacing-x: ${spacingValue}; --tw-border-spacing-y: ${spacingValue}; border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);`;
    }
  },
  {
    // Table Layout
    match: /^table-(auto|fixed)$/,
    generate: (matches: string[]) => `table-layout: ${matches[1]};`
  },
  {
    // Caption Side
    match: /^caption-(top|bottom)$/,
    generate: (matches: string[]) => `caption-side: ${matches[1]};`
  }
];
