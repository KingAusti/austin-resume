import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["dist/", "node_modules/", ".wrangler/", ".cloudflare/", "Resumes/"],
  },
  js.configs.recommended,
  {
    // Browser code shipped to the page.
    files: ["js/**/*.js", "src/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "script",
      globals: globals.browser,
    },
  },
  {
    // Build tooling and tests run under Node.
    files: ["scripts/**/*.mjs", "tests/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: globals.node,
    },
  },
]);
