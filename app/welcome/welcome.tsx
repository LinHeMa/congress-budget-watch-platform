import { useQuery } from "@tanstack/react-query";
import { graphql } from "~/graphql";
import { execute } from "~/graphql/execute";
import BudgetHeader from "~/components/budget-header";
import ProgressBar from "~/components/progress-bar";
import {
  useHeaderActions,
  useProgressActions,
  useProgressState,
} from "~/stores/uiStore";
import { useEffect, useCallback } from "react";

const GetBudgetsQuery = graphql(`
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

export function Welcome() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["Budgets"],
    queryFn: () => execute(GetBudgetsQuery),
  });

  return (
    <>
      <BudgetHeader />
      <ProgressBar />
    </>
  );
}
