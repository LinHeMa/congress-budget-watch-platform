# PRP: 實作依部會分類的篩選器（By Department Selector）

## 概述

在 `/all-budgets` 頁面的 `BudgetsSelector` 元件中實作「依部會分類」功能。透過兩階段的下拉選單（第一階段選擇 `category`，第二階段選擇 `name`），過濾顯示的提案資料。此功能將整合 GraphQL、React Query 與 Zustand，並維持現有的分頁與排序功能。

## 背景與研究發現

### 當前 Codebase 狀態

- **框架**: React Router v7 (SPA mode)
- **資料獲取**: React Query v5.86.0 + GraphQL with typed document nodes
- **狀態管理**: Zustand v5.0.8 (全域/跨元件狀態)
- **UI 元件**: react-select v5.10.2
- **TypeScript**: v5.8.3 with full type safety
- **樣式**: TailwindCSS v4

### GraphQL Schema 分析

#### Government Type 結構

```graphql
type Government {
  category: String
  description: String
  id: ID!
  name: String
}
```

#### Governments Query

**檔案**: `schema.graphql` (行 908-909)

```graphql
governments(
  cursor: GovernmentWhereUniqueInput, 
  orderBy: [GovernmentOrderByInput!]! = [], 
  skip: Int! = 0, 
  take: Int, 
  where: GovernmentWhereInput! = {}
): [Government!]
governmentsCount(where: GovernmentWhereInput! = {}): Int
```

#### GovernmentWhereInput 過濾條件

**檔案**: `schema.graphql` (行 302-310)

```graphql
input GovernmentWhereInput {
  AND: [GovernmentWhereInput!]
  NOT: [GovernmentWhereInput!]
  OR: [GovernmentWhereInput!]
  category: StringFilter
  description: StringNullableFilter
  id: IDFilter
  name: StringFilter
}
```

#### StringFilter 操作符

**檔案**: `schema.graphql` (行 1117-1130)

```graphql
input StringFilter {
  contains: String
  endsWith: String
  equals: String      # ← 推薦用於精確匹配
  gt: String
  gte: String
  in: [String!]       # ← 可用於多選
  lt: String
  lte: String
  mode: QueryMode
  not: NestedStringFilter
  notIn: [String!]
  startsWith: String
}
```

#### Proposals 過濾整合

**檔案**: `schema.graphql` (行 867-890)

```graphql
input ProposalWhereInput {
  AND: [ProposalWhereInput!]
  NOT: [ProposalWhereInput!]
  OR: [ProposalWhereInput!]
  # ... 其他欄位 ...
  government: GovernmentWhereInput  # ← 關鍵：支援依 government 過濾
  # ... 其他欄位 ...
}
```

**重要發現**:
- ✅ `ProposalWhereInput` 有 `government: GovernmentWhereInput` 欄位
- ✅ 可以在查詢 `proposals` 時傳遞 `where` 參數來過濾
- ✅ 支援巢狀過濾（如 `where: { government: { name: { equals: "交通部" } } }`）

### 當前 `/all-budgets` 頁面架構

**檔案**: `app/all-budgets/index.tsx`

#### 現有資料獲取與過濾

```typescript
const { data, isLoading, isError, isPlaceholderData } = useQuery({
  queryKey: proposalQueryKeys.paginated(currentPage, pageSize, selectedSort),
  queryFn: () =>
    execute(GET_PAGINATED_PROPOSALS_QUERY, {
      skip,
      take: pageSize,
      orderBy,
    }),
  placeholderData: keepPreviousData,
});
```

**重要觀察**:
- 目前 `GET_PAGINATED_PROPOSALS_QUERY` 不接受 `where` 參數
- 需要修改此查詢以支援過濾
- 已有排序與分頁功能運作良好

#### 現有 Zustand Store 整合

```typescript:app/all-budgets/index.tsx
const selectedSort = useStore(useBudgetSelectStore, (s) => s.selectedSort);
const setSelectedSort = useStore(
  useBudgetSelectStore,
  (s) => s.setSelectedSort
);
```

**關鍵發現**: 已使用 `budget-selector` store 管理排序狀態，可延續此模式管理部會篩選狀態。

### 現有 Zustand Store 模式

#### Budget Selector Store

**檔案**: `app/stores/budget-selector.tsx`

