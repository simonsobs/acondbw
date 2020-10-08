module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: ["plugin:vue/essential", "@vue/prettier"],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-unused-components": "off",
    "vue/no-mutating-props": "off",
    "no-unused-vars": "off",
    "no-unused-labels": "off",
    "no-unreachable": "off",
    "no-empty": "off"
  },

  parserOptions: {
    parser: "babel-eslint"
  },

  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
