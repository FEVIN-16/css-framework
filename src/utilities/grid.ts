import type { ThemeConfig } from "../config/schema";

export const gridRules = [
  {
    // Grid Template Columns: grid-cols-1 to grid-cols-12, none, subgrid
    match: /^grid-cols-(none|subgrid|(\d+))$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (val === "none") return "grid-template-columns: none;";
      if (val === "subgrid") return "grid-template-columns: subgrid;";
      return `grid-template-columns: repeat(${val}, minmax(0, 1fr));`;
    }
  },
  {
    // Grid Column Span / Start / End
    match: /^col-(span|start|end)-(.+)$/,
    generate: (matches: string[]) => {
      const [, type, val] = matches;
      if (type === "span") {
        if (val === "full") return "grid-column: 1 / -1;";
        return `grid-column: span ${val} / span ${val};`;
      }
      if (val === "auto") return `grid-column-${type}: auto;`;
      return `grid-column-${type}: ${val};`;
    }
  },
  {
    // Grid Template Rows: grid-rows-1 to grid-rows-12, none, subgrid
    match: /^grid-rows-(none|subgrid|(\d+))$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (val === "none") return "grid-template-rows: none;";
      if (val === "subgrid") return "grid-template-rows: subgrid;";
      return `grid-template-rows: repeat(${val}, minmax(0, 1fr));`;
    }
  },
  {
    // Grid Row Span / Start / End
    match: /^row-(span|start|end)-(.+)$/,
    generate: (matches: string[]) => {
      const [, type, val] = matches;
      if (type === "span") {
        if (val === "full") return "grid-row: 1 / -1;";
        return `grid-row: span ${val} / span ${val};`;
      }
      if (val === "auto") return `grid-row-${type}: auto;`;
      return `grid-row-${type}: ${val};`;
    }
  },
  {
    // Grid Auto Flow
    match: /^grid-flow-(row|col|dense|row-dense|col-dense)$/,
    generate: (matches: string[]) => {
      const val = matches[1]!.replace("-", " ");
      return `grid-auto-flow: ${val};`;
    }
  },
  {
    // Grid Auto Columns / Rows
    match: /^auto-(cols|rows)-(auto|min|max|fr)$/,
    generate: (matches: string[]) => {
      const [, type, val] = matches;
      const prop = type === "cols" ? "grid-auto-columns" : "grid-auto-rows";
      const values: Record<string, string> = { auto: "auto", min: "min-content", max: "max-content", fr: "minmax(0, 1fr)" };
      return `${prop}: ${values[val!]};`;
    }
  }
];