```typescript
type BudgetSelectProps = {
  selectedValue: string;      // "all" | "by-department" | "by-legislator"
  searchedValue: string;
  visible: boolean;
  selectedSort: string;       // 已有排序狀態
};

type BudgetSelectState = BudgetSelectProps & {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
};
```

**模式特點**:
- 使用 `createStore` (vanilla) 工廠模式
- 支援初始化 props
- 不使用 devtools（因為是可重複實例化的小工具 store）

**擴充策略**: 在此 store 新增 `selectedCategory` 與 `selectedDepartment` 狀態

#### 全域 UI Store 參考

**檔案**: `app/stores/uiStore.ts`

展示了如何使用 `create()` + `devtools()` 建立全域 store，並將 actions 獨立分組以優化效能。

#### Pagination Store 參考

**檔案**: `app/stores/paginationStore.ts`

```typescript
export const usePaginationStore = create<PaginationStoreState>()(
  devtools(
    (set) => ({
      pagination: DEFAULT_PAGINATION,
      actions: {
        setPage: (page: number) => set(..., false, "pagination/setPage"),
        // ...
      },
    }),
    { name: "pagination-store", enabled: process.env.NODE_ENV === "development" }
  )
);

// Selector hooks
export const usePagination = () => usePaginationStore((state) => state.pagination);
export const usePaginationActions = () => usePaginationStore((state) => state.actions);
```

**最佳實踐**:
- 狀態與 actions 分離
- 使用 selector hooks 避免重渲染
- 在 dev 環境啟用 devtools
- 為 actions 命名（便於追蹤）

### 現有 react-select 整合

**檔案**: `app/components/budgets-selector.tsx` (行 47-76)

```typescript
const ByDepartmentSelector = ({ value }: { value: string }) => {
  const deleteTypeOptions = [{ value: "all-delete", label: "通案刪減" }];
  const deleteFundOptions = [
    { value: "x-fund", label: "臺鐵局撥入資產及債務管理基金" },
  ];

  if (value !== "by-department") return null;
  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
      <Select
        options={deleteTypeOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder="刪減方式"
      />
      <Select
        options={deleteFundOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder="刪減標的"
      />
    </div>
  );
};
```

**當前問題**:
- ❌ 硬編碼的假資料（`deleteTypeOptions`, `deleteFundOptions`）
- ❌ 沒有連接到 GraphQL
- ❌ 沒有狀態管理
- ❌ 沒有實際過濾功能

**重構計畫**: 完全重寫 `ByDepartmentSelector`，整合真實資料與過濾功能

### 現有 DropdownIndicator

**檔案**: `app/components/budgets-selector.tsx` (行 35-45)

```typescript
export const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image
        src="/icon/dropdown-container.svg"
        alt="dropdown"
        className="h-2 w-2.5"
      />
    </components.DropdownIndicator>
  );
};
```

**重要**: 可直接複用此自訂元件

### React Query 設定

**檔案**: `app/root.tsx` (行 12-17, 42)

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

// 在 Layout 中
<QueryClientProvider client={queryClient}>
  {/* ... */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**GraphQL 執行函式**: `app/graphql/execute.ts`

```typescript
export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch(GQL_ENDPOINTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
    },
    body: JSON.stringify({ query, variables }),
  });
  // ...
  return result.data as TResult;
}
```

### 現有查詢模式

**檔案**: `app/queries/proposal.queries.ts`

```typescript
export const GET_PAGINATED_PROPOSALS_QUERY = graphql(`
  query GetPaginatedProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
  ) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy) {
      # ... 欄位 ...
      government {
        id
        name
        category
        description
      }
      # ... 欄位 ...
    }
    proposalsCount
  }
`)

export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  paginated: (page: number, pageSize: number, sortBy: string) =>
    [...proposalQueryKeys.lists(), 'paginated', { page, pageSize, sortBy }] as const,
  // ...
}
```

**需要修改**:
1. 新增 `$where` 參數到 `GET_PAGINATED_PROPOSALS_QUERY`
2. 更新 `proposalQueryKeys.paginated()` 以包含 filter 參數

### 排序功能參考

**檔案**: `app/components/sort-toolbar.tsx`

