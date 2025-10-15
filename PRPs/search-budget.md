# PRP: 實作預算提案關鍵字搜尋功能（Budget Proposal Search Feature）

## 概述

在 `/all-budgets` 頁面實作關鍵字搜尋功能，讓使用者透過 `BudgetsSelector` 元件中已存在的搜尋輸入框，搜尋包含特定關鍵字的提案資料。搜尋範圍涵蓋：提案說明（description）、提案理由（reason）、機關名稱（government.name）、提案人名稱（proposers.name）。此功能將整合 GraphQL、React Query 與 Zustand，並維持現有的分頁與排序功能，確保不破壞現有邏輯和排版。

## 背景與研究發現

### 當前 Codebase 狀態

- **框架**: React Router v7 (SPA mode)
- **資料獲取**: React Query v5.86.0 + GraphQL with typed document nodes
- **狀態管理**: Zustand v5.0.8 (全域/跨元件狀態)
- **UI 元件**: react-select v5.10.2
- **TypeScript**: v5.8.3 with full type safety
- **樣式**: TailwindCSS v4

### GraphQL Schema 分析

#### ProposalWhereInput 過濾條件

**檔案**: `schema.graphql` (行 867-893)

```graphql
input ProposalWhereInput {
  AND: [ProposalWhereInput!]
  NOT: [ProposalWhereInput!]
  OR: [ProposalWhereInput!]
  budget: BudgetWhereInput
  budgetImageUrl: StringNullableFilter
  coSigners: PeopleManyRelationFilter
  description: StringNullableFilter      # ← 提案說明（搜尋目標 1）
  freezeAmount: IntNullableFilter
  government: GovernmentWhereInput       # ← 機關（搜尋目標 2）
  historicalProposals: ProposalManyRelationFilter
  id: IDFilter
  meetings: MeetingManyRelationFilter
  mergedProposals: ProposalManyRelationFilter
  proposers: PeopleManyRelationFilter    # ← 提案人（搜尋目標 3）
  publishStatus: StringNullableFilter
  react_angry: IntNullableFilter
  react_disappoint: IntNullableFilter
  react_good: IntNullableFilter
  react_whatever: IntNullableFilter
  reason: StringNullableFilter           # ← 提案理由（搜尋目標 4）
  recognitionAnswer: StringNullableFilter
  reductionAmount: IntNullableFilter
  result: StringNullableFilter
  unfreezeHistory: MeetingManyRelationFilter
  unfreezeStatus: StringNullableFilter
}
```

#### StringNullableFilter 操作符

**檔案**: `schema.graphql` (行 1132-1145)

```graphql
input StringNullableFilter {
  contains: String      # ← 推薦用於關鍵字搜尋
  endsWith: String
  equals: String
  gt: String
  gte: String
  in: [String!]
  lt: String
  lte: String
  mode: QueryMode
  not: NestedStringNullableFilter
  notIn: [String!]
  startsWith: String
}
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
  name: StringFilter          # ← 用於機關名稱搜尋
}
```

#### PeopleManyRelationFilter 操作符

**檔案**: `schema.graphql` (行 672-676)

```graphql
input PeopleManyRelationFilter {
  every: PeopleWhereInput   # ← 所有提案人都符合條件
  none: PeopleWhereInput    # ← 沒有提案人符合條件
  some: PeopleWhereInput    # ← 至少一個提案人符合條件（搜尋應使用此選項）
}
```

**重要發現**:
- ✅ `ProposalWhereInput` 支援 `OR` 邏輯運算符
- ✅ `description` 和 `reason` 使用 `StringNullableFilter.contains`
- ✅ `government.name` 透過 `GovernmentWhereInput` 搜尋
- ✅ `proposers.name` 透過 `PeopleManyRelationFilter.some` 搜尋
- ⚠️ 注意：`proposers` 應使用 `some` 而非 `every`（只要至少一位提案人符合即可）

### 現有程式碼分析

#### 1. BudgetsSelector 元件

**檔案**: `app/components/budgets-selector.tsx` (行 343-349)

```tsx
<input
  type="search"
  placeholder="搜尋"
  value={searchedValue}
  onChange={(e) => setSearchedValue(e.target.value)}
  className="rounded-sm border-2 bg-white text-center md:w-80"
/>
```

**分析**:
- ✅ 搜尋輸入框已存在
- ✅ 已與 Zustand store 的 `searchedValue` 綁定
- ⚠️ 目前沒有實際搜尋功能（僅儲存值）

