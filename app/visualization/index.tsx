import { useMemo, useState } from "react";
import { VisualizationSelector } from "~/components/visualization-selector";
import CirclePackChart from "./circle-pack-chart";
import DepartmentChart from "./department";
import BudgetTypeLegend from "~/components/budget-type-legend";
import { BUDGET_TYPE_LEGEND_ITEMS } from "~/constants/legends";
import { GET_PAGINATED_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import {
  OrderDirection,
  ProposalProposalTypeType,
  type ProposalOrderByInput,
  type ProposalWhereInput,
} from "~/graphql/graphql";
import { sortOptions } from "~/components/sort-toolbar";
import { transformToCirclePackData } from "./helpers";

type OptionType = {
  value: string;
  label: string;
};

const yearOptions: OptionType[] = [
  { value: "2025", label: "114年度 (2025)" },
  { value: "2024", label: "113年度 (2024)" },
];

// data layer
const Visualization = () => {
  // "department" || "legislator"
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(yearOptions);
  const selectedSort = "id-asc";
  const currentPage = 1;
  const pageSize = 10;
  const whereFilter = () => {
    const filters: ProposalWhereInput = {};

    return filters;
  };
  const orderBy = useMemo((): ProposalOrderByInput[] => {
    // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
    const sortOption = sortOptions.find((o) => o.value === selectedSort);
    if (!sortOption) return [{ id: OrderDirection.Desc }];

    const direction =
      sortOption.direction === "asc" ? OrderDirection.Asc : OrderDirection.Desc;

    return [
      {
        [sortOption.field]: direction,
      },
    ];
  }, [selectedSort]);
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      currentPage,
      pageSize,
      selectedSort,
      whereFilter()
    ),
    queryFn: () =>
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: 0,
        take: pageSize,
        orderBy,
        where: whereFilter(),
      }),
    placeholderData: keepPreviousData, // 避免切頁時閃爍
  });

  const summaryStats = useMemo(() => {
    if (!data?.proposals) {
      return {
        totalReductionAmount: 0,
        reductionCount: 0,
        totalFreezeAmount: 0,
        freezeCount: 0,
        mainResolutionCount: 0,
      };
    }

    return data.proposals.reduce(
      (acc, proposal) => {
        if (proposal.reductionAmount) {
          acc.totalReductionAmount += proposal.reductionAmount;
          acc.reductionCount += 1;
        }
        if (proposal.freezeAmount) {
          acc.totalFreezeAmount += proposal.freezeAmount;
          acc.freezeCount += 1;
        }
        if (proposal.proposalTypes?.includes(ProposalProposalTypeType.Other)) {
          acc.mainResolutionCount += 1;
        }
        return acc;
      },
      {
        totalReductionAmount: 0,
        reductionCount: 0,
        totalFreezeAmount: 0,
        freezeCount: 0,
        mainResolutionCount: 0,
      }
    );
  }, [data]);

  const circlePackData = useMemo(() => {
    if (!data) return null;
    return transformToCirclePackData(data);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p>載入中...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-red-600">資料載入失敗，請稍後再試。</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-y-3 p-4">
        <div className="flex flex-col gap-y-2 md:flex-row md:items-center md:justify-center md:gap-x-6">
          <div className="flex items-center justify-center gap-x-1.5 md:gap-x-6">
            <button
              onClick={() => setActiveTab("legislator")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "legislator"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依立委
            </button>
            <button
              onClick={() => setActiveTab("department")}
              className={`rounded px-2.5 transition-colors ${
                activeTab === "department"
                  ? "bg-[#3E51FF] text-white"
                  : "border border-gray-300 bg-white text-gray-800"
              }`}
            >
              依部會
            </button>
          </div>
          <div className="flex items-center justify-center">
            <VisualizationSelector
              options={yearOptions}
              value={selectOptions[0]}
              onChange={(option) => {
                if (option) setSelectOptions([option]);
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-x-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="amount"
                checked={mode === "amount"}
                onChange={() => setMode("amount")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依金額（刪減/凍結）</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="viz-mode"
                value="count"
                checked={mode === "count"}
                onChange={() => setMode("count")}
                className="h-4 w-4 accent-[#3E51FF]"
              />
              <span>依數量（凍結案/刪減案/建議案）</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 bg-[#E9E9E9] p-2.5 md:mx-auto md:max-w-[488px]">
          <div>
            <p>
              總共刪減{" "}
              <span className="text-[#E9808E]">
                {summaryStats.totalReductionAmount.toLocaleString()}
              </span>
              元（
              <span className="text-[#E9808E]">
                {summaryStats.reductionCount}
              </span>
              個提案）
            </p>
            <p>
              凍結{" "}
              <span className="text-[#E9808E]">
                {summaryStats.totalFreezeAmount.toLocaleString()}
              </span>
              元（
              <span className="text-[#E9808E]">{summaryStats.freezeCount}</span>
              個提案）
            </p>
            <p>
              主決議提案數：
              <span className="text-[#E9808E]">
                {summaryStats.mainResolutionCount}
              </span>
              個
            </p>
          </div>
        </div>
        <BudgetTypeLegend items={BUDGET_TYPE_LEGEND_ITEMS} />
        {activeTab === "legislator" && circlePackData && (
          <CirclePackChart data={circlePackData} />
        )}
        {activeTab === "department" && <DepartmentChart />}
      </div>
    </div>
  );
};

export default Visualization;
