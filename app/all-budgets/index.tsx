import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "react-router";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { execute } from "~/graphql/execute";
import { GET_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";
import content from "./page-content";
import ProgressBar from "~/components/progress-bar";
import BudgetsSelector from "~/components/budgets-selector";
import SortToolbar, { sortBudgetsByOption } from "~/components/sort-toolbar";
import BudgetTable, { type BudgetTableData } from "~/components/budget-table";
import { useStore } from "zustand";
import useBudgetSelectStore from "~/stores/budget-selector";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";
import type {
  Budget,
  Proposal,
  ProposalProposalTypeType,
} from "~/graphql/graphql";
import { ProposalProposalTypeType as ProposalProposalTypeTypeEnum } from "~/graphql/graphql";
import AllBudgetsSkeleton from "~/components/skeleton/all-budgets-skeleton";

/**
 * 將 ProposalProposalTypeType 轉換為中文顯示文字
 */
function getProposalTypeDisplay(
  types?: Array<ProposalProposalTypeType> | null
): string {
  if (!types || types.length === 0) return "未分類";

  const typeMap: Record<ProposalProposalTypeType, string> = {
    [ProposalProposalTypeTypeEnum.Freeze]: "凍結",
    [ProposalProposalTypeTypeEnum.Reduce]: "減列",
    [ProposalProposalTypeTypeEnum.Other]: "其他",
  };

  return types.map((t) => typeMap[t] || t).join("、");
}

/**
 * 將 Proposal 轉換為 BudgetTableData
 * 此轉換確保與現有 BudgetTable 元件相容
 */
function proposalToBudgetTableData(proposal: Proposal): BudgetTableData {
  // 提案人：取第一個提案人，若無則顯示「無」
  const proposer = proposal.proposers?.[0]?.name || "無";

  // 連署人：將所有連署人名字用頓號連接，若無則顯示「無」
  const cosigners =
    proposal.coSigners && proposal.coSigners.length > 0
      ? proposal.coSigners.map((s) => s.name).join("、")
      : "無";

  // 提案類型：從 proposalTypes 陣列轉換
  const proposalType = getProposalTypeDisplay(proposal.proposalTypes);

  // 審議結果：從 result 欄位取得，若無則顯示「待審議」
  const proposalResult =
    typeof proposal.result === "string"
      ? proposal.result === "passed"
        ? "通過"
        : "不通過"
      : "待審議";

  // 預算金額：從 nested budget 中取得
  const originalAmount = proposal.budget?.budgetAmount || 0;

  // 減列/凍結金額：優先取 freezeAmount，其次 reductionAmount
  // TODO: 確認是否需要加總 freezeAmount 和 reductionAmount
  const reducedAmount = proposal.freezeAmount || proposal.reductionAmount || 0;

  // 審議日期：從 nested budget 的 year 取得
  // TODO: 確認審議日期是哪個欄位
  const reviewDate = proposal.budget?.year
    ? String(proposal.budget.year)
    : "N/A";

  return {
    id: proposal.id,
    department: proposal.government?.name || "未指定部會",
    reviewDate,
    reviewStage: proposal.government?.category || "未指定階段",
    proposer,
    cosigners,
    proposalType,
    proposalResult,
    originalAmount,
    reducedAmount,
    proposalContent: proposal.reason || "未指定內容",
  };
}

/**
 * 將 Proposal 適配為 Budget 型別以供排序使用
 * 只提取排序所需的欄位
 */
function proposalToBudgetForSorting(proposal: Proposal): Budget {
  return {
    id: proposal.id,
    projectName: proposal.budget?.projectName,
    budgetAmount: proposal.budget?.budgetAmount,
    year: proposal.budget?.year,
    description: proposal.description,
    government: proposal.government,
    // 其他欄位設為 undefined（排序不需要）
    __typename: "Budget",
    budgetUrl: undefined,
    lastYearSettlement: undefined,
    majorCategory: proposal.budget?.majorCategory,
    mediumCategory: proposal.budget?.mediumCategory,
    minorCategory: proposal.budget?.minorCategory,
    projectDescription: undefined,
    type: proposal.budget?.type,
  } as Budget;
}

const AllBudgets = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.lists(),
    queryFn: () => execute(GET_PROPOSALS_QUERY),
  });
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
  const setSelectedSort = useStore(
    useBudgetSelectStore,
    (s) => s.setSelectedSort
  );

  const tableData = useMemo(() => {
    if (!data?.proposals) return [];

    // 1. 將 Proposal 轉換為 Budget 型別以供排序
    const proposalsAsBudgets = data.proposals.map(proposalToBudgetForSorting);

    // 2. 使用現有排序邏輯
    const sortedBudgets = sortBudgetsByOption(proposalsAsBudgets, selectedSort);

    // 3. 根據排序後的 id 順序重新排列原始 proposals
    const sortedProposals = sortedBudgets
      .map((sortedBudget) =>
        data.proposals?.find((p) => p.id === sortedBudget.id)
      )
      .filter((p): p is Proposal => !!p);

    // 4. 轉換為 BudgetTableData 格式
    return sortedProposals.map(proposalToBudgetTableData);
  }, [data?.proposals, selectedSort]);

  if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);

  return (
    <>
      <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
        {/* title start */}
        <p className="mb-3 w-full text-center text-xl font-bold">
          {content.title}
        </p>
        {/* desktop progress start */}
        <div className="mb-5 hidden h-fit w-full items-center justify-center md:flex">
          <ProgressBar
            isDesktop={isDesktop}
            className="w-[165px]"
            labels={content.progressLabels}
          />
        </div>
        <div className="relative mb-5 hidden items-center justify-start border-b-[2px] border-black md:flex">
          <div className="rounded-t-md border-[2px] border-b-0 border-black bg-[#E9808E] px-2.5 py-1 text-[16px] font-bold text-[#f6f6f6]">
            {content.progressToggle}
          </div>
          <img
            src={`${import.meta.env.BASE_URL}image/eye.svg`}
            alt="eye icon"
            className="absolute top-[14px] right-16 z-99"
          />
        </div>
        {/* desktop progress end */}
        <div className="relative mb-3 h-0.5 w-full bg-black md:hidden">
          <Image
            src="/image/magnifier-eye.svg"
            alt="magnifier eye logo"
            className="bg-red absolute -top-[31.5px] z-10 h-[63px] w-[55px]"
          />
          <div className="absolute -top-[31.5px] h-[63px] w-[55px] bg-[#F6F6F6]" />
        </div>
        {/* title end */}

        {/* mobile progress start */}
        <div className="mb-5 flex items-center justify-center border-b-[2px] border-black md:hidden">
          <div className="rounded-t-md border-[2px] border-b-0 border-black bg-[#E9808E] px-2.5 py-1 text-[16px] font-bold text-[#f6f6f6]">
            {content.progressToggle}
          </div>
        </div>
        <section className="mb-2 flex w-full justify-center text-lg font-bold text-[#3E51FF] md:hidden">
          <p>最新進度</p>
        </section>
        <div className="mb-5 flex h-fit w-full items-center justify-center md:hidden">
          <ProgressBar className="w-[165px]" labels={content.progressLabels} />
        </div>
        {/* mobile progress end */}

        {/* budgets selector start */}
        <div className="h-0.5 w-full bg-black md:hidden" />
        <BudgetsSelector />
        <div className="h-0.5 w-full bg-black md:hidden" />

        {/* 排序下拉（react-select） */}
        <SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />
        <div className="h-0.5 w-full bg-black md:hidden" />

        {/* 使用新的表格組件渲染清單 */}
        <BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />
      </div>
    </>
  );
};

export default AllBudgets;
