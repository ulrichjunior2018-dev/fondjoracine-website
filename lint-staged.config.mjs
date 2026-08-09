/**
 * Sequential per-file tasks (prettier then eslint).
 * Avoid overlapping globs that run prettier and eslint concurrently — that freezes
 * lint-staged on Windows at "Applying modifications from tasks…".
 */
export default {
  "*.{ts,tsx,mts,js,mjs,cjs}": ["prettier --write", "eslint --fix"],
  "*.{json,css,md}": "prettier --write",
};
