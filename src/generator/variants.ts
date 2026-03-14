import type { Config } from "../config/schema";

export interface VariantResult {
  selector: string;
  wrapper?: string | undefined;
  extraDeclarations?: string | undefined;
}

const PSEUDO_MAP: Record<string, string> = {
  // Pseudo-classes
  hover: ":hover",
  focus: ":focus",
  active: ":active",
  visited: ":visited",
  disabled: ":disabled",
  enabled: ":enabled",
  checked: ":checked",
  indeterminate: ":indeterminate",
  default: ":default",
  required: ":required",
  optional: ":optional",
  valid: ":valid",
  invalid: ":invalid",
  "in-range": ":in-range",
  "out-of-range": ":out-of-range",
  "placeholder-shown": ":placeholder-shown",
  autofill: ":autofill",
  "read-only": ":read-only",
  "read-write": ":read-write",
  empty: ":empty",
  target: ":target",
  "focus-within": ":focus-within",
  "focus-visible": ":focus-visible",
  // Positional
  first: ":first-child",
  last: ":last-child",
  only: ":only-child",
  odd: ":nth-child(odd)",
  even: ":nth-child(even)",
  "first-of-type": ":first-of-type",
  "last-of-type": ":last-of-type",
  "only-of-type": ":only-of-type",
  // Pseudo-elements
  before: "::before",
  after: "::after",
  placeholder: "::placeholder",
  file: "::file-selector-button",
  marker: "::marker",
  selection: "::selection",
  "first-line": "::first-line",
  "first-letter": "::first-letter",
  backdrop: "::backdrop",
};

const MEDIA_QUERIES: Record<string, string> = {
  print: "@media print",
  portrait: "@media (orientation: portrait)",
  landscape: "@media (orientation: landscape)",
  "motion-safe": "@media (prefers-reduced-motion: no-preference)",
  "motion-reduce": "@media (prefers-reduced-motion: reduce)",
  "forced-colors": "@media (forced-colors: active)",
};

export function resolveVariants(variants: string[], baseSelector: string, config: Config): VariantResult {
  let selector = baseSelector;
  let wrapper: string | undefined;
  let extraDeclarations = "";

  const theme = config.theme || {};
  const screens = theme.screens || {};
  const darkModeStrategy = config.darkMode || "media";

  for (const variant of variants) {
    if (variant === "before" || variant === "after") {
      extraDeclarations += 'content: "";';
    }

    if (PSEUDO_MAP[variant]) {
      if (variant === "selection") {
        selector = `${selector}::selection, ${selector} *::selection`;
      } else {
        selector += PSEUDO_MAP[variant];
      }
    } else if (variant === "dark") {
      if (darkModeStrategy === "media") {
        const darkMQ = "@media (prefers-color-scheme: dark)";
        wrapper = wrapper ? `${wrapper} and ${darkMQ.replace("@media ", "")}` : darkMQ;
      } else {
        const selectorStrategy = Array.isArray(darkModeStrategy) ? darkModeStrategy[1] : ".dark";
        selector = `${selectorStrategy} ${selector}`;
      }
    } else if (variant === "contrast-more" || variant === "contrast-less") {
      const mode = variant.split("-")[1];
      const mq = `@media (prefers-contrast: ${mode})`;
      wrapper = wrapper ? `${wrapper} and ${mq.replace("@media ", "")}` : mq;
    } else if (screens[variant]) {
      const screenMQ = `@media (min-width: ${screens[variant]})`;
      wrapper = wrapper ? `${wrapper} and ${screenMQ.replace("@media ", "")}` : screenMQ;
    } else if (variant.startsWith("max-")) {
      const screenName = variant.replace("max-", "");
      if (screens[screenName]) {
        // Tailwind uses max-width: breakpoint - 0.02px
        const val = screens[screenName];
        const num = parseFloat(val);
        const unit = val.replace(/[0-9.]/g, "");
        const maxVal = `${num - 0.02}${unit}`;
        const screenMQ = `@media (max-width: ${maxVal})`;
        wrapper = wrapper ? `${wrapper} and ${screenMQ.replace("@media ", "")}` : screenMQ;
      } else if (variant.startsWith("max-[") && variant.endsWith("]")) {
        const val = variant.slice(5, -1);
        const mq = `@media (max-width: ${val})`;
        wrapper = wrapper ? `${wrapper} and ${mq.replace("@media ", "")}` : mq;
      }
    } else if (variant.startsWith("min-[") && variant.endsWith("]")) {
      const val = variant.slice(5, -1);
      const mq = `@media (min-width: ${val})`;
      wrapper = wrapper ? `${wrapper} and ${mq.replace("@media ", "")}` : mq;
    } else if (variant.startsWith("supports-[") && variant.endsWith("]")) {
      const val = variant.slice(10, -1);
      const mq = `@supports (${val})`;
      wrapper = wrapper ? `${wrapper} and ${mq.replace("@supports ", "")}` : mq;
    } else if (variant === "rtl" || variant === "ltr") {
      selector = `[dir="${variant}"] ${selector}`;
    } else if (MEDIA_QUERIES[variant]) {
      const mq = MEDIA_QUERIES[variant];
      wrapper = wrapper ? `${wrapper} and ${mq.replace("@media ", "")}` : mq;
    } else if (variant.startsWith("group-")) {
      const pseudo = variant.replace("group-", "");
      const pseudoVal = PSEUDO_MAP[pseudo] || `:${pseudo}`;
      selector = `.group${pseudoVal} ${selector}`;
    } else if (variant.startsWith("peer-")) {
      const pseudo = variant.replace("peer-", "");
      const pseudoVal = PSEUDO_MAP[pseudo] || `:${pseudo}`;
      selector = `.peer${pseudoVal} ~ ${selector}`;
    } else if (variant.startsWith("aria-") || variant.startsWith("data-")) {
      const name = variant;
      selector = `[${name}="true"] ${selector}`;
    }
  }

  return { selector, wrapper, extraDeclarations };
}