#### 2. Zustand Store 狀態

**檔案**: `app/stores/budget-selector.tsx` (行 12-20)

```tsx
type BudgetSelectProps = {
  selectedValue: string;
  searchedValue: string;      // ← 已有搜尋關鍵字狀態
  visible: boolean;
  selectedSort: string;
  departmentFilter: DepartmentFilter;
  peopleFilter: PeopleFilter;
};
```

**分析**:
- ✅ `searchedValue` 已在 store 中定義
- ✅ `setSearchedValue` action 已實作
- ✅ Store 預設值為空字串

#### 3. AllBudgets 頁面查詢邏輯

**檔案**: `app/all-budgets/index.tsx` (行 67-87)

```tsx
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
```

**分析**:
- ✅ 已有動態建構 `whereFilter` 的模式
- ✅ 已使用 `useMemo` 避免不必要的重新計算
- ⚠️ 目前未包含 `searchedValue` 的依賴項
- ⚠️ 需要擴充以支援 `OR` 條件搜尋

### 效能考量

#### Debounce 搜尋輸入

參考文件：https://dev.to/alais29dev/building-a-real-time-search-filter-in-react-a-step-by-step-guide-3lmm

**建議實作**:
- 使用 `usehooks-ts` 套件的 `useDebounce` hook
- 設定 300-500ms 延遲，避免頻繁查詢
- 在 `whereFilter` 的 `useMemo` 中使用 debounced 值

**套件檢查**:
- ✅ `usehooks-ts` 已安裝（檔案中已使用 `useMediaQuery`）
- ✅ 可直接使用 `useDebounce`

## 實作計畫

### 修改範圍

本實作將涉及以下檔案：

1. **`app/all-budgets/index.tsx`** - 主要邏輯變更
   - 從 store 讀取 `searchedValue`
   - 新增 `useDebounce` 處理搜尋關鍵字
   - 擴充 `whereFilter` 邏輯以支援關鍵字搜尋
   - 更新頁碼重置的依賴項

2. **不需修改的檔案**:
   - ✅ `app/components/budgets-selector.tsx` - 輸入框已完成
   - ✅ `app/stores/budget-selector.tsx` - Store 狀態已完成
   - ✅ `app/queries/proposal.queries.ts` - GraphQL 查詢已支援

### 實作步驟

#### 步驟 1: 新增 Debounce 處理

在 `app/all-budgets/index.tsx` 中新增 debounced 搜尋值：

```tsx
import { useDebounce } from "usehooks-ts";

// 在元件內部，排序狀態之後新增：
const searchedValue = useStore(
  useBudgetSelectStore,
  (s) => s.searchedValue
);
const debouncedSearchValue = useDebounce(searchedValue, 300);
```

**位置**: 在第 44 行 `personId` 之後新增

#### 步驟 2: 擴充 whereFilter 邏輯

修改 `whereFilter` 的 `useMemo`（第 67-87 行）以支援關鍵字搜尋：

```tsx
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

  // 關鍵字搜尋過濾
  if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
    const searchKeyword = debouncedSearchValue.trim();
    
    filters.OR = [
      {
        reason: {
          contains: searchKeyword,
        },
      },
      {
        description: {
          contains: searchKeyword,
        },
      },
      {
        government: {
          name: {
            contains: searchKeyword,
          },
        },
      },
      {
        proposers: {
          some: {
            name: {
              contains: searchKeyword,
            },
          },
        },
      },
    ];
  }

  return filters;
}, [departmentId, personId, debouncedSearchValue]);
```

**關鍵邏輯說明**:

1. **檢查搜尋值**: 只有當 `debouncedSearchValue` 非空且非純空白時才啟用搜尋
2. **Trim 處理**: 去除前後空白，避免無效搜尋
3. **OR 條件**: 使用 GraphQL 的 `OR` 運算符，任一欄位包含關鍵字即符合
4. **搜尋範圍**:
   - `reason`: 提案理由
   - `description`: 提案說明
   - `government.name`: 機關名稱
   - `proposers.some.name`: 至少一位提案人的名稱（使用 `some` 而非 `every`）
5. **依賴項**: 新增 `debouncedSearchValue` 到依賴陣列

#### 步驟 3: 更新頁碼重置邏輯

修改 `useEffect`（第 114-117 行）以包含搜尋值：

