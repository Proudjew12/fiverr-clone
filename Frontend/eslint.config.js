// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";

export default [
  {
    ignores: ["dist", "node_modules"],
  },

js.configs.recommended,

{
  files: ["**/*.{js,jsx}"],
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.node,
    },
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooksPlugin,
    "react-refresh": reactRefreshPlugin,
  },
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // React 17+ / Vite: no need to import React for JSX
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-vars": "error",

    // Hooks rules
    ...reactHooksPlugin.configs.recommended.rules,

    // Optional: helps with HMR patterns
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
},
];
