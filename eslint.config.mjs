// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  files: ["**/*.{ts,vue}"],
  rules: {
    "vue/require-default-prop": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_?",
      },
    ],
  },
});
