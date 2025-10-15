# PRP: 為 `/all-budgets` 頁面加入分頁功能

## 概述

在 `/all-budgets` 頁面實作伺服器端分頁功能，每頁顯示 10 筆 proposals。包含修改 GraphQL 查詢以支援分頁參數、使用 Zustand 管理分頁狀態、建立可複用的 Pagination 元件，以及實作重複資料檢測機制。

## 背景與研究發現

### 當前 Codebase 狀態

- **框架**: React Router v7 (SPA mode: `ssr: false`)
- **樣式**: TailwindCSS v4 with Vite plugin
- **狀態管理**: 
  - React Query v5.86.0 用於資料獲取
  - Zustand v5.0.8 用於全域/跨元件狀態
- **TypeScript**: v5.8.3 with full type safety
- **GraphQL**: graphql-request v7.2.0 with typed document nodes

### 當前 `/all-budgets` 頁面架構

**檔案**: `app/all-budgets/index.tsx` (220 行)

#### 現有資料獲取方式

```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: proposalQueryKeys.lists(),
  queryFn: () => execute(GET_PROPOSALS_QUERY),
});
```

**問題點**:
- 一次性獲取所有 proposals（無分頁）
- `GET_PROPOSALS_QUERY` 不接受任何參數
- 可能造成大量資料載入效能問題

#### 現有排序整合

```typescript:app/all-budgets/index.tsx
const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
const tableData = useMemo(() => {
  if (!data?.proposals) return [];
  // ... 排序邏輯 ...
  return sortedProposals.map(proposalToBudgetTableData);
}, [data?.proposals, selectedSort]);
```

**關鍵發現**: 排序狀態已使用 Zustand (`budget-selector.tsx` store)

### GraphQL Schema 分析

**檔案**: `schema.graphql` (行 898-899)

```graphql
proposals(
  cursor: ProposalWhereUniqueInput, 
  orderBy: [ProposalOrderByInput!]! = [], 
  skip: Int! = 0, 
  take: Int, 
  where: ProposalWhereInput! = {}
): [Proposal!]
proposalsCount(where: ProposalWhereInput! = {}): Int
```

**重要發現**:
1. ✅ 支援 `skip` 和 `take` 參數（標準的 offset-based pagination）
2. ✅ 支援 `orderBy` 參數（可以整合現有排序）
3. ✅ 提供 `proposalsCount` 查詢總數（用於計算總頁數）
4. ⚠️ `skip` 預設值為 `0`，但被標記為 `!`（non-nullable）

### 現有 Zustand Store 模式

#### 範例 1: 全域 UI Store

**檔案**: `app/stores/uiStore.ts`

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UIState = {
  headerState: HeaderState;
  progressState: ProgressState;
  actions: UIActions;
};

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      headerState: { isShareModalOpen: false },
      progressState: { currentStep: 0, isComplete: false },
      actions: {
        toggleShareModal: () => set(...),
        // ...
      },
    }),
    { name: "ui-store", enabled: process.env.NODE_ENV === "development" }
  )
);