```tsx
// 排序、篩選或搜尋變更時重置到第 1 頁
useEffect(() => {
  setPage(1);
}, [selectedSort, departmentId, personId, debouncedSearchValue, setPage]);
```

**原因**: 當使用者輸入搜尋關鍵字時，應該回到第一頁顯示搜尋結果

### 互動流程

```
使用者輸入搜尋關鍵字
       ↓
setSearchedValue (Zustand store)
       ↓
useDebounce (300ms 延遲)
       ↓
whereFilter 重新計算 (useMemo)
       ↓
queryKey 變更 (React Query)
       ↓
自動觸發新的 GraphQL 查詢
       ↓
頁碼重置到第 1 頁 (useEffect)
       ↓
顯示搜尋結果（保持排序順序）
```

### 邊界情況處理

1. **空字串搜尋**: 
   - 條件: `!debouncedSearchValue || debouncedSearchValue.trim() === ""`
   - 行為: 不加入 `OR` 條件，等同於顯示所有資料（受其他過濾器影響）

2. **搜尋 + 部會過濾**:
   - 行為: 兩個條件同時生效（AND 關係）
   - 範例: `{ government: { id: "xxx" }, OR: [...搜尋條件] }`

3. **搜尋 + 立委過濾**:
   - 行為: 兩個條件同時生效（AND 關係）
   - 範例: `{ proposers: { some: { id: "xxx" } }, OR: [...搜尋條件] }`

4. **搜尋無結果**:
   - 行為: `proposalsCount` 為 0，顯示空列表
   - UI 保持不變（現有的空狀態處理）

5. **特殊字元處理**:
   - GraphQL `contains` 是字串比對，不需要跳脫
   - 特殊字元（如 `%`, `_`）會被當作普通字元

## 驗證計畫

### 功能驗證

執行以下手動測試：

#### 測試案例 1: 基本搜尋

```
輸入: "中央"
預期: 顯示 reason/description/government.name/proposers.name 包含 "中央" 的提案
驗證: 檢查回傳的資料是否包含關鍵字
```

#### 測試案例 2: 搜尋 + 部會篩選

```
步驟:
1. 選擇「依部會分類」→「行政院」→「文化部」
2. 輸入搜尋關鍵字 "預算"
預期: 只顯示「文化部」且包含「預算」關鍵字的提案
驗證: data.proposals 數量應小於等於單一條件篩選的結果
```

#### 測試案例 3: 搜尋 + 立委篩選

```
步驟:
1. 選擇「依立委分類」→「王婉諭」
2. 輸入搜尋關鍵字 "兒童"
預期: 只顯示「王婉諭」提案且包含「兒童」關鍵字的提案
驗證: 所有提案的 proposers 中至少有一人的 id 與所選立委相符
```

#### 測試案例 4: 清空搜尋

```
步驟:
1. 輸入搜尋關鍵字
2. 清空搜尋框
預期: 恢復顯示所有提案（或受其他篩選器影響的結果）
驗證: 資料列表恢復到搜尋前狀態
```

#### 測試案例 5: Debounce 效果

```
步驟:
1. 快速連續輸入 "中央政府預算"
預期: 在停止輸入 300ms 後才發送查詢
驗證: 開發者工具 Network 面板中只顯示一個 GraphQL 請求
```

#### 測試案例 6: 排序保持

```
步驟:
1. 選擇排序為「編號 (降序)」
2. 輸入搜尋關鍵字
預期: 搜尋結果依照「編號 (降序)」排列
驗證: 資料順序符合選定的排序方式
```

### 效能驗證

#### 1. 網路請求檢查

```bash
# 在開發者工具中監控：
1. Network → Filter by "graphql"
2. 檢查 Request Payload 中的 where 條件
3. 確認 debounce 有效（連續輸入只發一次請求）
```

#### 2. React Query DevTools 檢查

```tsx
// 確認 queryKey 包含 whereFilter 變更
[
  "proposals",
  "list",
  "paginated",
  {
    page: 1,
    pageSize: 10,
    sortBy: "id-asc",
    where: { OR: [...] }  // ← 應包含搜尋條件
  }
]
```

### 型別檢查

```bash
# 執行 TypeScript 型別檢查
pnpm exec tsc --noEmit
```

**預期**: 無型別錯誤

### Linting 檢查

```bash
# 執行 ESLint
pnpm run lint
```

**預期**: 無 linting 錯誤或警告

## 完整實作程式碼

### 檔案: `app/all-budgets/index.tsx`

