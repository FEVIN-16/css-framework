import * as lightningcss from "lightningcss";
import { UTILITY_RULES } from "./rules";
import type { Config } from "../config/schema";
import { resolveTheme } from "../theme/resolver";

export function generateCSS(tokens: Set<string>, config: Config): string {
  const theme = config.theme || {};
  const rules: string[] = [];
  
  // 1. Setup plugins and collect their rules
  const activeRules = [...UTILITY_RULES];
  if (config.plugins) {
    for (const plugin of config.plugins) {
      if (plugin.setup) plugin.setup(config);
      if (plugin.rules) {
        // Plugins take precedence (added to front)
        activeRules.unshift(...plugin.rules);
      }
    }
  }

  // 2. Add theme variables
  rules.push(resolveTheme(config.theme));
  
  // 3. Generate utility classes
  for (const token of tokens) {
    for (const rule of activeRules) {
      const match = token.match(rule.match);
      if (match) {
        const declaration = rule.generate(match, theme);
        if (!declaration) continue;
        
        // Basic escaping for CSS class names (e.g. colons for hover:bg-red-500)
        const selector = `.${token.replace(/:/g, '\\:')}`;
        rules.push(`${selector} { ${declaration} }`);
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