// Selector hooks
export const useHeaderState = () => useUIStore((s) => s.headerState);
export const useUIActions = () => useUIStore((s) => s.actions);
```

**模式總結**:
- 使用 `devtools` middleware 用於開發時調試
- 將 actions 分離到 `actions` 命名空間
- 提供 selector hooks 避免不必要的重渲染

#### 範例 2: 可重複實例的 Store (未採用)

**檔案**: `app/stores/budget-selector.tsx`

使用 `createStore` 工廠模式，但**本次需求不適用**，因為分頁狀態是全域唯一的。

### React Query 整合模式

**檔案**: `app/queries/proposal.queries.ts`

#### 現有 Query Keys 結構

```typescript
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  details: () => [...proposalQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const
```

**關鍵發現**: 已有 `list` 方法支援 filters 參數，可以擴展為分頁參數

### 元件渲染點分析

**檔案**: `app/all-budgets/index.tsx` (行 212-213)

```typescript
{/* 使用新的表格組件渲染清單 */}
<BudgetTable isDesktop={isDesktop} data={tableData} className="mt-4" />
```

**需求**: 在此元件上下都加入 Pagination 元件（共享狀態，符合 DRY 原則）

### 外部研究

#### React Query Pagination 最佳實踐

- **官方文檔**: https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
- **關鍵概念**:
  - 使用 `keepPreviousData` (v4) 或 `placeholderData: keepPreviousData` (v5) 避免載入時閃爍
  - Query key 應包含分頁參數以正確緩存
  - 預取下一頁：`queryClient.prefetchQuery`

**V5 範例**:
```typescript
const { data, isPlaceholderData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
});
```

#### Zustand 分頁狀態模式

- **最佳實踐**: 分頁狀態適合放在全域 store（多元件共享）
- **參考**: https://github.com/pmndrs/zustand/discussions/categories/general

#### Offset vs Cursor Pagination

**本專案選擇**: Offset-based (`skip` + `take`)
- ✅ 實作簡單，適合總數固定的資料集
- ✅ 支援跳轉到任意頁碼
- ❌ 大資料集效能較差（但本專案資料量可接受）

**未採用**: Cursor-based（雖然 schema 支援 `cursor`）
- ✅ 效能好，適合無限滾動
- ❌ 不支援跳轉到特定頁碼
- ❌ 實作複雜度較高

### 重複資料檢測需求分析

**需求**: "使用 Map 物件記住已經拿過的 proposal id，用於檢查是否有拿到重複的"

**分析**:
1. **使用場景**: 檢測伺服器端資料變更導致的重複（例如新增資料後頁碼偏移）
2. **實作位置**: 在資料轉換階段 (`proposalToBudgetTableData` 之前)
3. **清除時機**: 
   - 切換頁碼時清除 Map
   - 變更排序時清除 Map（資料順序改變）
4. **警告處理**: 在開發環境使用 `console.warn` 通知

### 設計決策與理由

#### 決策 1: 使用 Zustand 管理分頁狀態 ✅

**理由**:
- 分頁狀態需要在多個元件間共享（上下 Pagination 元件）
- 符合專案現有的狀態管理模式（`uiStore.ts`）
- 避免 prop drilling
- 與 React Query 分離關注點（資料獲取 vs UI 狀態）

**替代方案（不採用）**:
- ❌ useState + Context: 過度工程化，Zustand 更簡潔
- ❌ URL 參數: 不符合需求（需求未提及 URL 同步）

#### 決策 2: 擴展現有 Query 而非創建新 Query

**理由**:
- 減少程式碼重複
- 保持 query keys 的一致性
- 向後相容（可選參數）

#### 決策 3: 使用 React Query v5 的 `placeholderData`

**理由**:
- 避免切換頁面時出現 loading skeleton 閃爍
- 提升使用者體驗
- 符合 React Query v5 的最佳實踐

## 實作藍圖

### 階段一：建立分頁 Zustand Store

#### 步驟 1.1: 創建 `paginationStore.ts`

**新檔案**: `app/stores/paginationStore.ts`

```typescript
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
    (set, get) => ({
      pagination: DEFAULT_PAGINATION,

      actions: {
        setPage: (page: number) =>
          set(
            (state) => ({
              pagination: { ...state.pagination, currentPage: page },
            }),
            undefined,
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
            undefined,
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
            undefined,
            "pagination/prevPage"
          ),

        setTotalCount: (count: number) =>
          set(
            (state) => ({
              pagination: { ...state.pagination, totalCount: count },
            }),
            undefined,
            "pagination/setTotalCount"
          ),

        resetPagination: () =>
          set(
            {
              pagination: DEFAULT_PAGINATION,
            },
            undefined,
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
```

**設計重點**:
- 遵循 `uiStore.ts` 的模式（`devtools`, actions 分離）
- 提供豐富的 selector hooks
- 加入 devtools action 命名（利於調試）
- 使用 TypeScript 完整類型定義

### 階段二：修改 GraphQL 查詢

#### 步驟 2.1: 創建支援分頁的新 Query

**檔案**: `app/queries/proposal.queries.ts`

**在現有檔案末尾加入**:

```typescript
/**
 * GraphQL query to get paginated proposals with total count
 * Supports pagination (skip/take) and ordering
 *
 * Usage Example:
 *
 * ```tsx
 * const { data } = useQuery({
 *   queryKey: proposalQueryKeys.paginated(page, pageSize, sortBy),
 *   queryFn: () => execute(GET_PAGINATED_PROPOSALS_QUERY, {
 *     skip: (page - 1) * pageSize,
 *     take: pageSize,
 *     orderBy: [{ id: 'desc' }],
 *   }),
 * });
 * ```
 */
export const GET_PAGINATED_PROPOSALS_QUERY = graphql(`
  query GetPaginatedProposals($skip: Int!, $take: Int!, $orderBy: [ProposalOrderByInput!]!) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy) {
      id
      description
      reason
      publishStatus
      result
      freezeAmount
      reductionAmount
      budgetImageUrl
      proposalTypes
      recognitionAnswer
      unfreezeStatus
      government {
        id
        name
        category
        description
      }
      budget {
        id
        projectName
        budgetAmount
        year
        type
        majorCategory
        mediumCategory
        minorCategory
      }
      proposers {
        id
        name
        type
        description
      }
      coSigners {
        id
        name
        type
      }
    }
    proposalsCount
  }
`)
```

**關鍵變更**:
1. 加入 `$skip`, `$take`, `$orderBy` 變數
2. 保留與 `GET_PROPOSALS_QUERY` 相同的欄位（確保相容性）
3. 同時查詢 `proposalsCount`（計算總頁數）

#### 步驟 2.2: 擴展 Query Keys

**檔案**: `app/queries/proposal.queries.ts`

**修改 `proposalQueryKeys` 物件**:

```typescript
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  // 新增: 分頁查詢 keys
  paginated: (page: number, pageSize: number, sortBy: string) => [
    ...proposalQueryKeys.lists(),
    'paginated',
    { page, pageSize, sortBy },
  ] as const,
  details: () => [...proposalQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const
```

**設計重點**:
- 包含 `page`, `pageSize`, `sortBy` 確保每個組合獨立緩存
- 層級結構清晰 (`proposals` → `list` → `paginated`)

### 階段三：建立 Pagination 元件

#### 步驟 3.1: 創建可複用的 Pagination 元件

**新檔案**: `app/components/pagination.tsx`

```typescript
import {
  usePagination,
  usePaginationActions,
  useTotalPages,
  useHasNextPage,
  useHasPrevPage,
} from "~/stores/paginationStore";

type PaginationProps = {
  className?: string;
};

/**
 * 分頁導航元件
 * 
 * 與 Zustand paginationStore 整合，支援上一頁/下一頁/跳轉頁碼
 * 設計為可複用，在 BudgetTable 上下都可使用
 */
const Pagination: React.FC<PaginationProps> = ({ className = "" }) => {
  const { currentPage } = usePagination();
  const { setPage, nextPage, prevPage } = usePaginationActions();
  const totalPages = useTotalPages();
  const hasNext = useHasNextPage();
  const hasPrev = useHasPrevPage();

  // 如果只有一頁或沒有資料，不顯示分頁
  if (totalPages <= 1) return null;

  // 生成頁碼按鈕陣列（最多顯示 7 個按鈕）
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 少於 7 頁：顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 多於 7 頁：智慧顯示
      if (currentPage <= 3) {
        // 當前頁在前面：1 2 3 4 5 ... 10
        pages.push(1, 2, 3, 4, 5, "ellipsis-end", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 當前頁在後面：1 ... 6 7 8 9 10
        pages.push(1, "ellipsis-start", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // 當前頁在中間：1 ... 4 5 6 ... 10
        pages.push(
          1,
          "ellipsis-start",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "ellipsis-end",
          totalPages
        );
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-2 ${className}`}
      aria-label="分頁導航"
    >
      {/* 上一頁按鈕 */}
      <button
        onClick={prevPage}
        disabled={!hasPrev}
        className={`rounded border-2 border-black px-3 py-1 text-sm font-bold transition-colors ${
          hasPrev
            ? "bg-white hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
        aria-label="上一頁"
      >
        ← 上一頁
      </button>

      {/* 頁碼按鈕 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            // 省略號
            return (
              <span
                key={`${page}-${index}`}
                className="px-2 text-gray-400"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => setPage(page)}
              disabled={isActive}
              className={`min-w-[36px] rounded border-2 px-2 py-1 text-sm font-bold transition-colors ${
                isActive
                  ? "border-[#3E51FF] bg-[#3E51FF] text-white cursor-default"
                  : "border-black bg-white hover:bg-gray-100 active:bg-gray-200"
              }`}
              aria-label={`第 ${page} 頁`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* 下一頁按鈕 */}
      <button
        onClick={nextPage}
        disabled={!hasNext}
        className={`rounded border-2 border-black px-3 py-1 text-sm font-bold transition-colors ${
          hasNext
            ? "bg-white hover:bg-gray-100 active:bg-gray-200"
            : "cursor-not-allowed bg-gray-200 text-gray-400"
        }`}
        aria-label="下一頁"
      >
        下一頁 →
      </button>

      {/* 頁面資訊 */}
      <span className="ml-2 text-sm text-gray-600" aria-live="polite">
        第 {currentPage} / {totalPages} 頁
      </span>
    </nav>
  );
};

export default Pagination;
```

**設計重點**:
1. **智慧頁碼顯示**: 總頁數 > 7 時使用省略號
2. **無障礙支援**: ARIA labels, `aria-current`, `aria-live`
3. **視覺回饋**: Hover, active, disabled 狀態
4. **效能優化**: 使用 Zustand selector hooks 避免不必要的重渲染
5. **專案風格一致**: 使用 `#3E51FF` (專案主色), 黑色邊框

### 階段四：整合到 AllBudgets 頁面

#### 步驟 4.1: 修改 `all-budgets/index.tsx`

**檔案**: `app/all-budgets/index.tsx`

**修改點 1: 加入 imports**

```typescript
import { useMemo, useEffect, useRef } from "react"; // 加入 useEffect, useRef
import {
  usePagination,
  usePaginationActions,
} from "~/stores/paginationStore";
import {
  GET_PAGINATED_PROPOSALS_QUERY, // 新的分頁查詢
  proposalQueryKeys,
} from "~/queries";
import Pagination from "~/components/pagination"; // 新的分頁元件
import { keepPreviousData } from "@tanstack/react-query"; // React Query v5
```

**修改點 2: 使用分頁狀態**

```typescript
const AllBudgets = () => {
  // 分頁狀態
  const { currentPage, pageSize } = usePagination();
  const { setTotalCount } = usePaginationActions();
  
  // 排序狀態（現有）
  const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
  const setSelectedSort = useStore(
    useBudgetSelectStore,
    (s) => s.setSelectedSort
  );

  // 重複資料檢測 Map
  const seenProposalIds = useRef<Map<string, boolean>>(new Map());

  // 計算 GraphQL 參數
  const skip = (currentPage - 1) * pageSize;
  const orderBy = useMemo(() => {
    // 將 sortOptions 的 value 轉換為 GraphQL orderBy 格式
    const sortOption = sortOptions.find((o) => o.value === selectedSort);
    if (!sortOption) return [{ id: "desc" as const }];

    return [
      {
        [sortOption.field]: sortOption.direction as "asc" | "desc",
      },
    ];
  }, [selectedSort]);

  // 修改後的 React Query（支援分頁）
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: proposalQueryKeys.paginated(currentPage, pageSize, selectedSort),
    queryFn: () =>
      execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip,
        take: pageSize,
        orderBy,
      }),
    placeholderData: keepPreviousData, // 避免切頁時閃爍
  });

  // 更新總數到 store（用於計算總頁數）
  useEffect(() => {
    if (data?.proposalsCount != null) {
      setTotalCount(data.proposalsCount);
    }
  }, [data?.proposalsCount, setTotalCount]);

  // 重複資料檢測
  useEffect(() => {
    if (!data?.proposals) return;

    // 切換頁碼或排序時清除 Map
    seenProposalIds.current.clear();

    // 檢測重複
    data.proposals.forEach((proposal) => {
      if (seenProposalIds.current.has(proposal.id)) {
        console.warn(
          `[Pagination] 檢測到重複的 proposal ID: ${proposal.id}`,
          {
            currentPage,
            selectedSort,
            proposal,
          }
        );
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
  }, [data?.proposals]);

  // Loading & Error 處理保持不變
  if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);

  return (
    <>
      <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
        {/* ... 現有的 header, progress, selector 等保持不變 ... */}

        {/* 排序下拉（現有） */}
        <SortToolbar selectedValue={selectedSort} onChange={setSelectedSort} />
        <div className="h-0.5 w-full bg-black md:hidden" />

        {/* 上方分頁元件（新增）*/}
        <Pagination className="mt-4" />

        {/* 使用新的表格組件渲染清單（現有）*/}
        <BudgetTable
          isDesktop={isDesktop}
          data={tableData}
          className="mt-4"
        />

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
```

**修改點 3: 移除客戶端排序邏輯**

```typescript
// ❌ 刪除這段（排序改由 GraphQL orderBy 處理）
const proposalsAsBudgets = data.proposals.map(proposalToBudgetForSorting);
const sortedBudgets = sortBudgetsByOption(proposalsAsBudgets, selectedSort);
const sortedProposals = sortedBudgets
  .map((sortedBudget) => data.proposals?.find((p) => p.id === sortedBudget.id))
  .filter((p): p is Proposal => !!p);

// ✅ 直接使用 data.proposals（已由 GraphQL 排序）
return data.proposals.map(proposalToBudgetTableData);
```

#### 步驟 4.2: 更新 `sort-toolbar.tsx` 整合

**檔案**: `app/components/sort-toolbar.tsx`

**新增 helper 函式** (在檔案末尾):

```typescript
/**
 * 將 sortOptions 的 value 轉換為 GraphQL ProposalOrderByInput 格式
 * 
 * @example
 * sortValueToOrderBy("budgetAmount-desc") 
 * // => [{ budgetAmount: "desc" }]
 */
export function sortValueToOrderBy(
  sortValue: string
): Array<Record<string, "asc" | "desc">> {
  const sortOption = sortOptions.find((o) => o.value === sortValue);
  
  if (!sortOption) {
    return [{ id: "desc" }]; // 預設排序
  }

  // 將 Budget field 映射到 Proposal field
  // 注意：Budget 和 Proposal 的欄位名稱不同
  const fieldMapping: Record<string, string> = {
    projectName: "description", // Proposal 沒有 projectName，用 description
    budgetAmount: "freezeAmount", // 或 reductionAmount，根據業務需求
    year: "id", // Proposal 沒有 year，暫用 id（需確認業務邏輯）
  };

  const proposalField = fieldMapping[sortOption.field] || "id";

  return [
    {
      [proposalField]: sortOption.direction,
    },
  ];
}
```

**⚠️ 重要**: 需要與業務團隊確認 `Budget` 欄位到 `Proposal` 欄位的映射關係。

## 關鍵實作細節

### 1. GraphQL OrderBy 整合

**挑戰**: `sortOptions` 基於 `Budget` 型別，但查詢的是 `Proposal` 型別

**解決方案**:

```typescript
// 選項 A: 修改 sortOptions 改為 Proposal 欄位
export const sortOptions = [
  {
    value: "description-asc",
    label: "提案描述 (A-Z)",
    field: "description", // Proposal 欄位
    direction: "asc",
  },
  {
    value: "freezeAmount-desc",
    label: "凍結金額 (高到低)",
    field: "freezeAmount", // Proposal 欄位
    direction: "desc",
  },
  // ...
];

// 選項 B: 保持現有 sortOptions，在 AllBudgets 中映射
const orderBy = useMemo(() => {
  const sortOption = sortOptions.find((o) => o.value === selectedSort);
  if (!sortOption) return [{ id: "desc" }];

  // 映射 Budget field → Proposal field
  const fieldMap: Record<string, string> = {
    projectName: "description",
    budgetAmount: "freezeAmount",
    year: "id", // 需確認
  };

  return [{
    [fieldMap[sortOption.field] || "id"]: sortOption.direction,
  }];
}, [selectedSort]);
```

**推薦**: **選項 A**（修改 sortOptions）
- 更清晰，避免映射邏輯
- 與資料模型一致
- 減少潛在的錯誤

### 2. React Query Placeholder Data

**目的**: 切換頁面時，顯示上一頁的資料避免閃爍

**實作**:

```typescript
import { keepPreviousData } from "@tanstack/react-query";

const { data, isPlaceholderData } = useQuery({
  queryKey: proposalQueryKeys.paginated(currentPage, pageSize, selectedSort),
  queryFn: () => execute(...),
  placeholderData: keepPreviousData, // 關鍵
});

// 可選：顯示載入提示
{isPlaceholderData && (
  <div className="fixed right-4 bottom-4 ...">
    正在載入新頁面...
  </div>
)}
```

### 3. 重複資料檢測實作

**需求分析**: 
- 使用 `Map<string, boolean>` 記錄已見過的 proposal IDs
- 在開發環境使用 `console.warn` 通知（不影響生產環境）
- 切換頁碼或排序時清除 Map

**實作**:

```typescript
const seenProposalIds = useRef<Map<string, boolean>>(new Map());

useEffect(() => {
  if (!data?.proposals) return;

  // 清除舊資料
  seenProposalIds.current.clear();

  // 檢測當前頁的重複
  data.proposals.forEach((proposal) => {
    if (seenProposalIds.current.has(proposal.id)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Pagination] 檢測到重複的 proposal ID: ${proposal.id}`,
          { currentPage, selectedSort, proposal }
        );
      }
    } else {
      seenProposalIds.current.set(proposal.id, true);
    }
  });
}, [data?.proposals, currentPage, selectedSort]);
```

### 4. 無障礙 (Accessibility) 實作

**Pagination 元件**:

```typescript
<nav aria-label="分頁導航">
  <button
    aria-label="上一頁"
    disabled={!hasPrev}
  >
    ← 上一頁
  </button>

  <button
    aria-label={`第 ${page} 頁`}
    aria-current={isActive ? "page" : undefined}
  >
    {page}
  </button>

  <span aria-live="polite">
    第 {currentPage} / {totalPages} 頁
  </span>
</nav>
```

**關鍵點**:
- `aria-label`: 螢幕閱讀器友好
- `aria-current="page"`: 標示當前頁
- `aria-live="polite"`: 宣告頁碼變更
- `disabled` 狀態: 禁用不可用按鈕

### 5. 效能優化策略

#### 策略 1: Zustand Selector Hooks

```typescript
// ❌ 不好：訂閱整個 store
const store = usePaginationStore();

// ✅ 好：只訂閱需要的狀態
const { currentPage } = usePagination();
const { setPage } = usePaginationActions();
```

#### 策略 2: useMemo 避免重複計算

```typescript
const orderBy = useMemo(() => {
  // 昂貴的映射邏輯
  return computeOrderBy(selectedSort);
}, [selectedSort]); // 只在 selectedSort 變更時重算
```

#### 策略 3: React Query 預取下一頁 (可選增強)

```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

useEffect(() => {
  if (hasNext) {
    // 預取下一頁
    queryClient.prefetchQuery({
      queryKey: proposalQueryKeys.paginated(currentPage + 1, pageSize, selectedSort),
      queryFn: () => execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: currentPage * pageSize,
        take: pageSize,
        orderBy,
      }),
    });
  }
}, [currentPage, hasNext, pageSize, selectedSort, queryClient, orderBy]);
```

## 驗證步驟

### 階段一：TypeScript 與 Linting 檢查

```bash
# 1. 生成 GraphQL 類型
pnpm codegen

