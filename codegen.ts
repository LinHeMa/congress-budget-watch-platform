import type { CodegenConfig } from "@graphql-codegen/cli";
import { GQL_ENDPOINTS } from "./app/constants/endpoints";

const config: CodegenConfig = {
  schema: GQL_ENDPOINTS,
  documents: ["app/**/*.{ts,tsx}"],
  ignoreNoDocuments: true,
  generates: {
    "./app/graphql/": {
      preset: "client",
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

export default config;