**變更摘要**:
1. 新增 `useDebounce` import
2. 新增 `searchedValue` 和 `debouncedSearchValue`
3. 擴充 `whereFilter` 邏輯
4. 更新 `useEffect` 依賴項

**完整變更**:

```tsx
// 第 1 行附近 - 新增 import
import { useMediaQuery, useDebounce } from "usehooks-ts";

// 第 44 行附近 - 新增搜尋狀態讀取
const personId = useStore(
  useBudgetSelectStore,
  (s) => s.peopleFilter.personId
);
const searchedValue = useStore(useBudgetSelectStore, (s) => s.searchedValue);
const debouncedSearchValue = useDebounce(searchedValue, 300);

const isDesktop = useMediaQuery("(min-width: 768px)");

// 第 67-87 行 - 擴充 whereFilter
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

  // 關鍵字搜尋過濾
  if (debouncedSearchValue && debouncedSearchValue.trim() !== "") {
    const searchKeyword = debouncedSearchValue.trim();
    
    filters.OR = [
      {
        reason: {
          contains: searchKeyword,
        },
      },
      {
        description: {
          contains: searchKeyword,
        },
      },
      {
        government: {
          name: {
            contains: searchKeyword,
          },
        },
      },
      {
        proposers: {
          some: {
            name: {
              contains: searchKeyword,
            },
          },
        },
      },
    ];
  }

  return filters;
}, [departmentId, personId, debouncedSearchValue]);

// 第 114-117 行 - 更新 useEffect
// 排序、篩選或搜尋變更時重置到第 1 頁
useEffect(() => {
  setPage(1);
}, [selectedSort, departmentId, personId, debouncedSearchValue, setPage]);
```

## 實作清單（Tasks）

請按以下順序完成實作：

- [ ] **Task 1**: 在 `app/all-budgets/index.tsx` 中修改 `useMediaQuery` import，加入 `useDebounce`
  - 位置: 第 15 行
  - 變更: `import { useMediaQuery, useDebounce } from "usehooks-ts";`

- [ ] **Task 2**: 從 Zustand store 讀取 `searchedValue` 並建立 debounced 值
  - 位置: 第 44 行附近（`personId` 之後）
  - 程式碼:
    ```tsx
    const searchedValue = useStore(useBudgetSelectStore, (s) => s.searchedValue);
    const debouncedSearchValue = useDebounce(searchedValue, 300);
    ```

- [ ] **Task 3**: 擴充 `whereFilter` 邏輯以支援關鍵字搜尋
  - 位置: 第 67-87 行的 `useMemo` 內部
  - 在 `personId` 過濾邏輯之後、`return filters;` 之前新增搜尋邏輯

- [ ] **Task 4**: 更新 `whereFilter` 的依賴陣列
  - 位置: 第 87 行（`useMemo` 的依賴陣列）
  - 變更: `}, [departmentId, personId, debouncedSearchValue]);`

- [ ] **Task 5**: 更新頁碼重置邏輯的依賴陣列
  - 位置: 第 114-117 行的 `useEffect`
  - 變更: `}, [selectedSort, departmentId, personId, debouncedSearchValue, setPage]);`

- [ ] **Task 6**: 執行 TypeScript 型別檢查
  - 指令: `pnpm exec tsc --noEmit`
  - 預期: 無型別錯誤

- [ ] **Task 7**: 執行 ESLint 檢查
  - 指令: `pnpm run lint`
  - 預期: 無 linting 錯誤

- [ ] **Task 8**: 手動測試 - 基本搜尋功能
  - 輸入關鍵字「中央」
  - 檢查搜尋結果是否包含關鍵字

- [ ] **Task 9**: 手動測試 - Debounce 效果
  - 快速連續輸入多個字元
  - 確認只發送一次 GraphQL 請求

- [ ] **Task 10**: 手動測試 - 搜尋 + 其他過濾器
  - 同時使用部會篩選和搜尋
  - 確認兩個條件都生效

- [ ] **Task 11**: 手動測試 - 排序保持
  - 選擇特定排序方式
  - 輸入搜尋關鍵字
  - 確認搜尋結果保持排序順序

- [ ] **Task 12**: 相容性測試 - 確認現有功能未破壞
  - 部會篩選器
  - 立委篩選器
  - 排序功能
  - 分頁功能

## 成功標準

實作完成後，需滿足以下所有標準：

### 功能標準