# 2. TypeScript 類型檢查
pnpm typecheck

# 預期結果：無錯誤

# 3. ESLint 檢查
pnpm lint:check

# 預期結果：無錯誤或警告

# 4. 格式化檢查
pnpm format:check

# 預期結果：所有檔案符合格式
```

### 階段二：建置驗證

```bash
# 清除舊建置
rm -rf build/

# 執行生產建置
pnpm build

# 預期結果：建置成功，無錯誤
# 輸出應包含：
# ✓ built in XXXms
```

### 階段三：功能測試

#### 測試 1: 分頁基本功能

**操作步驟**:
1. 啟動開發伺服器：`pnpm dev`
2. 瀏覽 `/all-budgets` 頁面
3. 檢查初始狀態

**預期結果**:
- [ ] 頁面顯示前 10 筆 proposals
- [ ] 上方和下方都顯示 Pagination 元件
- [ ] 顯示「第 1 / X 頁」（X = 總數 / 10，無條件進位）
- [ ] 「上一頁」按鈕為禁用狀態
- [ ] 「下一頁」按鈕為啟用狀態（如果有第 2 頁）
- [ ] 頁碼按鈕「1」為高亮狀態（藍色背景）

#### 測試 2: 頁面導航

**操作步驟**:
1. 點擊「下一頁」按鈕
2. 觀察頁面變化
3. 點擊「上一頁」按鈕

**預期結果**:
- [ ] 點擊「下一頁」後，顯示第 2 頁的資料（不同的 10 筆）
- [ ] 頁碼更新為「第 2 / X 頁」
- [ ] 頁碼按鈕「2」變為高亮
- [ ] 「上一頁」按鈕變為啟用狀態
- [ ] 使用 `placeholderData`：切換時短暫顯示上一頁資料（無閃爍）
- [ ] 點擊「上一頁」後，回到第 1 頁

#### 測試 3: 頁碼跳轉

**操作步驟**:
1. 如果總頁數 > 3，點擊第 3 頁的頁碼按鈕
2. 觀察頁面變化

**預期結果**:
- [ ] 直接跳轉到第 3 頁
- [ ] 顯示第 3 頁的資料（第 21-30 筆）
- [ ] 頁碼按鈕「3」為高亮狀態
- [ ] 上下 Pagination 元件狀態同步

#### 測試 4: 邊界測試

**操作步驟**:
1. 導航到最後一頁
2. 嘗試點擊「下一頁」
3. 導航到第 1 頁
4. 嘗試點擊「上一頁」

**預期結果**:
- [ ] 在最後一頁時，「下一頁」按鈕為禁用狀態（灰色）
- [ ] 點擊禁用的「下一頁」無反應
- [ ] 在第 1 頁時，「上一頁」按鈕為禁用狀態
- [ ] 點擊禁用的「上一頁」無反應

#### 測試 5: 排序與分頁整合

**操作步驟**:
1. 在第 2 頁時
2. 變更排序選項（例如從「專案名稱 (A-Z)」改為「預算金額 (高到低)」）
3. 觀察結果

**預期結果**:
- [ ] 變更排序後，自動回到第 1 頁（或保持在第 2 頁，顯示新排序的第 2 頁資料）
- [ ] 資料順序改變
- [ ] 分頁元件狀態正確

**⚠️ 業務決策**:  
需要確認排序變更時是否應該重置到第 1 頁。如果需要：

```typescript
// 在 AllBudgets 元件中加入
useEffect(() => {
  // 排序變更時重置到第 1 頁
  setPage(1);
}, [selectedSort, setPage]);
```

#### 測試 6: 重複資料檢測

**操作步驟**:
1. 開啟瀏覽器開發者工具的 Console
2. 導航不同頁面
3. 觀察 Console 輸出

**預期結果**:
- [ ] 正常情況下，Console 無警告
- [ ] 如果有重複的 proposal ID，顯示：
  ```
  [Pagination] 檢測到重複的 proposal ID: xxx
  {currentPage: 2, selectedSort: "...", proposal: {...}}
  ```

#### 測試 7: Placeholder Data 效果

**操作步驟**:
1. 在較慢的網路環境下（Chrome DevTools → Network → Slow 3G）
2. 切換頁面
3. 觀察載入體驗

**預期結果**:
- [ ] 切換頁面時，短暫顯示上一頁資料（不是空白或 skeleton）
- [ ] 右下角顯示「正在載入新頁面...」提示（如果實作）
- [ ] 新資料載入後，平滑替換

#### 測試 8: Zustand DevTools

**操作步驟**:
1. 安裝 Redux DevTools Extension（Zustand 相容）
2. 開啟 DevTools
3. 切換頁面、變更排序

**預期結果**:
- [ ] DevTools 中顯示 "pagination-store"
- [ ] 動作記錄清晰：
  - `pagination/setPage`
  - `pagination/nextPage`
  - `pagination/prevPage`
  - `pagination/setTotalCount`
- [ ] 可以時間旅行（回到之前的狀態）

#### 測試 9: 無障礙測試

**操作步驟**:
1. 使用鍵盤導航（Tab, Enter, Space）
2. 使用螢幕閱讀器（macOS VoiceOver: Cmd+F5）

**預期結果**:
- [ ] 使用 Tab 鍵可以聚焦到所有按鈕
- [ ] 按 Enter 或 Space 可以觸發按鈕
- [ ] 螢幕閱讀器宣告「分頁導航」
- [ ] 宣告「上一頁按鈕，已禁用」或「上一頁按鈕」
- [ ] 宣告「第 X 頁按鈕，當前頁」
- [ ] 頁碼變更時，宣告「第 X / Y 頁」

#### 測試 10: 響應式測試

**操作步驟**:
1. 調整瀏覽器視窗大小
2. 測試手機版 (< 768px)
3. 測試桌面版 (>= 768px)

**預期結果**:
- [ ] 手機版：Pagination 元件保持可用，按鈕大小適當
- [ ] 桌面版：Pagination 元件置中顯示，間距合適
- [ ] 所有斷點下，功能正常運作

### 階段四：效能測試

#### 測試 11: 重渲染檢測

**工具**: React DevTools Profiler

**操作步驟**:
1. 開啟 React DevTools
2. 切換到 Profiler 標籤
3. 點擊「Record」
4. 切換頁面
5. 停止記錄，分析結果

**預期結果**:
- [ ] Pagination 元件：只有使用的 selector 資料變更時才重渲染
- [ ] BudgetTable 元件：只在 `tableData` 變更時重渲染
- [ ] 其他元件（Header, ProgressBar）：不應該重渲染

#### 測試 12: 網路請求檢查

**工具**: Chrome DevTools Network tab

**操作步驟**:
1. 開啟 Network tab
2. 篩選 GraphQL 請求
3. 切換不同頁面
4. 檢查請求參數

**預期結果**:
- [ ] 切換到第 2 頁：發送 `skip: 10, take: 10`
- [ ] 切換到第 3 頁：發送 `skip: 20, take: 10`
- [ ] 每個頁面的請求只發送一次（React Query 緩存生效）
- [ ] 返回之前瀏覽過的頁面：不發送請求（使用緩存）

#### 測試 13: React Query 緩存

**操作步驟**:
1. 導航到第 2 頁（觀察網路請求）
2. 切換到第 3 頁
3. 返回第 2 頁
4. 檢查 Network tab

**預期結果**:
- [ ] 第一次訪問第 2 頁：發送 GraphQL 請求
- [ ] 返回第 2 頁：不發送請求（使用緩存資料）
- [ ] 資料立即顯示（無 loading 狀態）

## 錯誤處理策略

### 潛在問題與解決方案

#### 問題 1: GraphQL 查詢失敗

**症狀**: 
- `isError` 為 `true`
- Console 顯示 GraphQL 錯誤

**可能原因**:
- `orderBy` 參數格式錯誤
- 欄位名稱拼寫錯誤
- 網路連線問題

**診斷步驟**:
1. 檢查 Network tab 的 GraphQL 請求
2. 查看請求的 variables
3. 檢查回應的 errors 陣列

**解決方案**:
```typescript
// 加入 error logging
const { data, isError, error } = useQuery({
  queryKey: proposalQueryKeys.paginated(...),
  queryFn: () => execute(GET_PAGINATED_PROPOSALS_QUERY, { ... }),
  onError: (err) => {
    console.error('[Pagination] GraphQL query failed:', err);
  },
});

