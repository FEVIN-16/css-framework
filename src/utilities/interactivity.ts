import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const interactivityRules = [
  {
    // Appearance
    match: /^appearance-(none|auto)$/,
    generate: (matches: string[]) => `appearance: ${matches[1]};`
  },
  {
    // Accent Color
    match: /^accent-(?!opacity-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const rest = matches[1]!;
      const [colorPath, opacity] = rest.split("/");
      const hasThemeColor = resolveThemeColor(colorPath!, theme);
      let val = hasThemeColor ? `var(--color-${colorPath!.replace(/\./g, "\\.")})` : colorPath;
      if (opacity) {
        const opacityValue = theme.opacity?.[opacity] || (opacity.match(/^[0-9]+$/) ? `0.${opacity}` : opacity);
        val = `color-mix(in srgb, ${val}, transparent ${100 - (parseFloat(opacityValue!) * 100)}%)`;
      }
      return `accent-color: ${val};`;
    }
  },
  {
    // Caret Color
    match: /^caret-(?!opacity-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const rest = matches[1]!;
      const [colorPath, opacity] = rest.split("/");
      const hasThemeColor = resolveThemeColor(colorPath!, theme);
      let val = hasThemeColor ? `var(--color-${colorPath!.replace(/\./g, "\\.")})` : colorPath;
      if (opacity) {
        const opacityValue = theme.opacity?.[opacity] || (opacity.match(/^[0-9]+$/) ? `0.${opacity}` : opacity);
        val = `color-mix(in srgb, ${val}, transparent ${100 - (parseFloat(opacityValue!) * 100)}%)`;
      }
      return `caret-color: ${val};`;
    }
  },
  {
    // Cursor
    match: /^cursor-(auto|default|pointer|wait|text|move|help|not-allowed|none|context-menu|progress|cell|crosshair|vertical-text|alias|copy|no-drop|grab|grabbing|zoom-in|zoom-out)$/,
    generate: (matches: string[]) => `cursor: ${matches[1]};`
  },
  {
    // Pointer Events
    match: /^pointer-events-(none|auto)$/,
    generate: (matches: string[]) => `pointer-events: ${matches[1]};`
  },
  {
    // Resize
    match: /^resize(-(none|y|x))?$/,
    generate: (matches: string[]) => {
      const val = matches[2] || "both";
      const props: Record<string, string> = {
        both: "both",
        none: "none",
        x: "horizontal",
        y: "vertical"
      };
      return `resize: ${props[val]};`;
    }
  },
  {
    // Scroll Margin & Padding
    match: /^scroll-(m|p)([xytrbl])?-(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [, type, side, val] = matches;
      const prop = type === "m" ? "scroll-margin" : "scroll-padding";
      const sideMap: Record<string, string> = { x: "-inline", y: "-block", t: "-top", r: "-right", b: "-bottom", l: "-left" };
      const finalProp = side ? `${prop}${sideMap[side]}` : prop;
      const value = theme.spacing?.[val!] || `var(--spacing-${val})`;
      return `${finalProp}: ${value};`;
    }
  },
  {
    // Scroll Behavior & Snap
    match: /^scroll-(auto|smooth|snap-(none|x|y|both|mandatory|proximity))$/,
    generate: (matches: string[]) => {
      const val = matches[1]!;
      if (val === "auto" || val === "smooth") return `scroll-behavior: ${val};`;
      if (val === "snap-none") return "scroll-snap-type: none;";
      if (val.startsWith("snap-")) {
        const type = val.replace("snap-", "");
        if (["x", "y", "both"].includes(type)) return `scroll-snap-type: ${type} var(--tw-scroll-snap-strictness, mandatory);`;
        return `--tw-scroll-snap-strictness: ${type};`;
      }
      return "";
    }
  },
  {
    // User Select
    match: /^select-(none|text|all|auto)$/,
    generate: (matches: string[]) => `user-select: ${matches[1]};`
  },
  {
    // Touch Action
    match: /^touch-(auto|none|pan-x|pan-left|pan-right|pan-y|pan-up|pan-down|pinch-zoom|manipulation)$/,
    generate: (matches: string[]) => `touch-action: ${matches[1]};`
  },
  {
    // Will Change
    match: /^will-change-(auto|scroll|contents|transform)$/,
    generate: (matches: string[]) => `will-change: ${matches[1] === "scroll" ? "scroll-position" : matches[1]};`
  }
];