```typescript
export const sortOptions = [
  {
    value: "id-asc",
    label: "編號 (升序)",
    field: "id",
    direction: "asc",
  },
  // ...
] as const;

export type SortOption = (typeof sortOptions)[number];
```

**模式**: 定義 options array 並匯出為 const，提供 type safety

## 技術決策

### 1. GraphQL 查詢策略

#### 新增 Governments Query

建立新查詢以獲取可用的 categories 與 departments：

```graphql
query GetGovernments {
  governments {
    id
    name
    category
    description
  }
}
```

**考量**:
- 不需要分頁（governments 數量通常不多，估計 < 100）
- 取得完整清單以支援前端分組與排序

#### 修改 Proposals Query

為 `GET_PAGINATED_PROPOSALS_QUERY` 新增 `$where` 參數：

```graphql
query GetPaginatedProposals(
  $skip: Int!
  $take: Int!
  $orderBy: [ProposalOrderByInput!]!
  $where: ProposalWhereInput!      # ← 新增
) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    # ... 欄位不變 ...
  }
  proposalsCount(where: $where)    # ← 也要加 where
}
```

**重要**: `proposalsCount` 也必須使用相同的 `where` 條件，以正確計算過濾後的總數

### 2. Zustand Store 擴充

#### 擴充 Budget Selector Store

由於 `budget-selector.tsx` 已存在且管理相關狀態，我們將在此新增部會篩選狀態：

```typescript
type DepartmentFilter = {
  category: string | null;    // 第一階段選擇的 category
  departmentId: string | null;  // 第二階段選擇的 department ID
};

type BudgetSelectProps = {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  selectedSort: string;
  departmentFilter: DepartmentFilter;  // ← 新增
};

type BudgetSelectState = BudgetSelectProps & {
  // ... 現有 actions ...
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
};
```

**為何選擇此方案**:
- ✅ 保持狀態內聚性（所有 budgets selector 相關狀態在同一處）
- ✅ 避免建立過多 stores
- ✅ 與現有 `selectedSort` 模式一致

### 3. 資料處理流程

#### 資料流程圖

```
User 選擇 "依部會分類"
  ↓
useQuery fetches governments
  ↓
前端處理: 計算 unique categories
  ↓
User 選擇 category (第一階段)
  ↓
前端過濾: 顯示該 category 下的 departments
  ↓
User 選擇 department (第二階段)
  ↓
更新 Zustand store: setDepartmentId(id)
  ↓
觸發 all-budgets useQuery 重新取得資料
  ↓
GraphQL where 參數: { government: { id: { equals: id } } }
  ↓
顯示過濾後的 proposals
```

#### 前端資料轉換

```typescript
// 從 governments 陣列計算 unique categories
const categories = Array.from(
  new Set(
    governments
      ?.map((g) => g.category)
      .filter((c): c is string => c != null && c !== "")
  )
).sort();

// 根據選定的 category 過濾 departments
const departmentsInCategory = governments?.filter(
  (g) => g.category === selectedCategory
) ?? [];
```

### 4. 整合點

#### `/all-budgets` 頁面整合

修改 `app/all-budgets/index.tsx`：

```typescript
// 1. 從 store 取得篩選狀態
const departmentFilter = useStore(
  useBudgetSelectStore,
  (s) => s.departmentFilter
);

// 2. 建構 where 參數
const whereFilter = useMemo((): ProposalWhereInput => {
  if (departmentFilter.departmentId) {
    return {
      government: {
        id: { equals: departmentFilter.departmentId },
      },
    };
  }
  return {};
}, [departmentFilter.departmentId]);

// 3. 更新 queryKey 以包含 filter
const queryKey = proposalQueryKeys.paginatedWithFilter(
  currentPage,
  pageSize,
  selectedSort,
  whereFilter
);

// 4. 傳遞 where 給 GraphQL
const { data, isLoading, isError } = useQuery({
  queryKey,
  queryFn: () =>
    execute(GET_PAGINATED_PROPOSALS_QUERY, {
      skip,
      take: pageSize,
      orderBy,
      where: whereFilter,  // ← 新增
    }),
  placeholderData: keepPreviousData,
});
```

#### 重置分頁

當篩選條件改變時，應重置到第 1 頁：

```typescript
useEffect(() => {
  setPage(1);
}, [departmentFilter, setPage]);
```