1. ✅ 搜尋框輸入關鍵字後，顯示包含該關鍵字的提案
2. ✅ 搜尋範圍涵蓋：`reason`, `description`, `government.name`, `proposers.name`
3. ✅ 搜尋結果保持現有的排序順序
4. ✅ 搜尋與部會/立委過濾器可同時使用（AND 關係）
5. ✅ 搜尋觸發時自動重置到第 1 頁
6. ✅ 清空搜尋框後恢復顯示所有資料
7. ✅ Debounce 生效，連續輸入只發送一次查詢

### 效能標準

1. ✅ 使用 300ms debounce，避免過度查詢
2. ✅ 搜尋查詢時間 < 2s（正常網路環境）
3. ✅ 無不必要的元件重渲染（透過 Zustand selector 隔離）

### 程式碼品質標準

1. ✅ 無 TypeScript 型別錯誤
2. ✅ 無 ESLint 錯誤或警告
3. ✅ 程式碼遵循專案現有模式與慣例
4. ✅ 註解清晰，邏輯易於理解

### 相容性標準

1. ✅ 不破壞現有的部會篩選功能
2. ✅ 不破壞現有的立委篩選功能
3. ✅ 不破壞現有的排序功能
4. ✅ 不破壞現有的分頁功能
5. ✅ 不破壞現有的 UI 排版與樣式

## 文件與參考資源

### 內部文件

- **GraphQL Schema**: `schema.graphql`
- **Zustand 規範**: `.cursorrules` 中的 state-management-zustand
- **相似實作**:
  - `PRPs/by-department-selector.md` - 部會篩選實作
  - `PRPs/sort-by-people.md` - 立委篩選實作

### 外部參考

- **React Query 文件**: https://tanstack.com/query/latest/docs/framework/react/overview
- **Zustand 文件**: https://github.com/pmndrs/zustand
- **usehooks-ts**: https://usehooks-ts.com/react-hook/use-debounce
- **搜尋實作參考**: https://dev.to/alais29dev/building-a-real-time-search-filter-in-react-a-step-by-step-guide-3lmm

## 附錄：預期的 GraphQL 查詢範例

### 搜尋關鍵字 "中央" 的查詢

```graphql
query GetPaginatedProposals(
  $skip: Int!
  $take: Int!
  $orderBy: [ProposalOrderByInput!]!
  $where: ProposalWhereInput!
) {
  proposals(skip: $skip, take: $take, orderBy: $orderBy, where: $where) {
    # ... fields
  }
  proposalsCount(where: $where)
}
```

**Variables**:
```json
{
  "skip": 0,
  "take": 10,
  "orderBy": [{ "id": "desc" }],
  "where": {
    "OR": [
      {
        "reason": {
          "contains": "中央"
        }
      },
      {
        "description": {
          "contains": "中央"
        }
      },
      {
        "government": {
          "name": {
            "contains": "中央"
          }
        }
      },
      {
        "proposers": {
          "some": {
            "name": {
              "contains": "中央"
            }
          }
        }
      }
    ]
  }
}
```

### 搜尋 + 部會過濾的查詢

**Variables**:
```json
{
  "skip": 0,
  "take": 10,
  "orderBy": [{ "id": "desc" }],
  "where": {
    "government": {
      "id": {
        "equals": "department-id-123"
      }
    },
    "OR": [
      {
        "reason": {
          "contains": "預算"
        }
      },
      {
        "description": {
          "contains": "預算"
        }
      },
      {
        "government": {
          "name": {
            "contains": "預算"
          }
        }
      },
      {
        "proposers": {
          "some": {
            "name": {
              "contains": "預算"
            }
          }
        }
      }
    ]
  }
}
```

**邏輯**: `government.id === "department-id-123" AND (reason contains "預算" OR description contains "預算" OR ...)`

## PRP 信心評分

**評分**: 9/10

**理由**:
- ✅ 所有必要的上下文都已提供
- ✅ 實作步驟清晰且可執行
- ✅ 有完整的程式碼範例
- ✅ 驗證步驟具體且可執行
- ✅ 風險已識別並有緩解措施
- ✅ 參考了現有的相似實作模式
- ⚠️ 扣 1 分：GraphQL 後端的實際效能未知（需實測）

**預期結果**: AI agent 應能根據此 PRP 一次性成功完成實作

---

**PRP 版本**: 1.0  
**建立日期**: 2025-10-15  
**最後更新**: 2025-10-15  
**作者**: AI Assistant  
**狀態**: ✅ Ready for Implementation

