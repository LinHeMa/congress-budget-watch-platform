import type { OperationVariables, TypedDocumentNode } from "@apollo/client";

import { getClient } from "@/lib/apollo-client";

export default async function queryGraphQL<
  TResult,
  TVariables extends OperationVariables
>(
  query: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  errorMessage?: string
): Promise<TResult | null> {
  try {
    const { data, errors: gqlErrors } = await getClient().query({
      query,
      variables,
    });

    if (gqlErrors && gqlErrors.length > 0) {
      throw new Error(`[GraphQL error]: ${gqlErrors[0].message}`);
    }
    return data;
  } catch (error) {
    const fallbackErrorMessage =
      "Fetch GraphQL failed, info: " + JSON.stringify({ query, variables });
    console.error(fallbackErrorMessage);
    return null;
  }
}

export async function mutateGraphQL<
  TResult,
  TVariables extends OperationVariables
>(
  mutation: TypedDocumentNode<TResult, TVariables>,
  variables?: TVariables,
  errorMessage?: string
): Promise<TResult | null> {
  try {
    const { data, errors: gqlErrors } = await getClient().mutate({
      mutation,
      variables,
    });
    if (gqlErrors && gqlErrors.length > 0) {
      throw new Error(`[GraphQL error]: ${gqlErrors[0].message}`);
    }
    return data || null;
  } catch (error) {
    const fallbackErrorMessage =
      "Upload GraphQL failed, info: " + JSON.stringify({ mutation, variables });
    console.error(fallbackErrorMessage);
    return null;
  }
}
