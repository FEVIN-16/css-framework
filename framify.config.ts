import { defineConfig } from "./src/config/schema";

export default defineConfig({
  content: ["src/**/*.{ts,js,html}", "demo.html", "./demo/**/*.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        custom: "#ff00ff",
      }
    }
  }
});