// 顯示錯誤訊息給使用者
if (isError) {
  return (
    <div className="p-5 text-center">
      <p className="text-red-600">載入資料時發生錯誤</p>
      <button onClick={() => queryClient.refetchQueries()}>
        重試
      </button>
    </div>
  );
}
```

#### 問題 2: 分頁狀態不同步

**症狀**: 
- 上下 Pagination 元件顯示不同頁碼
- 按鈕狀態不一致

**可能原因**:
- Zustand store 更新失敗
- 元件未正確訂閱 store

**診斷步驟**:
1. 開啟 Redux DevTools
2. 檢查 `pagination-store` 的狀態
3. 確認 actions 是否正確 dispatch

**解決方案**:
```typescript
// 確保使用 selector hooks
const { currentPage } = usePagination(); // ✅
const store = usePaginationStore(); // ❌ 不要這樣用

// 檢查 store 是否正確初始化
console.log('Pagination store:', usePaginationStore.getState());
```

#### 問題 3: 切換排序後頁碼錯亂

**症狀**: 
- 變更排序後，仍停留在第 5 頁（但新排序可能只有 3 頁）

**解決方案**:
```typescript
// 在 AllBudgets 元件中加入
useEffect(() => {
  // 排序變更時重置到第 1 頁
  setPage(1);
}, [selectedSort, setPage]);
```

#### 問題 4: `proposalsCount` 為 0 或 undefined

**症狀**: 
- Pagination 不顯示（`totalPages <= 1`）
- 或顯示「第 1 / 0 頁」

**可能原因**:
- GraphQL query 未正確返回 `proposalsCount`
- 資料庫中無資料

**診斷步驟**:
```typescript
useEffect(() => {
  console.log('proposalsCount:', data?.proposalsCount);
  console.log('proposals length:', data?.proposals?.length);
}, [data]);
```

**解決方案**:
```typescript
// 在 setTotalCount 前加入防禦性檢查
useEffect(() => {
  if (data?.proposalsCount != null && data.proposalsCount >= 0) {
    setTotalCount(data.proposalsCount);
  } else {
    console.warn('[Pagination] Invalid proposalsCount:', data?.proposalsCount);
    setTotalCount(0);
  }
}, [data?.proposalsCount, setTotalCount]);
```

#### 問題 5: 頁碼按鈕顯示錯誤

**症狀**: 
- 總頁數 20，但只顯示 1, 2, 3, ..., 20（缺少中間頁碼）
- 或省略號位置錯誤

**可能原因**:
- `getPageNumbers` 函式邏輯錯誤

**診斷步驟**:
```typescript
// 在 Pagination 元件中加入 logging
const pageNumbers = getPageNumbers();
console.log('Page numbers:', pageNumbers, { currentPage, totalPages });
```

**解決方案**:
- 參考實作藍圖中的 `getPageNumbers` 函式
- 測試邊界情況（totalPages = 1, 5, 7, 10, 100）

#### 問題 6: TypeScript 類型錯誤

**症狀**: 
- `pnpm typecheck` 報錯
- `orderBy` 參數類型不匹配

**常見錯誤**:
```typescript
// ❌ 錯誤：ProposalOrderByInput 不接受動態 key
const orderBy = [{ [dynamicField]: "asc" }];
```

**解決方案**:
```typescript
// ✅ 使用類型斷言或預定義映射
const orderBy: ProposalOrderByInput[] = [
  {
    [sortOption.field as keyof ProposalOrderByInput]: sortOption.direction as OrderDirection,
  },
];

