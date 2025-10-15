import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * 分頁狀態類型
 */
type PaginationState = {
  currentPage: number;
  pageSize: number;
  totalCount: number;
};

/**
 * 分頁操作 actions
 */
type PaginationActions = {
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setTotalCount: (count: number) => void;
  resetPagination: () => void;
};

/**
 * 完整的分頁 store 狀態
 */
type PaginationStoreState = {
  pagination: PaginationState;
  actions: PaginationActions;
};

/**
 * 預設值
 */
const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  totalCount: 0,
};

/**
 * 分頁 Store
 * 
 * 管理 /all-budgets 頁面的分頁狀態
 * 遵循專案的 Zustand 最佳實踐模式
 */
export const usePaginationStore = create<PaginationStoreState>()(
  devtools(
    (set) => ({
      pagination: DEFAULT_PAGINATION,

      actions: {
        setPage: (page: number) =>
          set(
            (state) => ({
              pagination: { ...state.pagination, currentPage: page },
            }),
            false,
            "pagination/setPage"
          ),

        nextPage: () =>
          set(
            (state) => {
              const { currentPage, pageSize, totalCount } = state.pagination;
              const totalPages = Math.ceil(totalCount / pageSize);
              const newPage = Math.min(currentPage + 1, totalPages);
              return {
                pagination: { ...state.pagination, currentPage: newPage },
              };
            },
            false,
            "pagination/nextPage"
          ),

        prevPage: () =>
          set(
            (state) => {
              const newPage = Math.max(state.pagination.currentPage - 1, 1);
              return {
                pagination: { ...state.pagination, currentPage: newPage },
              };
            },
            false,
            "pagination/prevPage"
          ),

        setTotalCount: (count: number) =>
          set(
            (state) => ({
              pagination: { ...state.pagination, totalCount: count },
            }),
            false,
            "pagination/setTotalCount"
          ),

        resetPagination: () =>
          set(
            {
              pagination: DEFAULT_PAGINATION,
            },
            false,
            "pagination/reset"
          ),
      },
    }),
    {
      name: "pagination-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

/**
 * Selector hooks（避免不必要的重渲染）
 */
export const usePagination = () =>
  usePaginationStore((state) => state.pagination);

export const usePaginationActions = () =>
  usePaginationStore((state) => state.actions);

/**
 * 計算總頁數的 helper hook
 */
export const useTotalPages = () => {
  const { totalCount, pageSize } = usePagination();
  return Math.ceil(totalCount / pageSize);
};

/**
 * 檢查是否有下一頁
 */
export const useHasNextPage = () => {
  const { currentPage } = usePagination();
  const totalPages = useTotalPages();
  return currentPage < totalPages;
};

/**
 * 檢查是否有上一頁
 */
export const useHasPrevPage = () => {
  const { currentPage } = usePagination();
  return currentPage > 1;
};
