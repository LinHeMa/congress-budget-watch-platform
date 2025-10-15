import { useMemo, useEffect, useRef } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { redirect } from "react-router";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { execute } from "~/graphql/execute";
import { GET_PAGINATED_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";
import content from "./page-content";
import ProgressBar from "~/components/progress-bar";
import BudgetsSelector from "~/components/budgets-selector";
import SortToolbar, { sortOptions } from "~/components/sort-toolbar";
import BudgetTable from "~/components/budget-table";
import { useStore } from "zustand";
import useBudgetSelectStore from "~/stores/budget-selector";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";
import type {
  ProposalOrderByInput,
  ProposalWhereInput,
} from "~/graphql/graphql";
import { OrderDirection } from "~/graphql/graphql";
import AllBudgetsSkeleton from "~/components/skeleton/all-budgets-skeleton";
import Pagination from "~/components/pagination";
import { usePagination, usePaginationActions } from "~/stores/paginationStore";
import { proposalToBudgetTableData } from "./helpers";

const AllBudgets = () => {
  // 分頁狀態
  const { currentPage, pageSize } = usePagination();
  const { setTotalCount, setPage } = usePaginationActions();

  // 排序狀態（現有）
  const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
  const setSelectedSort = useStore(
    useBudgetSelectStore,
    (s) => s.setSelectedSort
  );
  const departmentId = useStore(
    useBudgetSelectStore,
    (s) => s.departmentFilter.departmentId
  );
  const personId = useStore(
    useBudgetSelectStore,
    (s) => s.peopleFilter.personId
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // 重複資料檢測 Map
  const seenProposalIds = useRef<Map<string, boolean>>(new Map());

  // 計算 GraphQL 參數
  const skip = (currentPage - 1) * pageSize;
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

  const whereFilter = useMemo((): ProposalWhereInput => {
    const filters: ProposalWhereInput = {};

    // Department 過濾
    if (departmentId) {
      filters.government = {
        id: { equals: departmentId },
      };
    }

    // People (Legislator) 過濾
    if (personId) {
      filters.proposers = {
        some: {
          id: { equals: personId },
        },
      };
    }

    return filters;
  }, [departmentId, personId]);

  // 修改後的 React Query（支援分頁）
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: proposalQueryKeys.paginated(
      currentPage,
      pageSize,
      selectedSort,
      whereFilter
    ),
    queryFn: () =>
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip,
        take: pageSize,
        orderBy,
        where: whereFilter,
      }),
    placeholderData: keepPreviousData, // 避免切頁時閃爍
  });

  // 更新總數到 store（用於計算總頁數）
  useEffect(() => {
    if (data?.proposalsCount != null) {
      setTotalCount(data.proposalsCount);
    }
  }, [data?.proposalsCount, setTotalCount]);

  // 排序或篩選變更時重置到第 1 頁
  useEffect(() => {
    setPage(1);
  }, [selectedSort, departmentId, personId, setPage]);

  // 重複資料檢測
  useEffect(() => {
    if (!data?.proposals) return;

    // 切換頁碼或排序時清除 Map
    seenProposalIds.current.clear();

    // 檢測重複
    data.proposals.forEach((proposal) => {
      if (seenProposalIds.current.has(proposal.id)) {
        if (import.meta.env.DEV) {
          console.warn(
            `[Pagination] 檢測到重複的 proposal ID: ${proposal.id}`,
            {
              currentPage,
              selectedSort,
              proposal,
            }
          );
        }
      } else {
        seenProposalIds.current.set(proposal.id, true);
      }
    });
  }, [data?.proposals, currentPage, selectedSort]);

  // tableData 邏輯保持不變（但不再需要排序，因為已在 GQL 處理）
  const tableData = useMemo(() => {
    if (!data?.proposals) return [];

    // 直接轉換為 BudgetTableData（排序已由 GraphQL orderBy 處理）
    return data.proposals.map(proposalToBudgetTableData);
  }, [data?.proposals?.length]);

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

        {/* 上方分頁元件（新增）*/}
        <Pagination className="mt-4" />
        {/* 排序下拉（react-select） */}
        <SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />

        {/* 使用新的表格組件渲染清單 */}
        <BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />

        {/* 下方分頁元件（新增，複用同一元件）*/}
        <Pagination className="mt-4 mb-8" />

        {/* Placeholder data 載入提示（可選）*/}
        {isPlaceholderData && (
          <div className="fixed right-4 bottom-4 rounded bg-blue-100 px-4 py-2 text-sm text-blue-800 shadow-lg">
            正在載入新頁面...
          </div>
        )}
      </div>
    </>
  );
};

export default AllBudgets;