// 或使用預定義映射（更安全）
const orderByMap: Record<string, ProposalOrderByInput> = {
  "description-asc": { description: "asc" },
  "description-desc": { description: "desc" },
  "freezeAmount-asc": { freezeAmount: "asc" },
  "freezeAmount-desc": { freezeAmount: "desc" },
  // ...
};
const orderBy = [orderByMap[selectedSort] || { id: "desc" }];
```

## 文檔需求

### 1. 程式碼註解

**paginationStore.ts**:
- Store 用途說明
- 每個 action 的功能
- Selector hooks 的使用時機

**pagination.tsx**:
- 元件 props 說明
- 頁碼生成邏輯註解
- 無障礙 ARIA 屬性說明

**all-budgets/index.tsx**:
- 分頁整合邏輯註解
- 重複資料檢測機制說明
- orderBy 映射邏輯註解

### 2. 更新 FEAT 文件

**檔案**: `FEATs/add-pagination.md`

在文件末尾加入：

```markdown
## 實作完成

- **實作日期**: {完成日期}
- **修改檔案**:
  - 新增: `app/stores/paginationStore.ts`
  - 新增: `app/components/pagination.tsx`
  - 修改: `app/all-budgets/index.tsx`
  - 修改: `app/queries/proposal.queries.ts`
  - 修改: `app/components/sort-toolbar.tsx` (可選)

