/* eslint-disable no-undef */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  env: {
    jest: true,
    es6: true,
    browser: true,
  },
  rules: {
    "prettier/prettier": "error",
    "react/prop-types": "off", // Using typescript for props checking
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  plugins: ["import", "@typescript-eslint/eslint-plugin"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
};
