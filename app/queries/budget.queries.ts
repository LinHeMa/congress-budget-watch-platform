import { graphql } from "~/graphql";

/**
 * GraphQL query to get all budgets with their details
 */
export const GET_BUDGETS_QUERY = graphql(`
  query GetBudgets {
    budgets {
      id
      type
      year
      projectName
      projectDescription
      budgetAmount
      majorCategory
      mediumCategory
      minorCategory
      description
    }
    budgetsCount
  }
`);

/**
 * GraphQL query to get a specific budget by ID
 * TODO: Add this query once we need it in the application
 */
// export const GET_BUDGET_BY_ID_QUERY = graphql(`
//   query GetBudgetById($id: ID!) {
//     budget(where: { id: $id }) {
//       id
//       type
//       year
//       projectName
//       projectDescription
//       budgetAmount
//       budgetUrl
//       lastYearSettlement
//       majorCategory
//       mediumCategory
//       minorCategory
//       description
//       government {
//         id
//         name
//         category
//       }
//     }
//   }
// `);

/**
 * React Query keys for budget-related queries
 * Following the recommended pattern for hierarchical keys
 */
export const budgetQueryKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => 
    [...budgetQueryKeys.lists(), { filters }] as const,
  details: () => [...budgetQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetQueryKeys.details(), id] as const,
} as const;