- **實作內容**:
  1. 建立 Zustand paginationStore（devtools 整合）
  2. 創建分頁查詢 `GET_PAGINATED_PROPOSALS_QUERY`
  3. 擴展 query keys 支援分頁參數
  4. 實作可複用的 Pagination 元件（ARIA 支援）
  5. 整合 React Query `placeholderData` 避免閃爍
  6. 實作重複資料檢測機制（Map 物件）
  7. 整合排序與分頁（GraphQL orderBy）

- **測試結果**: 
  - ✓ 所有功能測試通過
  - ✓ TypeScript 類型檢查通過
  - ✓ 無障礙測試通過
  - ✓ 效能測試通過

- **已知問題**: {如有}

- **待優化項目**:
  - 可選：實作預取下一頁（提升體驗）
  - 可選：加入載入骨架（取代 placeholder data）
  - 確認 Budget → Proposal 欄位映射關係
```

### 3. 建立使用範例文件（可選）

**新檔案**: `app/examples/pagination-usage.tsx`

```typescript
/**
 * Pagination 使用範例
 * 
 * 展示如何在其他頁面使用分頁功能
 */

import { useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";
import { usePagination, usePaginationActions } from "~/stores/paginationStore";
import Pagination from "~/components/pagination";

const ExamplePage = () => {
  const { currentPage, pageSize } = usePagination();
  const { setTotalCount } = usePaginationActions();

  const { data } = useQuery({
    queryKey: ['example', currentPage],
    queryFn: () => fetchData(currentPage, pageSize),
    placeholderData: keepPreviousData,
  });

  // 更新總數
  useEffect(() => {
    if (data?.total) {
      setTotalCount(data.total);
    }
  }, [data?.total, setTotalCount]);

  return (
    <div>
      <Pagination className="mb-4" />
      {/* 你的內容 */}
      <Pagination className="mt-4" />
    </div>
  );
};
```

## 預期交付成果

### 1. 新增檔案

- ✅ `app/stores/paginationStore.ts` (~200 行)
  - Zustand store 定義
  - Selector hooks
  - Helper hooks (useTotalPages, useHasNextPage, etc.)

- ✅ `app/components/pagination.tsx` (~150 行)
  - 可複用的 Pagination 元件
  - 智慧頁碼顯示邏輯
  - 完整的無障礙支援

### 2. 修改檔案

- ✅ `app/queries/proposal.queries.ts`
  - 新增 `GET_PAGINATED_PROPOSALS_QUERY`
  - 擴展 `proposalQueryKeys.paginated`

- ✅ `app/all-budgets/index.tsx`
  - 整合 paginationStore
  - 使用分頁查詢
  - 加入重複資料檢測
  - 整合 Pagination 元件（上下各一）
  - 實作 `placeholderData`

- ⚠️ `app/components/sort-toolbar.tsx` (可選)
  - 加入 `sortValueToOrderBy` helper 函式
  - 或修改 `sortOptions` 改為 Proposal 欄位

### 3. 類型定義

- ✅ 完整的 TypeScript 類型
- ✅ GraphQL 自動生成的類型（透過 `pnpm codegen`）
- ✅ Zustand store 類型

### 4. 測試結果

- ✅ TypeScript 類型檢查通過
- ✅ ESLint 檢查通過
- ✅ 生產建置成功
- ✅ 所有功能測試通過（參考驗證步驟）

## 成功標準

- ✅ 每頁顯示 10 筆 proposals（可透過 `pageSize` 調整）
- ✅ 上下 Pagination 元件狀態同步
- ✅ 支援上一頁 / 下一頁 / 跳轉頁碼
- ✅ 與排序功能正確整合（GraphQL orderBy）
- ✅ 重複資料檢測機制運作正常
- ✅ 切換頁面時使用 `placeholderData` 避免閃爍
- ✅ 完整的無障礙支援（ARIA labels, 鍵盤導航）
- ✅ Zustand DevTools 整合（開發環境）
- ✅ React Query 緩存正常運作
- ✅ TypeScript 無錯誤
- ✅ 效能優化（selector hooks, useMemo）
- ✅ 響應式設計（手機 / 桌面版）
- ✅ 符合專案視覺風格（#3E51FF, 黑色邊框）

## 風險緩解

### 回滾計畫

如果實作導致無法解決的問題：

```bash
# 使用 Git 回滾所有變更
git checkout HEAD -- \
  app/stores/paginationStore.ts \
  app/components/pagination.tsx \
  app/all-budgets/index.tsx \
  app/queries/proposal.queries.ts

# 或查看變更差異
git diff app/all-budgets/index.tsx
```

### 漸進式實作建議

如果擔心一次性修改風險過高，可以採用以下順序：

#### 階段 A: 建立基礎設施（無 UI 變更）
1. 創建 `paginationStore.ts`
2. 創建 `GET_PAGINATED_PROPOSALS_QUERY`
3. 擴展 `proposalQueryKeys`
4. 測試：Zustand DevTools 可見，GraphQL query 可執行

#### 階段 B: 整合查詢（資料層變更）
1. 修改 `all-budgets/index.tsx` 使用分頁查詢
2. 暫時硬編碼 `currentPage = 1`
3. 測試：資料正確載入，只顯示 10 筆

#### 階段 C: 加入 UI（可見變更）
1. 創建 `Pagination` 元件
2. 整合到頁面（上下各一）
3. 測試：分頁功能完整運作

#### 階段 D: 優化與完善
1. 加入 `placeholderData`
2. 加入重複資料檢測
3. 調整樣式與無障礙
4. 最終測試

每個階段都進行完整測試後再進入下一階段。

## 參考資源

### 關鍵文檔

#### React Query v5
- **Pagination Guide**: https://tanstack.com/query/latest/docs/framework/react/guides/paginated-queries
- **keepPreviousData**: https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5#new-way-to-mark-a-query-as-placeholder
- **Query Keys**: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

#### Zustand
- **官方文檔**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **DevTools Middleware**: https://docs.pmnd.rs/zustand/integrations/persisting-store-data#usage-with-redux-devtools
- **Best Practices**: https://docs.pmnd.rs/zustand/guides/prevent-rerenders-with-use-shallow

#### GraphQL
- **Keystone GraphQL Schema**: {專案 API 文檔 URL}
- **graphql-request**: https://github.com/jasonkuhrt/graphql-request
- **Typed Document Node**: https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node

#### Accessibility
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **Pagination Pattern**: https://www.w3.org/WAI/tutorials/page-structure/navigation/#pagination

### 專案內部參考

- **現有 Zustand Stores**: 
  - `app/stores/uiStore.ts` - 全域 UI 狀態
  - `app/stores/budget-selector.tsx` - 預算選擇器
  - `app/stores/vote.store.ts` - 投票狀態

- **React Query 使用**:
  - `app/all-budgets/index.tsx` - 現有查詢模式
  - `app/budget-detail/index.tsx` - 詳情頁查詢

- **元件樣式**:
  - `app/components/sort-toolbar.tsx` - 排序選擇器樣式
  - `app/components/budget-table.tsx` - 表格樣式

- **GraphQL 查詢**:
  - `app/queries/proposal.queries.ts` - 現有 proposal 查詢
  - `schema.graphql` - 完整 GraphQL schema

## 實作時間估計

1. **建立 Zustand Store** (30 分鐘)
   - 定義類型
   - 實作 actions
   - 創建 selector hooks
   - 加入 devtools

2. **修改 GraphQL 查詢** (20 分鐘)
   - 創建 `GET_PAGINATED_PROPOSALS_QUERY`
   - 擴展 query keys
   - 執行 `pnpm codegen`

3. **建立 Pagination 元件** (45 分鐘)
   - 實作基本 UI
   - 加入智慧頁碼生成
   - 無障礙 ARIA 屬性
   - 樣式調整

4. **整合到 AllBudgets 頁面** (40 分鐘)
   - 整合 paginationStore
   - 修改 useQuery
   - 加入重複資料檢測
   - 整合 Pagination 元件

5. **排序整合** (30 分鐘)
   - 修改 orderBy 邏輯
   - 測試排序 + 分頁組合
   - 決定是否重置頁碼

6. **測試與調試** (60 分鐘)
   - 功能測試（所有測試案例）
   - 無障礙測試
   - 效能測試
   - 修復 bugs

7. **文檔與收尾** (15 分鐘)
   - 加入程式碼註解
   - 更新 FEAT 文件
   - 最終檢查

**總預估時間**: ~4 小時（完整實作、測試與文檔）

**最小可行實作時間**: ~2.5 小時（不含優化與詳細測試）

## 信心評分: 8.5/10

### 高信心理由

1. **完整的技術棧支援**: 
   - GraphQL schema 原生支援 `skip`/`take`
   - React Query v5 有成熟的分頁最佳實踐
   - Zustand 專案已採用且有清晰的模式

2. **清晰的實作路徑**:
   - 所有檔案結構明確
   - 有現有模式可參考（uiStore.ts）
   - TypeScript 類型安全

3. **可逆性高**:
   - 主要是新增檔案（低風險）
   - 修改的檔案有清楚的回滾計畫
   - 可以漸進式實作

4. **完整的驗證步驟**:
   - 13 個詳細的測試案例
   - 可執行的驗證命令
   - 清晰的成功標準

5. **專案一致性**:
   - 遵循現有的 Zustand 模式
   - 符合 React Query 使用慣例
   - 保持視覺風格一致

### 扣 1.5 分原因

1. **欄位映射不確定性** (-0.5):
   - Budget 欄位到 Proposal 欄位的映射需要業務確認
   - 可能需要調整 sortOptions

2. **排序重置邏輯待確認** (-0.3):
   - 需要業務決策：排序變更時是否重置到第 1 頁

3. **重複資料檢測的實際需求** (-0.4):
   - 需求提到但未說明具體場景
   - 實作邏輯可能需要調整

4. **手動測試依賴** (-0.3):
   - 無自動化測試
   - 需要大量手動驗證（13 個測試案例）

### 一次性實作成功機率

基於本 PRP 提供的：
- ✅ 詳細的程式碼實作範例
- ✅ 完整的類型定義
- ✅ 清晰的整合步驟
- ✅ 豐富的錯誤處理策略
- ✅ 可執行的驗證步驟
- ✅ 現有 codebase 的深入分析

**預估成功率**: **85%**

AI Agent 應能在不需要額外澄清的情況下，完成核心功能實作。剩餘 15% 的不確定性主要來自：
- 欄位映射需要業務確認（可能需要一輪調整）
- 細節樣式調整（可能需要根據實際效果微調）
- 邊界情況的 edge cases 處理

## 附錄：常見問題 FAQ

### Q1: 為什麼使用 Zustand 而非 URL 參數管理分頁？

**A**: 
- 需求未明確要求 URL 同步
- Zustand 實作更簡單，與專案現有模式一致
- 如未來需要 URL 同步，可以加入 `router.push` 整合

### Q2: 如何在其他頁面複用分頁功能？

**A**:
```typescript
// 1. 使用同一個 paginationStore（全域共享）
import { usePagination, usePaginationActions } from "~/stores/paginationStore";
import Pagination from "~/components/pagination";

// 2. 在你的頁面中
const { currentPage, pageSize } = usePagination();
const { setTotalCount } = usePaginationActions();

// 3. 整合 useQuery
const { data } = useQuery({
  queryKey: ['yourData', currentPage],
  queryFn: () => fetchYourData(currentPage, pageSize),
});

// 4. 更新總數
useEffect(() => {
  setTotalCount(data?.total || 0);
}, [data?.total]);

// 5. 使用 Pagination 元件
<Pagination />
```

**注意**: 如果多個頁面需要獨立的分頁狀態，需要：
- 使用 `createStore` 工廠模式（參考 `budget-selector.tsx`）
- 或在 `paginationStore` 中加入命名空間

### Q3: 如何調整每頁筆數？

**A**:
```typescript
// 在 paginationStore.ts 中修改 DEFAULT_PAGINATION
const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: 20, // 改為 20 筆
  totalCount: 0,
};

