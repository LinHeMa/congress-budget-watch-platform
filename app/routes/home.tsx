import type { Route } from "./+types/home";
import BudgetHeader from "~/components/budget-header";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "國會預算監督平台" },
    { name: "description", content: "國會預算監督平台" },
  ];
}

export default function Home() {
  return (
    <>
      <BudgetHeader />
      <NavLink to="/all-budgets">All Budgets</NavLink>
    </>
  );
}
