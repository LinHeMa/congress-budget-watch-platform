import { graphql } from '~/graphql'

/**
 * GraphQL query to get all proposals ordered by ID descending
 * Includes related government, budget, and proposers data
 *
 * Usage Example:
 *
 * ```tsx
 * import { useQuery } from "@tanstack/react-query";
 * import { execute } from "~/graphql/execute";
 * import { GET_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";
 *
 * const MyComponent = () => {
 *   const { data, isLoading, isError } = useQuery({
 *     queryKey: proposalQueryKeys.lists(),
 *     queryFn: () => execute(GET_PROPOSALS_QUERY),
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (isError) return <div>Error loading proposals</div>;
 *
 *   return (
 *     <div>
 *       {data?.proposals?.map((proposal) => (
 *         <div key={proposal.id}>
 *           <h3>{proposal.description}</h3>
 *           <p>Amount: {proposal.freezeAmount || proposal.reductionAmount}</p>
 *         </div>
 *       ))}
 *       <p>Total: {data?.proposalsCount}</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const GET_PROPOSALS_QUERY = graphql(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
      id
      description
      reason
      publishStatus
      result
      freezeAmount
      reductionAmount
      budgetImageUrl
      proposalTypes
      recognitionAnswer
      unfreezeStatus
      government {
        id
        name
        category
        description
      }
      budget {
        id
        projectName
        budgetAmount
        year
        type
        majorCategory
        mediumCategory
        minorCategory
      }
      proposers {
        id
        name
        type
        description
      }
      coSigners {
        id
        name
        type
      }
    }
    proposalsCount
  }
`)

/**
 * React Query keys for proposal-related queries
 * Following the recommended hierarchical pattern
 */
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  details: () => [...proposalQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const