// 或動態調整（需要加入 action）
type PaginationActions = {
  // ... 現有 actions
  setPageSize: (size: number) => void;
};

// 實作
setPageSize: (size: number) =>
  set(
    (state) => ({
      pagination: { 
        ...state.pagination, 
        pageSize: size,
        currentPage: 1 // 重置到第 1 頁
      },
    }),
    undefined,
    "pagination/setPageSize"
  ),
```

### Q4: 如何實作無限滾動而非頁碼？

**A**: 
本 PRP 實作的是傳統分頁。如需無限滾動：
- 使用 React Query 的 `useInfiniteQuery`
- 改用 cursor-based pagination
- 參考: https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries

### Q5: 如何預取下一頁提升體驗？

**A**:
```typescript
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
const hasNext = useHasNextPage();

useEffect(() => {
  if (hasNext) {
    queryClient.prefetchQuery({
      queryKey: proposalQueryKeys.paginated(
        currentPage + 1, 
        pageSize, 
        selectedSort
      ),
      queryFn: () => execute(GET_PAGINATED_PROPOSALS_QUERY, {
        skip: currentPage * pageSize,
        take: pageSize,
        orderBy,
      }),
    });
  }
}, [currentPage, hasNext, pageSize, selectedSort, queryClient, orderBy]);
```

### Q6: 如何處理資料更新導致的頁碼問題？

**場景**: 正在瀏覽第 3 頁，此時新增了資料，頁碼偏移

**解決方案**:
```typescript
// 選項 A: 使用 cursor-based pagination（推薦長期方案）

// 選項 B: 實作資料版本號
const { data, dataUpdatedAt } = useQuery({
  queryKey: proposalQueryKeys.paginated(...),
  queryFn: () => execute(...),
});

// 當資料更新時，提示使用者
useEffect(() => {
  if (dataUpdatedAt && lastDataUpdatedAt.current !== dataUpdatedAt) {
    // 顯示通知：「資料已更新，點擊重新整理」
    lastDataUpdatedAt.current = dataUpdatedAt;
  }
}, [dataUpdatedAt]);

// 選項 C: 定期失效緩存
queryClient.invalidateQueries({
  queryKey: proposalQueryKeys.all,
  refetchType: 'active', // 只重新獲取活躍的查詢
});
```

---

**文件版本**: 1.0  
**最後更新**: {生成日期}  
**作者**: AI Agent (基於 Feature 需求)  
**審核狀態**: 待審核

