import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const createClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // The `fetchOptions` is a good practice for Next.js to avoid caching GraphQL requests
      fetchOptions: { cache: "no-store" },
      uri: "https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql",
    }),
  });
};

export const getClient = createClient;