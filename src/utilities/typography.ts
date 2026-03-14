import type { ThemeConfig } from "../config/schema";

export const typographyRules = [
  {
    // Font size: text-sm, text-lg, etc.
    match: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, size] = matches;
      const themeValue = theme.fontSize?.[size as string];
      
      if (Array.isArray(themeValue)) {
        let css = `font-size: ${themeValue[0]};`;
        if (themeValue[1]?.lineHeight) css += ` line-height: ${themeValue[1].lineHeight};`;
        if (themeValue[1]?.letterSpacing) css += ` letter-spacing: ${themeValue[1].letterSpacing};`;
        return css;
      }
      
      return `font-size: ${themeValue || `var(--text-${size})`};`;
    }
  },
  {
    // Font family: font-sans, font-serif, font-mono
    match: /^font-(sans|serif|mono)$/,
    generate: (matches: string[]) => `font-family: var(--font-${matches[1]});`
  },
  {
    // Font weight: font-bold, etc.
    match: /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    generate: (matches: string[]) => {
      const weights: Record<string, string> = {
        thin: "100", extralight: "200", light: "300", normal: "400",
        medium: "500", semibold: "600", bold: "700", extrabold: "800", black: "900",
      };
      return `font-weight: ${weights[matches[1]!]};`;
    }
  },
  {
    // Text align: text-left, etc.
    match: /^text-(left|center|right|justify|start|end)$/,
    generate: (matches: string[]) => `text-align: ${matches[1]};`
  },
  {
    // Text transform: uppercase, etc.
    match: /^(uppercase|lowercase|capitalize|normal-case)$/,
    generate: (matches: string[]) => `text-transform: ${matches[1] === "normal-case" ? "none" : matches[1]};`
  },
  {
    // Leading (line-height)
    match: /^leading-(none|tight|snug|normal|relaxed|loose|(\d+))$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const val = matches[1];
      const themeMap: Record<string, string> = {
        none: "1", tight: "1.25", snug: "1.375", normal: "1.5", relaxed: "1.625", loose: "2",
      };
      const value = themeMap[val!] || theme.spacing?.[val!] || `var(--spacing-${val})`;
      return `line-height: ${value};`;
    }
  },
  {
    // Tracking (letter-spacing)
    match: /^tracking-(tighter|tight|normal|wide|wider|widest)$/,
    generate: (matches: string[]) => {
      const themeMap: Record<string, string> = {
        tighter: "-0.05em", tight: "-0.025em", normal: "0em",
        wide: "0.025em", wider: "0.05em", widest: "0.1em",
      };
      return `letter-spacing: ${themeMap[matches[1]!]};`;
    }
  },
  {
    // Whitespace
    match: /^whitespace-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)$/,
    generate: (matches: string[]) => `white-space: ${matches[1]};`
  },
  {
    // Word break
    match: /^break-(normal|words|all|keep)$/,
    generate: (matches: string[]) => {
      if (matches[1] === "words") return "overflow-wrap: break-word;";
      if (matches[1] === "all") return "word-break: break-all;";
      return `word-break: ${matches[1] === "normal" ? "normal" : "keep-all"};`;
    }
  },
  {
    // Truncate
    match: /^truncate$/,
    generate: () => "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
  },
  {
    // List styles
    match: /^list-(none|disc|decimal|inside|outside)$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (["none", "disc", "decimal"].includes(val!)) return `list-style-type: ${val};`;
      return `list-style-position: ${val};`;
    }
  },
  {
    // Text decoration
    match: /^(underline|overline|line-through|no-underline)$/,
    generate: (matches: string[]) => `text-decoration-line: ${matches[1] === "no-underline" ? "none" : matches[1]};`
  },
  {
    // Italic
    match: /^(italic|not-italic)$/,
    generate: (matches: string[]) => `font-style: ${matches[1] === "italic" ? "italic" : "normal"};`
  },
  {
    // Font smoothing
    match: /^(antialiased|subpixel-antialiased)$/,
    generate: (matches: string[]) => {
      if (matches[1] === "antialiased") return "-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;";
      return "-webkit-font-smoothing: auto; -moz-osx-font-smoothing: auto;";
    }
  },
  {
    // Vertical align
    match: /^align-(baseline|top|middle|bottom|text-top|text-bottom|sub|super)$/,
    generate: (matches: string[]) => `vertical-align: ${matches[1]};`
  },
  {
    // Content: content-['*'] -> content: "*";
    match: /^content-\['(.*)'\]$/,
    generate: (matches: string[]) => `content: "${matches[1]}";`
  }
];
