module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "\\.(gql|graphql)$": "./node_modules/jest-transform-graphql",
    /* ... */
  },
  moduleNameMapper: {
    "\\.(css|less)$": "jest-transform-stub",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/src/**",
    "**/*.{vue}",
    "!**/node_modules/**",
    "!<rootDir>/dist/**",
    "!<rootDir>/src/plugins/**",
    "!<rootDir>/tests/unit/**",
    "!**/**/MapItemWithApolloQuery.vue",
  ],
  coverageReporters: ["lcov", "text-summary"],
};
