import type { ThemeConfig } from "../config/schema";

export const flexboxRules = [
  {
    // Direction
    match: /^flex-(row|row-reverse|col|col-reverse)$/,
    generate: (matches: string[]) => `flex-direction: ${matches[1]?.replace("col", "column")};`
  },
  {
    // Wrap
    match: /^flex-(wrap|wrap-reverse|nowrap)$/,
    generate: (matches: string[]) => `flex-wrap: ${matches[1]};`
  },
  {
    // Flex: flex-1, flex-auto, flex-none, grow, shrink
    match: /^(flex-(1|auto|initial|none)|grow(-0)?|shrink(-0)?)$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (val === "grow") return "flex-grow: 1;";
      if (val === "grow-0") return "flex-grow: 0;";
      if (val === "shrink") return "flex-shrink: 1;";
      if (val === "shrink-0") return "flex-shrink: 0;";
      const flexMap: Record<string, string> = { "flex-1": "1 1 0%", "flex-auto": "1 1 auto", "flex-initial": "0 1 auto", "flex-none": "none" };
      return `flex: ${flexMap[val!]};`;
    }
  },
  {
    // Basis
    match: /^basis-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = matches[1];
      if (val?.includes("/")) {
        const [num, den] = val.split("/").map(Number);
        return `flex-basis: ${(num! / den!) * 100}%;`;
      }
      const value = theme.spacing?.[val!] || `var(--spacing-${val})`;
      return `flex-basis: ${value};`;
    }
  },
  {
    // Justify
    match: /^justify-(start|end|center|between|around|evenly)$/,
    generate: (matches: string[]) => {
      const map: Record<string, string> = { start: "flex-start", end: "flex-end", center: "center", between: "space-between", around: "space-around", evenly: "space-evenly" };
      return `justify-content: ${map[matches[1]!]};`;
    }
  },
  {
    // Items
    match: /^items-(start|end|center|baseline|stretch)$/,
    generate: (matches: string[]) => {
      const map: Record<string, string> = { start: "flex-start", end: "flex-end", center: "center", baseline: "baseline", stretch: "stretch" };
      return `align-items: ${map[matches[1]!]};`;
    }
  },
  {
    // Self
    match: /^self-(auto|start|end|center|stretch|baseline)$/,
    generate: (matches: string[]) => {
      const map: Record<string, string> = { auto: "auto", start: "flex-start", end: "flex-end", center: "center", stretch: "stretch", baseline: "baseline" };
      return `align-self: ${map[matches[1]!]};`
    }
  },
  {
    // Align Content
    match: /^content-(center|start|end|between|around|evenly|baseline|stretch)$/,
    generate: (matches: string[]) => {
      const map: Record<string, string> = { center: "center", start: "flex-start", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly", baseline: "baseline", stretch: "stretch" };
      return `align-content: ${map[matches[1]!]};`;
    }
  },
  {
    // Place Content/Items/Self
    match: /^place-(content|items|self)-(center|start|end|between|around|evenly|baseline|stretch)$/,
    generate: (matches: string[]) => {
      const [, type, align] = matches;
      const map: Record<string, string> = { center: "center", start: "start", end: "end", between: "space-between", around: "space-around", evenly: "space-evenly", baseline: "baseline", stretch: "stretch" };
      return `place-${type}: ${map[align!]};`;
    }
  },
  {
    // Order
    match: /^order-(first|last|none|(\d+))$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (val === "first") return "order: -9999;";
      if (val === "last") return "order: 9999;";
      if (val === "none") return "order: 0;";
      return `order: ${val};`;
    }
  },
  {
    // Justify Items
    match: /^justify-items-(start|end|center|stretch)$/,
    generate: (matches: string[]) => `justify-items: ${matches[1]};`
  },
  {
    // Justify Self
    match: /^justify-self-(auto|start|end|center|stretch)$/,
    generate: (matches: string[]) => `justify-self: ${matches[1]};`
  },
  {
    // Gap
    match: /^gap(-x|-y)?-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, axis, value] = matches;
      const prop = axis === "-x" ? "column-gap" : axis === "-y" ? "row-gap" : "gap";
      const spacingValue = theme.spacing?.[value!] || (value?.includes("/") ? null : `var(--spacing-${value})`) || value;
      return `${prop}: ${spacingValue};`;
    }
  }
];
