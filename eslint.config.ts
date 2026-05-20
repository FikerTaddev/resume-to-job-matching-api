import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";

export default tseslint.config(
  // 1. Ignore build artifacts and node_modules
  {
    ignores: ["dist/", "node_modules/"],
  },
  // 2. Base JS recommended rules
  js.configs.recommended,
  // 3. Strict TypeScript rules for production safety
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    languageOptions: {
      globals: {
        ...globals.node, // Enable Node.js global variables
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 4. Custom API safety rules
      "prettier/prettier": "error", // Force Prettier formatting
      "@typescript-eslint/no-explicit-any": "error", // Prevent type safety escapes
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    },
  },
  // 5. Disable conflicting rules with Prettier (must be last)
  prettierConfig,
);
