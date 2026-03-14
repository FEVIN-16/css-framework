import type { ThemeConfig } from "../config/schema";
import { resolveThemeColor } from "../theme/utils";

export const backgroundRules = [
  {
    // Background Attachment
    match: /^bg-(fixed|local|scroll)$/,
    generate: (matches: string[]) => `background-attachment: ${matches[1]};`
  },
  {
    // Background Clip
    match: /^bg-clip-(border|padding|content|text)$/,
    generate: (matches: string[]) => `background-clip: ${matches[1] === "text" ? "text" : `${matches[1]}-box`};`
  },
  {
    // Background Origin
    match: /^bg-origin-(border|padding|content)$/,
    generate: (matches: string[]) => `background-origin: ${matches[1]}-box;`
  },
  {
    // Background Position
    match: /^bg-(bottom|center|left|left-bottom|left-top|right|right-bottom|right-top|top)$/,
    generate: (matches: string[]) => `background-position: ${matches[1]!.replace("-", " ")};`
  },
  {
    // Background Repeat
    match: /^bg-(no-repeat|repeat(-[xy])?|repeat-(round|space))$/,
    generate: (matches: string[]) => {
      const val = matches[1]!;
      if (val === "no-repeat") return "background-repeat: no-repeat;";
      if (val === "repeat-x") return "background-repeat: repeat-x;";
      if (val === "repeat-y") return "background-repeat: repeat-y;";
      return `background-repeat: ${val.replace("repeat-", "")};`;
    }
  },
  {
    // Background Size
    match: /^bg-(auto|cover|contain)$/,
    generate: (matches: string[]) => `background-size: ${matches[1]};`
  },
  {
    // Gradient Direction
    match: /^bg-gradient-to-([trbl]{1,2})$/,
    generate: (matches: string[]) => {
      const dirMap: Record<string, string> = {
        t: "top", tr: "top right", r: "right", br: "bottom right",
        b: "bottom", bl: "bottom left", l: "left", tl: "top left"
      };
      return `background-image: linear-gradient(to ${dirMap[matches[1]!]}, var(--tw-gradient-stops));`;
    }
  },
  {
    // Gradient Stops: from, via, to
    match: /^(from|via|to)-(?!opacity-)(.+)$/,
    generate: (matches: string[], theme: ThemeConfig) => {
      const [type, rest] = [matches[1], matches[2]!];
      const [colorPath, opacity] = rest.split("/");
      const hasThemeColor = resolveThemeColor(colorPath!, theme);
      
      let colorValue = hasThemeColor ? `var(--color-${colorPath!.replace(/\./g, "\\.")})` : colorPath;
      
      if (opacity) {
        const opacityValue = theme.opacity?.[opacity] || (opacity.match(/^[0-9]+$/) ? `0.${opacity}` : opacity);
        colorValue = `color-mix(in srgb, ${colorValue}, transparent ${100 - (parseFloat(opacityValue!) * 100)}%)`;
      }

      if (type === "from") {
        return `--tw-gradient-from: ${colorValue} var(--tw-gradient-from-position); --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);`;
      }
      if (type === "via") {
        return `--tw-gradient-via: ${colorValue} var(--tw-gradient-via-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to);`;
      }
      return `--tw-gradient-to: ${colorValue} var(--tw-gradient-to-position);`;
    }
  }
];
