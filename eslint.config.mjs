import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/", ".wrangler/", ".cloudflare/", "Resumes/"],
  },
  js.configs.recommended,
  {
    // Browser code shipped to the page (loaded as an ES module).
    files: ["src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    // Build tooling, templates and tests run under Node.
    files: ["scripts/**/*.mjs", "src/templates/**/*.mjs", "src/headers.mjs", "tests/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.node,
    },
  },
]);
