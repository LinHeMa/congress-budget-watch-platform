import React from "react";
import BudgetHeader from "./_components/header";

const BudgetLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <BudgetHeader />
      {children}
    </div>
  );
};

export default BudgetLayout;
