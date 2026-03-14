import type { ThemeConfig } from "../config/schema";

export const flexboxRules = [
  {
    // Flex direction: flex-row, flex-col, etc.
    match: /^flex-(row|row-reverse|col|col-reverse)$/,
    generate: (matches: string[]) => {
      const value = matches[1]?.replace("col", "column");
      return `flex-direction: ${value};`;
    }
  },
  {
    // Flex wrap: flex-wrap, flex-nowrap, etc.
    match: /^flex-(wrap|wrap-reverse|nowrap)$/,
    generate: (matches: string[]) => {
      return `flex-wrap: ${matches[1]};`;
    }
  },
  {
    // Flex grow/shrink: flex-1, flex-auto, flex-none
    match: /^flex-(1|auto|initial|none)$/,
    generate: (matches: string[]) => {
      const value = {
        "1": "1 1 0%",
        auto: "1 1 auto",
        initial: "0 1 auto",
        none: "none",
      }[matches[1] as string];
      return `flex: ${value};`;
    }
  },
  {
    // Justify content: justify-start, justify-center, etc.
    match: /^justify-(start|end|center|between|around|evenly)$/,
    generate: (matches: string[]) => {
      const value = {
        start: "flex-start",
        end: "flex-end",
        center: "center",
        between: "space-between",
        around: "space-around",
        evenly: "space-evenly",
      }[matches[1] as string];
      return `justify-content: ${value};`;
    }
  },
  {
    // Align items: items-start, items-center, etc.
    match: /^items-(start|end|center|baseline|stretch)$/,
    generate: (matches: string[]) => {
      const value = {
        start: "flex-start",
        end: "flex-end",
        center: "center",
        baseline: "baseline",
        stretch: "stretch",
      }[matches[1] as string];
      return `align-items: ${value};`;
    }
  },
  {
    // Gap: gap-4, gap-x-2, gap-y-8
    match: /^gap(-x|-y)?-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, axis, value] = matches;
      if (!value) return "";
      const prop = axis === "-x" ? "column-gap" : axis === "-y" ? "row-gap" : "gap";
      const themeValue = theme.spacing?.[value] 
        ? `var(--spacing-${value.replace(/\./g, "\\.")})` 
        : value;
      return `${prop}: ${themeValue};`;
    }
  }
];