**參考**: 現有排序變更時已有此邏輯（行 119-121）

### 5. UI/UX 考量

#### 兩階段選擇流程

1. **第一階段**: 選擇 Category
   - Placeholder: "選擇機關類別"
   - 顯示所有 unique categories（去重排序）

2. **第二階段**: 選擇 Department
   - Placeholder: "選擇機關名稱"
   - 僅在選擇 category 後啟用
   - 顯示該 category 下的所有 departments

#### 清除篩選

提供明確的方式清除篩選：
- 在第一階段 select 提供 "全部" 選項（value: null）
- 或提供額外的 "清除篩選" 按鈕

#### 狀態指示

顯示當前篩選狀態，例如：
```
已篩選: 交通部 > 交通部公路總局
```

## 實作藍圖

### Pseudocode 概覽

```
STEP 1: 建立 GraphQL Governments Query
  - 在 app/queries/budget.queries.ts 新增 GET_GOVERNMENTS_QUERY
  - 定義 governmentQueryKeys

STEP 2: 擴充 Zustand Store
  - 修改 app/stores/budget-selector.tsx
  - 新增 DepartmentFilter type
  - 新增 actions: setDepartmentCategory, setDepartmentId, clearDepartmentFilter

STEP 3: 修改 Proposals Query
  - 更新 GET_PAGINATED_PROPOSALS_QUERY 新增 $where 參數
  - 修改 proposalQueryKeys.paginated 以支援 filter

STEP 4: 重寫 ByDepartmentSelector 元件
  - 移除硬編碼資料
  - 使用 useQuery 取得 governments
  - 實作兩階段下拉選單
  - 連接 Zustand store

STEP 5: 整合到 /all-budgets 頁面
  - 讀取 departmentFilter 狀態
  - 建構 whereFilter
  - 更新 useQuery
  - 新增 filter 變更時重置分頁

STEP 6: 更新 TypeScript Types
  - 確保 ProposalWhereInput 型別正確導入
  - 更新 queryKey 型別

STEP 7: 測試與 Edge Cases
  - 空資料處理
  - Loading states
  - 與排序/分頁的交互作用
```

### 詳細任務清單

#### Task 1: 建立 GraphQL Governments Query

**檔案**: `app/queries/budget.queries.ts`

**新增內容**:

```typescript
/**
 * GraphQL query to get all governments for filtering
 */
export const GET_GOVERNMENTS_QUERY = graphql(`
  query GetGovernments {
    governments {
      id
      name
      category
      description
    }
  }
`);

/**
 * React Query keys for government-related queries
 */
export const governmentQueryKeys = {
  all: ["governments"] as const,
  lists: () => [...governmentQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...governmentQueryKeys.lists(), { filters }] as const,
} as const;
```

**同時更新**: `app/queries/index.ts`

```typescript
export {
  GET_BUDGETS_QUERY,
  budgetQueryKeys,
  GET_GOVERNMENTS_QUERY,        // ← 新增
  governmentQueryKeys,          // ← 新增
} from "./budget.queries";
```

#### Task 2: 擴充 Budget Selector Store

**檔案**: `app/stores/budget-selector.tsx`

**修改內容**:

```typescript
// 在檔案開頭新增
type DepartmentFilter = {
  category: string | null;
  departmentId: string | null;
};

// 修改 BudgetSelectProps
type BudgetSelectProps = {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  selectedSort: string;
  departmentFilter: DepartmentFilter;  // ← 新增
};

// 修改 BudgetSelectState
type BudgetSelectState = BudgetSelectProps & {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
  // ← 新增以下 3 個 actions
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
};

// 修改 DEFAULT_PROPS
const DEFAULT_PROPS: BudgetSelectProps = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "id-asc",
  departmentFilter: { category: null, departmentId: null },  // ← 新增
};

// 在 createBudgetSelectStore 中新增 actions
export const createBudgetSelectStore = (
  initProps: Partial<BudgetSelectProps> = {}
) => {
  const props = { ...DEFAULT_PROPS, ...initProps };

  return createStore<BudgetSelectState>()((set, _get) => ({
    ...props,

    // ... 現有 actions ...

    // ← 新增以下 actions
    setDepartmentCategory: (category: string | null) =>
      set((state) => ({
        ...state,
        departmentFilter: {
          category,
          departmentId: null, // 重置第二階段選擇
        },
      })),

    setDepartmentId: (id: string | null) =>
      set((state) => ({
        ...state,
        departmentFilter: {
          ...state.departmentFilter,
          departmentId: id,
        },
      })),

    clearDepartmentFilter: () =>
      set((state) => ({
        ...state,
        departmentFilter: {
          category: null,
          departmentId: null,
        },
      })),
  }));
};
```

