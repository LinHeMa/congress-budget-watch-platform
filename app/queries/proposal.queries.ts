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
 * GraphQL query to get a single proposal by ID
 * Includes all related data needed for the detail page
 *
 * Usage Example:
 *
 * ```tsx
 * import { useQuery } from "@tanstack/react-query";
 * import { execute } from "~/graphql/execute";
 * import { GET_PROPOSAL_BY_ID_QUERY, proposalQueryKeys } from "~/queries";
 *
 * const BudgetDetail = () => {
 *   const { id } = useParams();
 *   const { data, isLoading, isError } = useQuery({
 *     queryKey: proposalQueryKeys.detail(id!),
 *     queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
 *     enabled: !!id,
 *   });
 *
 *   if (isLoading) return <BudgetDetailSkeleton />;
 *   if (isError || !data?.proposal) return <div>Error</div>;
 *
 *   return <div>{data.proposal.description}</div>;
 * };
 * ```
 */
export const GET_PROPOSAL_BY_ID_QUERY = graphql(`
  query GetProposalById($id: ID!) {
    proposal(where: { id: $id }) {
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
        projectDescription
        budgetAmount
        budgetUrl
        lastYearSettlement
        year
        type
        majorCategory
        mediumCategory
        minorCategory
        description
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
      meetings(orderBy: [{ meetingDate: desc }]) {
        id
        displayName
        meetingDate
        description
        location
        meetingRecordUrl
        type
      }
      mergedProposals {
        id
        proposers {
          id
          name
        }
      }
      historicalProposals {
        id
        proposers {
          id
          name
        }
      }
    }
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
  // 新增: 分頁查詢 keys
  paginated: (page: number, pageSize: number, sortBy: string) =>
    [
      ...proposalQueryKeys.lists(),
      'paginated',
      { page, pageSize, sortBy },
    ] as const,
  details: () => [...proposalQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const

/**
 * GraphQL query to get paginated proposals with total count
 * Supports pagination (skip/take) and ordering
 *
 * Usage Example:
 *
 * ```tsx
 * const { data } = useQuery({
 *   queryKey: proposalQueryKeys.paginated(page, pageSize, sortBy),
 *   queryFn: () => execute(GET_PAGINATED_PROPOSALS_QUERY, {
 *     skip: (page - 1) * pageSize,
 *     take: pageSize,
 *     orderBy: [{ id: 'desc' }],
 *   }),
 * });
 * ```
 */
export const GET_PAGINATED_PROPOSALS_QUERY = graphql(`
  query GetPaginatedProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
  ) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy) {
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
