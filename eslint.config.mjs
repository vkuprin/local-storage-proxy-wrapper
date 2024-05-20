import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
    ignores: ["jest.config.js", "dist", "node_modules", ".idea", ".yarn", "index.test.ts"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