#### Task 3: 修改 Paginated Proposals Query

**檔案**: `app/queries/proposal.queries.ts`

**修改 Query**:

```typescript
export const GET_PAGINATED_PROPOSALS_QUERY = graphql(`
  query GetPaginatedProposals(
    $skip: Int!
    $take: Int!
    $orderBy: [ProposalOrderByInput!]!
    $where: ProposalWhereInput!        # ← 新增
  ) {
    proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
      # ... 所有欄位保持不變 ...
    }
    proposalsCount(where: $where)      # ← 修改：加入 where
  }
`)
```

**修改 Query Keys**:

```typescript
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  // 修改 paginated 以支援 where
  paginated: (
    page: number,
    pageSize: number,
    sortBy: string,
    where?: Record<string, unknown>    // ← 新增 where 參數
  ) =>
    [
      ...proposalQueryKeys.lists(),
      'paginated',
      { page, pageSize, sortBy, where },  // ← 包含 where
    ] as const,
  details: () => [...proposalQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const
```

#### Task 4: 重寫 ByDepartmentSelector 元件

**檔案**: `app/components/budgets-selector.tsx`

**完整重寫 ByDepartmentSelector**:

```typescript
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_GOVERNMENTS_QUERY, governmentQueryKeys } from "~/queries";

const ByDepartmentSelector = ({ value }: { value: string }) => {
  // 從 store 取得狀態與 actions
  const departmentFilter = useStore(
    useBudgetSelectStore,
    (state) => state.departmentFilter
  );
  const setDepartmentCategory = useStore(
    useBudgetSelectStore,
    (state) => state.setDepartmentCategory
  );
  const setDepartmentId = useStore(
    useBudgetSelectStore,
    (state) => state.setDepartmentId
  );

  // Fetch governments data
  const { data: governmentsData, isLoading } = useQuery({
    queryKey: governmentQueryKeys.lists(),
    queryFn: () => execute(GET_GOVERNMENTS_QUERY),
    enabled: value === "by-department", // 只在選中時 fetch
  });

  // 計算 unique categories
  const categoryOptions = useMemo(() => {
    if (!governmentsData?.governments) return [];
    
    const uniqueCategories = Array.from(
      new Set(
        governmentsData.governments
          .map((g) => g.category)
          .filter((c): c is string => c != null && c !== "")
      )
    ).sort();

    return uniqueCategories.map((cat) => ({
      value: cat,
      label: cat,
    }));
  }, [governmentsData?.governments]);

  // 根據選定的 category 過濾 departments
  const departmentOptions = useMemo(() => {
    if (!governmentsData?.governments || !departmentFilter.category) {
      return [];
    }

    const filtered = governmentsData.governments
      .filter((g) => g.category === departmentFilter.category)
      .map((g) => ({
        value: g.id,
        label: g.name || "未命名機關",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return filtered;
  }, [governmentsData?.governments, departmentFilter.category]);

  // 當前選擇的值（用於 react-select）
  const selectedCategoryValue = departmentFilter.category
    ? { value: departmentFilter.category, label: departmentFilter.category }
    : null;

  const selectedDepartmentValue = useMemo(() => {
    if (!departmentFilter.departmentId || !governmentsData?.governments) {
      return null;
    }
    const dept = governmentsData.governments.find(
      (g) => g.id === departmentFilter.departmentId
    );
    return dept ? { value: dept.id, label: dept.name || "未命名機關" } : null;
  }, [departmentFilter.departmentId, governmentsData?.governments]);

  if (value !== "by-department") return null;

  return (
    <div className="flex flex-col gap-y-3 md:flex-row md:gap-x-2">
      {/* 第一階段：選擇 Category */}
      <Select
        value={selectedCategoryValue}
        onChange={(opt) => setDepartmentCategory(opt?.value || null)}
        options={categoryOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={isLoading ? "載入中..." : "選擇機關類別"}
        isLoading={isLoading}
        isClearable
        aria-label="選擇機關類別"
      />

      {/* 第二階段：選擇 Department */}
      <Select
        value={selectedDepartmentValue}
        onChange={(opt) => setDepartmentId(opt?.value || null)}
        options={departmentOptions}
        components={{ DropdownIndicator }}
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={
          !departmentFilter.category
            ? "請先選擇類別"
            : departmentOptions.length === 0
              ? "此類別無機關"
              : "選擇機關名稱"
        }
        isDisabled={!departmentFilter.category || departmentOptions.length === 0}
        isClearable
        aria-label="選擇機關名稱"
      />
    </div>
  );
};
```

