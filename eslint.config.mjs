import css from "@eslint/css"
import js from "@eslint/js"
import json from "@eslint/json"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import perfectionist from "eslint-plugin-perfectionist"
import sonarjs from "eslint-plugin-sonarjs"
import unusedImports from "eslint-plugin-unused-imports"
import { defineConfig } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

export default defineConfig([
  {
    extends: ["js/recommended"],
    files: ["**/*.{js,mjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { js },
  },
  tseslint.configs.recommended,

  {
    extends: ["json/recommended"],
    files: ["**/*.json"],
    language: "json/json",
    plugins: { json },
  },
  {
    extends: ["css/recommended"],
    files: ["**/*.css"],
    language: "css/css",
    plugins: { css },
  },
  {
    files: ["**/*.{js,mjs,ts}"],
    name: "sonarjs",
    plugins: {
      sonarjs,
    },
    // Remove these exceptions when code has been adjusted
    rules: {
      ...sonarjs.configs.recommended.rules,
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "sonarjs/cognitive-complexity": "warn",
      "sonarjs/no-nested-conditional": "warn",
      "sonarjs/no-nested-template-literals": "warn",
      "sonarjs/todo-tag": "warn",
    },
  },
  { ignores: ["**/*.astro"], ...eslintConfigPrettier },
  {
    files: ["**/*.{js,mjs,ts}"],
    ...perfectionist.configs["recommended-natural"],
  },
  {
    files: ["**/*.ts"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs}"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.config.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    name: "Config files",
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    name: "test",
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    ignores: ["**/node_modules", "package-lock.json", "public", "coverage"],
  },
])
