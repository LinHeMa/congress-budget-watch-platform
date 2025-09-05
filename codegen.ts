import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema:
    "https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql",
  documents: ["./**/*.{gql,graphql}"],
  generates: {
    "./graphql/__generated__/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
    "introspection.json": {
      plugins: ["introspection"],
      config: {
        minify: true,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
