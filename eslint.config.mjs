import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import security from "eslint-plugin-security";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      react,
      security,
    },
    rules: {
      ...security.configs.recommended.rules,
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-no-target-blank": ["error", { allowReferrer: false }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".claude/**",
    ".npm-cache/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
