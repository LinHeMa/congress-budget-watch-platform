import BudgetHeader from "~/components/budget-header";
import { NavLink } from "react-router";

export function Welcome() {
  return (
    <>
      <BudgetHeader />
      <NavLink to="/all-budgets">All Budgets</NavLink>
    </>
  );
}