**注意事項**:
- 使用 `enabled` 條件避免不必要的查詢
- 提供 `isClearable` 支援清除選擇
- 第二階段在未選擇 category 時禁用
- 提供適當的 loading 與 empty states

#### Task 5: 整合到 /all-budgets 頁面

**檔案**: `app/all-budgets/index.tsx`

**新增 imports**:

```typescript
import type { ProposalWhereInput } from "~/graphql/graphql";
```

**新增狀態讀取**:

```typescript
// 在現有的 useStore 呼叫附近新增
const departmentFilter = useStore(
  useBudgetSelectStore,
  (s) => s.departmentFilter
);
```

**建構 where filter**:

```typescript
// 在 orderBy 計算之後新增
const whereFilter = useMemo((): ProposalWhereInput => {
  if (departmentFilter.departmentId) {
    return {
      government: {
        id: { equals: departmentFilter.departmentId },
      },
    };
  }
  return {};
}, [departmentFilter.departmentId]);
```

**修改 useQuery**:

```typescript
const { data, isLoading, isError, isPlaceholderData } = useQuery({
  queryKey: proposalQueryKeys.paginated(
    currentPage,
    pageSize,
    selectedSort,
    whereFilter  // ← 新增參數
  ),
  queryFn: () =>
    execute(GET_PAGINATED_PROPOSALS_QUERY, {
      skip,
      take: pageSize,
      orderBy,
      where: whereFilter,  // ← 新增參數
    }),
  placeholderData: keepPreviousData,
});
```

**新增 filter 變更時重置分頁**:

```typescript
// 在現有的 sorting useEffect 附近新增
useEffect(() => {
  setPage(1);
}, [departmentFilter, setPage]);
```

#### Task 6: 執行 GraphQL Codegen

**重要**: 在修改完 GraphQL queries 後，必須執行 codegen 以生成 TypeScript types。

```bash
pnpm codegen
```

這將更新 `app/graphql/graphql.ts` 與相關型別檔案。

#### Task 7: 型別檢查

**執行 TypeScript 檢查**:

```bash
pnpm typecheck
```

確保所有型別正確，特別是：
- `ProposalWhereInput` 正確導入
- `GovernmentWhereInput` 可用
- Query variables 型別匹配

## 驗證閘門（Validation Gates）

### 1. 語法與型別檢查

```bash
# TypeScript 型別檢查（包含 React Router typegen）
pnpm typecheck

# ESLint 檢查與自動修復
pnpm lint
```

**預期結果**: 無錯誤，無警告

### 2. GraphQL Schema 同步

```bash
# 執行 GraphQL codegen
pnpm codegen
```

**預期結果**:
- 成功生成 `GET_GOVERNMENTS_QUERY` 的型別
- `ProposalWhereInput` 包含 `government` 欄位
- 無 schema 不一致錯誤

### 3. 功能測試檢查清單

#### 基本功能
- [ ] 選擇 "依部會分類" 後，顯示兩個下拉選單
- [ ] 第一個下拉選單顯示所有 unique categories（已排序）
- [ ] 選擇 category 後，第二個下拉選單啟用
- [ ] 第二個下拉選單僅顯示該 category 下的 departments
- [ ] 選擇 department 後，提案清單自動過濾
- [ ] 清除選擇後，恢復顯示所有提案

#### 資料正確性
- [ ] 顯示的 category 數量正確（與後端一致）
- [ ] 每個 category 下的 departments 數量正確
- [ ] 過濾後的提案數量正確（檢查 `proposalsCount`）
- [ ] 過濾後的提案確實屬於選定的 department

