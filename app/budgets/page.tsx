import { GetBudgetsDocument } from "@/graphql/__generated__/graphql";
import queryGraphQL from "@/utils/fetch-gql";
import React from "react";

const BudgetsPage = async () => {
  const data = await queryGraphQL(GetBudgetsDocument);
  console.log({ data });

  // Using JSON.stringify to display the object content for debugging
  return (
    <div>
      {data?.budgets?.map((budget) => (
        <section key={budget.id}>
          <p>{budget.projectName}</p>
        </section>
      ))}
    </div>
  );
};

export default BudgetsPage;
