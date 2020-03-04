module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    "\\.(gql|graphql)$": "./node_modules/jest-transform-graphql"
    /* ... */
  }
};
