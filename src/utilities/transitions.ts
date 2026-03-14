import type { ThemeConfig } from "../config/schema";

export const transitionRules = [
  {
    // Transition Property
    match: /^transition(-(all|colors|opacity|shadow|transform|none))?$/,
    generate: (matches: string[]) => {
      const type = matches[2] || "default";
      const props: Record<string, string> = {
        default: "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter",
        all: "all",
        colors: "color, background-color, border-color, text-decoration-color, fill, stroke",
        opacity: "opacity",
        shadow: "box-shadow",
        transform: "transform",
        none: "none"
      };
      if (type === "none") return "transition-property: none;";
      return `transition-property: ${props[type]}; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;`;
    }
  },
  {
    // Transition Duration
    match: /^duration-(\d+)$/,
    generate: (matches: string[]) => `transition-duration: ${matches[1]}ms;`
  },
  {
    // Transition Timing Function
    match: /^ease-(linear|in|out|in-out)$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      const curves: Record<string, string> = {
        linear: "linear",
        in: "cubic-bezier(0.4, 0, 1, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
      };
      return `transition-timing-function: ${curves[val!]};`;
    }
  },
  {
    // Transition Delay
    match: /^delay-(\d+)$/,
    generate: (matches: string[]) => `transition-delay: ${matches[1]}ms;`
  },
  {
    // Animation
    match: /^animate-(spin|ping|pulse|bounce|none)$/,
    generate: (matches: string[]) => {
      const val = matches[1];
      if (val === "none") return "animation: none;";
      const animations: Record<string, string> = {
        spin: "spin 1s linear infinite",
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        bounce: "bounce 1s infinite"
      };
      return `animation: ${animations[val!]};`;
    }
  }
];
