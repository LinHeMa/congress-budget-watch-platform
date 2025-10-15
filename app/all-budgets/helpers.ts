import type { BudgetTableData } from "~/components/budget-table";
import type { Proposal } from "~/graphql/graphql";
import {
  formatNumber,
  formatReducedAndFrozenAmount,
  getProposalTypeDisplay,
} from "~/budget-detail/helpers";
import { formatLegislator } from "~/utils/format";

export function proposalToBudgetTableData(
  proposal: Proposal,
): BudgetTableData {
  const result: BudgetTableData = {
    id: proposal.id,
    sequence: 0, // FIXME: 'sequence' is not available in the paginated query
    department: proposal.government?.name || "N/A", // Correctly access department name
    // FIXME: 'meetingDate' is not directly available on Proposal in paginated query.
    // It's inside the `meetings` array which is not fetched here.
    date: "無審議日期",
    stage: "階段", // This is hardcoded for now
    proposer:
      proposal.proposers?.map(formatLegislator).join(" ") || "未知提案人",
    proposalType: getProposalTypeDisplay(proposal.proposalTypes), // Use 'proposalTypes'
    proposalResult:
      proposal.result === "passed"
        ? "通過"
        : proposal.result === "rejected"
          ? "不通過"
          : "待審議",
    proposalContent: proposal.description || "無提案內容",
    originalAmount: formatNumber(proposal.budget?.budgetAmount),
    reducedAmount: formatReducedAndFrozenAmount(
      proposal.reductionAmount,
      proposal.freezeAmount,
    ),
    // FIXME: 'tags' are not available in the Proposal type from the GraphQL query.
    tags: undefined,
    status: "committeed",
    // FIXME: 'committeedDate' relies on meetingDate which is not available.
    committeedDate: undefined,
  };

  return result;
}
