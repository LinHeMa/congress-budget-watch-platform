import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: "https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql",
      fetchOptions: { cache: "no-store" },
    }),
  });
});