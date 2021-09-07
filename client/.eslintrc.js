module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  rules: {
    "no-undef": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "spaced-comment": ["error", "always", { markers: ["/"] }],
    "react/jsx-key": [1, { checkFragmentShorthand: true }],
    "react/jsx-fragments": ["error", "element"],
    "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true },
    ],
  },
};
