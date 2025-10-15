// Budget queries
export {
  GET_BUDGETS_QUERY,
  // GET_BUDGET_BY_ID_QUERY, // TODO: Uncomment when needed
  budgetQueryKeys,
  GET_GOVERNMENTS_QUERY,
  governmentQueryKeys,
} from "./budget.queries";

// Add other query exports here as you create more query files
// export * from "./user.queries";
// export * from "./committee.queries";

export {
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_BY_ID_QUERY,
  proposalQueryKeys,
} from './proposal.queries'

export * from "./budget.queries";
export * from "./proposal.queries";
