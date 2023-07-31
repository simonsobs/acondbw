import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://127.0.0.1:5001/graphql",
  documents: ["src/graphql/**/*.gql"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-vue-urql"],
    },
  },
};

export default config;
