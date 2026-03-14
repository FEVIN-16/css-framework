export function extractTokens(content: string): Set<string> {
  const tokens = new Set<string>();
  
  // Patterns to match:
  // 1. HTML/JSX: class="...", className="..."
  // 2. Vue/Svelte: :class="{ ... }", class:name="..."
  // 3. Template literals or strings that look like class lists
  
  // Targeted attribute extraction
  const attrRegex = /(?:class|className|classList)\s*[:=]\s*["'`](.*?)["'`](?!\s*[:=])/gi;
  let match;
  
  while ((match = attrRegex.exec(content)) !== null) {
    const rawValue = match[1];
    if (rawValue) {
      // Split by whitespace and common separators in dynamic classes
      const words = rawValue.match(/[a-z0-9-:_/\\\[\]'\"#%()!*]+(?<!:)/gi) || [];
      for (const word of words) {
        if (word && isValidToken(word)) {
          tokens.add(word);
        }
      }
    }
  }
  
  // Fallback/Bonus: Also catch potential classes in template literals or separate strings
  // but be more selective than the old regex.
  const standaloneRegex = /["']([a-z0-9][a-z0-9-]*:[a-z0-9-!\[\]'...*]*|[a-z0-9][a-z0-9-!\[\]'...*]*-[a-z0-9-!\[\]'...*]*|[a-z]+-[0-9.]+- [a-z0-9-!\[\]'...*]*)["']/gi;
  while ((match = standaloneRegex.exec(content)) !== null) {
    if (match[1] && isValidToken(match[1])) {
      tokens.add(match[1]);
    }
  }
  
  return tokens;
}

function isValidToken(token: string): boolean {
  // Rough check to filter out common non-utility words
  const blackList = ["function", "const", "let", "var", "return", "import", "export", "default"];
  if (blackList.includes(token)) return false;
  
  // Must be a valid CSS class name start and contain at least one letter
  // Now also allows single-word utilities like "flex", "block", "hidden"
  return /^[a-z_][a-z0-9-_:\[\]'\"#%()!*]*$/i.test(token);
}
