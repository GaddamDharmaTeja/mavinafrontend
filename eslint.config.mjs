import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "backend/**",
  ]),
  {
    rules: {
      // Application navigation is managed by react-router-dom, not Next's router.
      "@next/next/no-html-link-for-pages": "off",
      // These existing async effects initialize remote data and loading state.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