#### 整合功能
- [ ] 過濾功能與排序同時運作（過濾後仍可排序）
- [ ] 過濾功能與分頁同時運作（正確計算總頁數）
- [ ] 變更 filter 時自動跳回第 1 頁
- [ ] 變更 filter 時保持排序設定

#### Edge Cases
- [ ] 沒有 governments 資料時顯示適當訊息
- [ ] Loading 狀態正確顯示
- [ ] 選擇的 category 無 departments 時正確處理
- [ ] 清除 category 時同時清除 department
- [ ] 切換到其他分類方式（全部/依立委）時清除 filter
- [ ] 使用搜尋功能不影響 department filter

#### UI/UX
- [ ] 下拉選單樣式與現有設計一致
- [ ] Placeholder 文字清晰明確
- [ ] Disabled 狀態視覺明確
- [ ] 手機版 (< 768px) 排版正確（垂直堆疊）
- [ ] 桌面版 (>= 768px) 排版正確（水平排列）

#### 效能
- [ ] 不會因為過濾導致不必要的重新渲染
- [ ] React Query 正確快取 governments 資料
- [ ] 切換分類方式時不會重複 fetch
- [ ] Zustand devtools 中 action 命名清晰

### 4. 手動測試流程

**流程 1: 基本篩選流程**

```
1. 打開 /all-budgets 頁面
2. 選擇 "依部會分類" radio button
3. 觀察：兩個下拉選單出現
4. 點擊第一個下拉選單
5. 觀察：顯示 categories 清單（例如：中央政府、地方政府等）
6. 選擇一個 category（例如：中央政府）
7. 觀察：第二個下拉選單啟用
8. 點擊第二個下拉選單
9. 觀察：顯示該 category 下的 departments
10. 選擇一個 department（例如：交通部）
11. 觀察：提案清單過濾，只顯示交通部的提案
12. 檢查：提案總數是否更新（顯示於分頁元件）
```

**流程 2: 清除篩選**

```
1. 承上一流程（已選擇 department）
2. 點擊第二個下拉選單的清除按鈕 (×)
3. 觀察：department 清除，提案清單恢復顯示該 category 所有提案
4. 點擊第一個下拉選單的清除按鈕
5. 觀察：category 清除，提案清單恢復顯示所有提案
```

**流程 3: 整合測試**

```
1. 選擇 department filter（例如：交通部）
2. 變更排序方式（例如：編號降序）
3. 觀察：過濾結果正確排序
4. 點擊下一頁
5. 觀察：分頁正常運作，仍保持過濾
6. 變更 department filter（例如：改為教育部）
7. 觀察：自動跳回第 1 頁，顯示新過濾結果
```

**流程 4: 錯誤情境**

```
1. 模擬網路錯誤（Chrome DevTools > Network > Offline）
2. 選擇 "依部會分類"
3. 觀察：應顯示適當的錯誤訊息或載入失敗狀態
4. 恢復網路
5. 觀察：資料自動重新載入（或提供重試選項）
```

### 5. React Query DevTools 檢查

打開 React Query DevTools（預設在頁面右下角），檢查：

- [ ] `['governments', 'list']` query 存在且成功
- [ ] `['proposals', 'list', 'paginated', {...}]` query 的 `where` 參數正確
- [ ] Filter 變更時觸發新的 query（舊 query 保留為 stale）
- [ ] `isPlaceholderData` 在切換 filter 時短暫為 `true`

### 6. Zustand DevTools 檢查

在 Chrome DevTools > Redux（Zustand 使用 Redux DevTools）：

- [ ] Store 名稱為 `budget-selector-store`（或保持現有名稱）
- [ ] `departmentFilter` 狀態可見
- [ ] Actions 正確命名：
  - `setDepartmentCategory`
  - `setDepartmentId`
  - `clearDepartmentFilter`
- [ ] State 變更即時反映在 DevTools

## 錯誤處理策略

### 1. GraphQL 錯誤

```typescript
const { data, isLoading, isError, error } = useQuery({
  queryKey: governmentQueryKeys.lists(),
  queryFn: () => execute(GET_GOVERNMENTS_QUERY),
});

if (isError) {
  console.error("Failed to load governments:", error);
  // UI: 顯示錯誤訊息
  return (
    <div className="text-red-600">
      載入機關資料失敗，請重新整理頁面或稍後再試。
    </div>
  );
}
```

