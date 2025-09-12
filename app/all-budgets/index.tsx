import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "react-router";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { execute } from "~/graphql/execute";
import { GET_BUDGETS_QUERY, budgetQueryKeys } from "~/queries";
import content from "./page-content";
import ProgressBar from "~/components/progress-bar";
import BudgetHeader from "~/components/budget-header";
import BudgetsSelector from "~/components/budgets-selector";
import SortToolbar, { sortBudgetsByOption } from "~/components/sort-toolbar";
import BudgetTable from "~/components/budget-table";
import { useStore } from "zustand";
import useBudgetSelectStore from "~/stores/budget-selector";
const AllBudgets = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: budgetQueryKeys.lists(),
    queryFn: () => execute(GET_BUDGETS_QUERY),
  });
  // TODO: add skeleton
  const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
  const setSelectedSort = useStore(
    useBudgetSelectStore,
    (s) => s.setSelectedSort
  );

  const tableData = useMemo(() => {
    if (!data?.budgets) return [];
    console.log(data.budgets);

    const sortedBudgets = sortBudgetsByOption(data.budgets, selectedSort);

    return sortedBudgets.map((budget) => ({
      id: budget.id,
      department: budget.government?.name || "未指定部會",
      reviewDate: String(budget.year || "N/A"),
      reviewStage: budget.government?.category || "未指定部會",
      proposer: "李柏毅",
      cosigners: "王美惠、張宏陸",
      proposalType: "凍結",
      proposalResult: "通過",
      originalAmount: budget.budgetAmount || 0,
      reducedAmount: budget.budgetAmount || 0,
      proposalContent: budget.description || "未指定內容",
    }));
  }, [data?.budgets, selectedSort]);

  if (isLoading) return <>loading</>;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);

  return (
    <>
      <BudgetHeader />

      <div className="p-5">
        {/* title start */}
        <p className="mb-3 w-full text-center text-xl font-bold">
          {content.title}
        </p>
        <div className="relative mb-3 h-0.5 w-full bg-black">
          <img
            src="/image/magnifier-eye.svg"
            height={63}
            width={55}
            alt="magnifier eye logo"
            className="bg-red absolute -top-[31.5px] z-10"
          />
          <div className="absolute -top-[31.5px] h-[63px] w-[55px] bg-[#F6F6F6]" />
        </div>
        {/* title end */}

        {/* progress start */}
        <div className="mb-5 flex items-center justify-center border-b-[2px] border-black">
          <div className="rounded-t-md border-[2px] border-b-0 border-black bg-[#E9808E] px-2.5 py-1 text-[16px] font-bold text-[#f6f6f6]">
            {content.progressToggle}
          </div>
        </div>
        <section className="mb-2 flex w-full justify-center text-lg font-bold text-[#3E51FF]">
          <p>最新進度</p>
        </section>
        <div className="mb-5 flex h-fit w-full items-center justify-center">
          <ProgressBar className="w-[165px]" labels={content.progressLabels} />
        </div>
        {/* progress end */}

        {/* budgets selector start */}
        <div className="h-0.5 w-full bg-black" />
        <BudgetsSelector />
        <div className="h-0.5 w-full bg-black" />

        {/* 排序下拉（react-select） */}
        <SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />
        <div className="h-0.5 w-full bg-black" />

        {/* 使用新的表格組件渲染清單 */}
        <BudgetTable data={tableData} className="mt-4" />
      </div>
    </>
  );
};

export default AllBudgets;
