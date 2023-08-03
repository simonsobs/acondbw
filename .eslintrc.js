module.exports = {
  root: true,

  env: {
    es2021: true,
  },

  extends: [
    "plugin:vue/essential",
    "plugin:vuetify:base",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],

  parserOptions: {
    ecmaVersion: 2020,
  },

  globals: {
    vi: true,
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-unused-components": "off",
    "vue/no-mutating-props": "off",
    "vue/multi-word-component-names": "off",
    "no-unused-vars": "off",
    "no-unused-labels": "off",
    "no-unreachable": "off",
    "no-empty": "off",
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
