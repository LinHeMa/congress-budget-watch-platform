import { useQuery } from "@tanstack/react-query";
import { graphql } from "~/graphql";
import { execute } from "~/graphql/execute";

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
  console.log({ GetBudgetsQuery });
  const { data } = useQuery({
    queryKey: ["Budgets"],
    queryFn: () => execute(GetBudgetsQuery),
  });
  console.log(data);
  return <main className="flex items-center justify-center pt-16 pb-4"></main>;
}
