export const displayRules = [
  {
    // Display: block, inline, hidden, flex, grid, etc.
    match: /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|contents|hidden)$/,
    generate: (matches: string[]) => {
      const value = matches[1] === "hidden" ? "none" : matches[1];
      return `display: ${value};`;
    }
  }
];
