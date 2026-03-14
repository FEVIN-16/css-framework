import * as lightningcss from "lightningcss";
import { UTILITY_RULES } from "./rules";
import type { Config } from "../config/schema";
import { resolveTheme } from "../theme/resolver";
import { PREFLIGHT_CSS } from "../css/preflight";
import { ANIMATIONS_CSS } from "../css/animations";
import { resolveVariants } from "./variants";

export function generateCSS(tokens: Set<string>, config: Config): string {
  const theme = config.theme || {};
  const rules: string[] = [];
  
  // 0. Add Preflight reset (default to true)
  if (config.preflight !== false) {
    rules.push(PREFLIGHT_CSS);
  }

  // 1. Setup plugins and collect their rules
  const activeRules = [...UTILITY_RULES];
  if (config.plugins) {
    for (const plugin of config.plugins) {
      if (plugin.setup) plugin.setup(config);
      if (plugin.rules) {
        activeRules.unshift(...plugin.rules);
      }
    }
  }

  // 2. Add theme variables
  rules.push(resolveTheme(config.theme));
  rules.push(ANIMATIONS_CSS);
  
  // 3. Generate utility classes
  for (const token of tokens) {
    // Split token on ':' but only outside of brackets
    const parts: string[] = [];
    let currentPart = "";
    let depth = 0;
    for (const char of token) {
      if (char === "[") depth++;
      else if (char === "]") depth--;
      
      if (char === ":" && depth === 0) {
        parts.push(currentPart);
        currentPart = "";
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart);
    
    const utility = parts.pop()!;
    const variants = parts;

    for (const rule of activeRules) {
      const match = utility.match(rule.match);
      if (match) {
        const declaration = rule.generate(match, theme);
        if (!declaration) continue;
        
        // Escape the full token for the selector (all special CSS characters)
        const baseSelector = `.${token.replace(/[!\"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, "\\$&")}`;
        const { selector, wrapper, extraDeclarations } = resolveVariants(variants, baseSelector, config);
        
        let ruleStr = `${selector} { ${extraDeclarations || ""}${declaration} }`;
        if (wrapper) {
          ruleStr = `${wrapper} { ${ruleStr} }`;
        }
        rules.push(ruleStr);
        break;
      }
    }
  }
  
  const rawCSS = rules.join("\n");
  
  // Process with Lightning CSS
  const { code } = lightningcss.transform({
    filename: "style.css",
    code: Buffer.from(rawCSS),
    minify: true,
  });
  
  return code.toString();
}