### 2. 空資料

```typescript
if (categoryOptions.length === 0 && !isLoading) {
  return (
    <div className="text-gray-500">
      目前沒有可用的機關資料
    </div>
  );
}
```

### 3. 型別安全

使用 TypeScript 的型別守衛確保資料正確：

```typescript
.filter((c): c is string => c != null && c !== "")
```

### 4. 網路逾時

React Query 預設會自動重試失敗的請求（3 次），並提供 `isLoading` 與 `isError` 狀態。

如需自訂：

```typescript
const { data } = useQuery({
  queryKey: governmentQueryKeys.lists(),
  queryFn: () => execute(GET_GOVERNMENTS_QUERY),
  retry: 2,
  retryDelay: 1000,
});
```

## 已知限制與未來改進

### 當前限制

1. **僅支援單選**：目前只能選擇一個 department。未來可考慮多選（使用 `in` filter）。
2. **無搜尋功能**：department 清單較長時不易尋找。可考慮加入搜尋框。
3. **無快取過期策略**：governments 資料理論上不常變動，可設定較長的 `staleTime`。

### 未來改進建議

1. **多選支援**：
   ```typescript
   where: {
     government: {
       id: { in: selectedDepartmentIds },
     },
   }
   ```

2. **Department 搜尋**：
   ```typescript
   <Select
     options={departmentOptions}
     filterOption={createFilter({ ignoreAccents: false })}
     // ...
   />
   ```

3. **快取優化**：
   ```typescript
   useQuery({
     queryKey: governmentQueryKeys.lists(),
     queryFn: () => execute(GET_GOVERNMENTS_QUERY),
     staleTime: 1000 * 60 * 60, // 1 小時
   });
   ```

4. **URL 同步**：
   將 filter 狀態同步到 URL query parameters，支援分享與書籤。

## 參考資源

### 官方文件

- **React Query v5**: https://tanstack.com/query/v5/docs/framework/react/overview
  - 特別注意：[Dependent Queries](https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries)
  - [Query Keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys)
- **Zustand**: https://zustand.docs.pmnd.rs/getting-started/introduction
  - 參考：[Updating State](https://zustand.docs.pmnd.rs/guides/updating-state)
- **react-select**: https://react-select.com/home
  - 參考：[Async](https://react-select.com/async), [Styles](https://react-select.com/styles)
- **GraphQL**: https://graphql.org/learn/queries/
  - 參考：[Filters and Where Conditions](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

### Codebase 參考

- **Zustand Pattern**: `app/stores/paginationStore.ts`（全域 store 範例）
- **React Query Pattern**: `app/all-budgets/index.tsx` (行 99-108)
- **GraphQL Query Pattern**: `app/queries/proposal.queries.ts`
- **react-select Integration**: `app/components/sort-toolbar.tsx`
- **Store 整合**: `app/all-budgets/index.tsx` (行 71-75)

### 類似實作範例

在本 codebase 中尋找類似模式：
```bash
# 搜尋 useQuery 使用方式
grep -r "useQuery" app/

# 搜尋 useStore 整合
grep -r "useStore" app/

# 搜尋 where 參數使用
grep -r "where:" app/queries/
```

## PRP 評分

**自信度評分**: **8/10**

**理由**:

✅ **優勢**:
1. **完整的 context**：提供了 schema、現有模式、詳細的程式碼範例
2. **清晰的任務分解**：從 GraphQL 到 UI 的完整流程
3. **具體的驗證標準**：可執行的測試檢查清單
4. **現有模式參考**：明確指出要參考的檔案與行號
5. **錯誤處理考量**：涵蓋常見 edge cases

⚠️ **風險**:
1. **GraphQL Schema 假設**：假設 `governments` query 回傳的資料結構與預期一致（需執行 codegen 驗證）
2. **效能未實測**：過濾大量資料時的效能需實際測試
3. **UI 細節**：部分 UX 細節（如錯誤訊息樣式）需與現有設計系統保持一致

**降低風險的建議**:
- 先執行 `pnpm codegen` 確認 schema
- 實作後進行完整的手動測試流程
- 檢查 React Query DevTools 與 Zustand DevTools 確保資料流正確

