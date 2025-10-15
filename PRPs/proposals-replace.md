# PRP: Replace Budget Query with Proposals Query and Add Skeleton Loading

## Overview

將 `app/all-budgets/index.tsx` 頁面從使用 `GET_BUDGETS_QUERY` 切換到 `GET_PROPOSALS_QUERY`，並根據 Proposal 欄位進行正確的資料映射。同時實作 skeleton loading 狀態以提升使用者體驗。此變更必須保持現有的 UI 佈局和排序邏輯完全不變。

## Context & Research Findings

### Current State Analysis

#### 現有資料來源：Budget Query

```typescript
// app/queries/budget.queries.ts
export const GET_BUDGETS_QUERY = graphql(`
  query GetBudgetsWithGovernment {
    budgets {
      id
      type
      year
      projectName
      projectDescription
      budgetAmount
      majorCategory
      mediumCategory
      minorCategory
      description
      government {
        id
        name
        category
      }
    }
    budgetsCount
  }
`);
```

**Budget Type Structure** (from `app/graphql/graphql.ts` lines 29-44):
```typescript
export type Budget = {
  __typename?: 'Budget';
  budgetAmount?: Maybe<Scalars['Float']['output']>;
  budgetUrl?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  government?: Maybe<Government>;
  id: Scalars['ID']['output'];
  lastYearSettlement?: Maybe<Scalars['Float']['output']>;
  majorCategory?: Maybe<Scalars['String']['output']>;
  mediumCategory?: Maybe<Scalars['String']['output']>;
  minorCategory?: Maybe<Scalars['String']['output']>;
  projectDescription?: Maybe<Scalars['String']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};
```

#### 新資料來源：Proposals Query

```typescript
// app/queries/proposal.queries.ts (lines 37-81)
export const GET_PROPOSALS_QUERY = graphql(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
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

**Proposal Type Structure** (from `app/graphql/graphql.ts` lines 1123-1150):
```typescript
export type Proposal = {
  __typename?: 'Proposal';
  budget?: Maybe<Budget>;
  budgetImageUrl?: Maybe<Scalars['String']['output']>;
  coSigners?: Maybe<Array<People>>;
  description?: Maybe<Scalars['String']['output']>;
  freezeAmount?: Maybe<Scalars['Int']['output']>;
  government?: Maybe<Government>;
  historicalProposals?: Maybe<Array<Proposal>>;
  id: Scalars['ID']['output'];
  meetings?: Maybe<Array<Meeting>>;
  mergedProposals?: Maybe<Array<Proposal>>;
  proposalTypes?: Maybe<Array<ProposalProposalTypeType>>;
  proposers?: Maybe<Array<People>>;
  publishStatus?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  recognitionAnswer?: Maybe<Scalars['String']['output']>;
  reductionAmount?: Maybe<Scalars['Int']['output']>;
  result?: Maybe<Scalars['String']['output']>;
  unfreezeHistory?: Maybe<Array<Meeting>>;
  unfreezeStatus?: Maybe<Scalars['String']['output']>;
};

export enum ProposalProposalTypeType {
  Freeze = 'freeze',
  Other = 'other',
  Reduce = 'reduce'
}
```

#### Current Data Mapping (lines 44-63 in index.tsx)

```typescript
const tableData = useMemo(() => {
  if (!data?.budgets) return [];
  
  const sortedBudgets = sortBudgetsByOption(data.budgets, selectedSort);
  
  return sortedBudgets.map((budget) => ({
    id: budget.id,
    department: budget.government?.name || "未指定部會",
    reviewDate: String(budget.year || "N/A"),
    reviewStage: budget.government?.category || "未指定部會",
    proposer: "李柏毅",                    // ← 硬編碼
    cosigners: "王美惠、張宏陸",            // ← 硬編碼
    proposalType: "凍結",                   // ← 硬編碼
    proposalResult: "通過",                 // ← 硬編碼
    originalAmount: budget.budgetAmount || 0,
    reducedAmount: budget.budgetAmount || 0,  // ← 重複
    proposalContent: budget.description || "未指定內容",
  }));
}, [data?.budgets, selectedSort]);
```

### Field Mapping Analysis

#### 🔴 Critical Mapping Changes Required

| BudgetTableData Field | Old Source (Budget) | New Source (Proposal) | Notes |
|----------------------|---------------------|----------------------|-------|
| `id` | `budget.id` | `proposal.id` | ✅ Direct mapping |
| `department` | `budget.government?.name` | `proposal.government?.name` | ✅ Same structure |
| `reviewDate` | `budget.year` | `proposal.budget?.year` | ⚠️ Nested in budget |
| `reviewStage` | `budget.government?.category` | `proposal.government?.category` | ✅ Same structure |
| `proposer` | 硬編碼 "李柏毅" | `proposal.proposers?.[0]?.name` | 🟢 NEW: Real data |
| `cosigners` | 硬編碼 "王美惠、張宏陸" | `proposal.coSigners?.map(s => s.name).join('、')` | 🟢 NEW: Real data |
| `proposalType` | 硬編碼 "凍結" | `proposal.proposalTypes?.[0]` 或自訂邏輯 | 🟢 NEW: Real data |
| `proposalResult` | 硬編碼 "通過" | `proposal.result` | 🟢 NEW: Real data |
| `originalAmount` | `budget.budgetAmount` | `proposal.budget?.budgetAmount` | ⚠️ Nested in budget |
| `reducedAmount` | `budget.budgetAmount` (重複) | `proposal.freezeAmount \|\| proposal.reductionAmount \|\| 0` | 🟢 NEW: Real data |
| `proposalContent` | `budget.description` | `proposal.description` | ✅ Direct mapping |

#### ProposalType Display Logic

```typescript
// proposalTypes 是陣列，可能包含多個值：'freeze', 'reduce', 'other'
function getProposalTypeDisplay(types?: Array<ProposalProposalTypeType>): string {
  if (!types || types.length === 0) return "未分類";
  
  const typeMap = {
    freeze: "凍結",
    reduce: "減列",
    other: "其他",
  };
  
  return types.map(t => typeMap[t] || t).join("、");
}
```

### Sorting Compatibility Analysis

**現有排序選項** (`app/components/sort-toolbar.tsx` lines 6-43):
```typescript
export const sortOptions = [
  { value: "projectName-asc", label: "專案名稱 (A-Z)", field: "projectName", direction: "asc" },
  { value: "projectName-desc", label: "專案名稱 (Z-A)", field: "projectName", direction: "desc" },
  { value: "budgetAmount-desc", label: "預算金額 (高到低)", field: "budgetAmount", direction: "desc" },
  { value: "budgetAmount-asc", label: "預算金額 (低到高)", field: "budgetAmount", direction: "asc" },
  { value: "year-desc", label: "年度 (新到舊)", field: "year", direction: "desc" },
  { value: "year-asc", label: "年度 (舊到新)", field: "year", direction: "asc" },
] as const;
```

**⚠️ 排序相容性問題**：
- `sortBudgetsByOption` 函式接受 `Budget[]` 型別
- Proposal 結構中：
  - `projectName` → 在 `proposal.budget?.projectName` (nested)
  - `budgetAmount` → 在 `proposal.budget?.budgetAmount` (nested)
  - `year` → 在 `proposal.budget?.year` (nested)

**解決方案**：建立適配器來扁平化 Proposal 資料，使其相容現有排序邏輯。

### Loading State Patterns in Codebase

**現有 Loading 處理** (line 65 in index.tsx):
```typescript
if (isLoading) return <>loading</>;
```

**Skeleton Design Patterns**：
- ❌ 無現有 skeleton component
- ✅ 使用 TailwindCSS 的 `animate-pulse` utility
- ✅ 參考 `BudgetTable` 的結構來設計 skeleton

### Architecture Considerations

#### Component Structure
```
AllBudgets
├── Data Fetching (useQuery)
├── State Management (useBudgetSelectStore)
├── Data Transformation (useMemo)
│   └── Proposal → BudgetTableData adapter
├── Loading State (NEW: AllBudgetsSkeleton)
└── Render
    ├── Header/Progress
    ├── BudgetsSelector
    ├── SortToolbar
    └── BudgetTable
```

#### Type Safety Strategy
```typescript
// 新增轉換函式型別
type ProposalToBudgetTableDataAdapter = (proposal: Proposal) => BudgetTableData;

// 新增假 Budget 型別來滿足 sortBudgetsByOption
type ProposalAsBudget = Pick<Budget, 'id' | 'projectName' | 'budgetAmount' | 'year'> & {
  government?: Pick<Government, 'name' | 'category'>;
  description?: string;
};
```

## Implementation Blueprint

### Phase 1: Create Data Adapter (Phase 1)

#### Step 1.1: Create Helper Functions

在 `app/all-budgets/index.tsx` 頂部（import 後）新增 helper functions：

```typescript
/**
 * 將 ProposalProposalTypeType 轉換為中文顯示文字
 */
function getProposalTypeDisplay(types?: Array<ProposalProposalTypeType>): string {
  if (!types || types.length === 0) return "未分類";
  
  const typeMap: Record<ProposalProposalTypeType, string> = {
    [ProposalProposalTypeType.Freeze]: "凍結",
    [ProposalProposalTypeType.Reduce]: "減列",
    [ProposalProposalTypeType.Other]: "其他",
  };
  
  return types.map(t => typeMap[t] || t).join("、");
}

/**
 * 將 Proposal 轉換為 BudgetTableData
 * 此轉換確保與現有 BudgetTable 元件相容
 */
function proposalToBudgetTableData(proposal: Proposal): BudgetTableData {
  // 提案人：取第一個提案人，若無則顯示「無」
  const proposer = proposal.proposers?.[0]?.name || "無";
  
  // 連署人：將所有連署人名字用頓號連接，若無則顯示「無」
  const cosigners = proposal.coSigners && proposal.coSigners.length > 0
    ? proposal.coSigners.map(s => s.name).join('、')
    : "無";
  
  // 提案類型：從 proposalTypes 陣列轉換
  const proposalType = getProposalTypeDisplay(proposal.proposalTypes);
  
  // 審議結果：從 result 欄位取得，若無則顯示「待審議」
  const proposalResult = proposal.result || "待審議";
  
  // 預算金額：從 nested budget 中取得
  const originalAmount = proposal.budget?.budgetAmount || 0;
  
  // 減列/凍結金額：優先取 freezeAmount，其次 reductionAmount
  const reducedAmount = proposal.freezeAmount || proposal.reductionAmount || 0;
  
  // 審議日期：從 nested budget 的 year 取得
  const reviewDate = proposal.budget?.year ? String(proposal.budget.year) : "N/A";
  
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
    proposalContent: proposal.description || "未指定內容",
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
    __typename: 'Budget',
    budgetUrl: undefined,
    lastYearSettlement: undefined,
    majorCategory: proposal.budget?.majorCategory,
    mediumCategory: proposal.budget?.mediumCategory,
    minorCategory: proposal.budget?.minorCategory,
    projectDescription: undefined,
    type: proposal.budget?.type,
  } as Budget;
}
```

#### Step 1.2: Update Data Fetching

修改現有的 useQuery hooks（lines 23-34）：

**Before:**
```typescript
const { data, isLoading, isError } = useQuery({
  queryKey: budgetQueryKeys.lists(),
  queryFn: () => execute(GET_BUDGETS_QUERY),
});
const {
  data: proposals,
  isLoading: isProposalsLoading,
  isError: isProposalsError,
} = useQuery({
  queryKey: proposalQueryKeys.lists(),
  queryFn: () => execute(GET_PROPOSALS_QUERY),
});
console.log({ proposals });
```

**After:**
```typescript
// 移除舊的 budget query，只保留 proposals query
const { data, isLoading, isError } = useQuery({
  queryKey: proposalQueryKeys.lists(),
  queryFn: () => execute(GET_PROPOSALS_QUERY),
});
```

#### Step 1.3: Update Data Transformation Logic

修改 `tableData` useMemo（lines 44-63）：

**Before:**
```typescript
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
```

**After:**
```typescript
const tableData = useMemo(() => {
  if (!data?.proposals) return [];
  
  // 1. 將 Proposal 轉換為 Budget 型別以供排序
  const proposalsAsBudgets = data.proposals.map(proposalToBudgetForSorting);
  
  // 2. 使用現有排序邏輯
  const sortedBudgets = sortBudgetsByOption(proposalsAsBudgets, selectedSort);
  
  // 3. 根據排序後的 id 順序重新排列原始 proposals
  const sortedProposals = sortedBudgets.map(sortedBudget => 
    data.proposals.find(p => p.id === sortedBudget.id)!
  );
  
  // 4. 轉換為 BudgetTableData 格式
  return sortedProposals.map(proposalToBudgetTableData);
}, [data?.proposals, selectedSort]);
```

#### Step 1.4: Update Imports

在檔案頂部新增必要的 import：

```typescript
// 更新 imports
import {
  GET_PROPOSALS_QUERY,  // 保留
  proposalQueryKeys,     // 保留
} from "~/queries";

// 新增型別 import
import type { Proposal, ProposalProposalTypeType } from "~/graphql/graphql";
```

移除不再使用的 import：
```typescript
// 移除這行
import { GET_BUDGETS_QUERY, budgetQueryKeys } from "~/queries";
```

### Phase 2: Implement Skeleton Loading

#### Step 2.1: Create Skeleton Component

在 `app/all-budgets/index.tsx` 中新增 `AllBudgetsSkeleton` 元件（放在 `AllBudgets` 元件之前）：

```typescript
/**
 * AllBudgets 頁面的 Skeleton Loading 狀態
 * 模擬頁面實際結構，提供載入中的視覺回饋
 */
const AllBudgetsSkeleton = ({ isDesktop }: { isDesktop: boolean }) => {
  // 顯示 3 個 skeleton 項目
  const skeletonCount = 3;

  return (
    <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
      {/* Title skeleton */}
      <div className="mb-3 flex w-full justify-center">
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Desktop progress skeleton */}
      <div className="mb-5 hidden h-fit w-full items-center justify-center md:flex">
        <div className="h-48 w-[165px] animate-pulse rounded bg-gray-200" />
      </div>

      {/* Progress toggle skeleton */}
      <div className="relative mb-5 hidden items-center justify-start border-b-[2px] border-black md:flex">
        <div className="h-10 w-32 animate-pulse rounded-t-md bg-gray-200" />
      </div>

      {/* Mobile progress section skeleton */}
      <div className="mb-3 h-0.5 w-full bg-black md:hidden" />
      <div className="mb-5 flex items-center justify-center border-b-[2px] border-black md:hidden">
        <div className="h-10 w-32 animate-pulse rounded-t-md bg-gray-200" />
      </div>
      <div className="mb-5 flex h-fit w-full items-center justify-center md:hidden">
        <div className="h-48 w-[165px] animate-pulse rounded bg-gray-200" />
      </div>

      {/* Budgets selector skeleton */}
      <div className="h-0.5 w-full bg-black md:hidden" />
      <div className="mb-4 flex items-center justify-end py-3">
        <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-0.5 w-full bg-black md:hidden" />

      {/* Sort toolbar skeleton */}
      <div className="flex items-center justify-end pt-3">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
      </div>
      <div className="h-0.5 w-full bg-black md:hidden" />

      {/* Table skeleton */}
      <div className="mt-4 space-y-6">
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <div key={idx}>
            {isDesktop ? (
              // Desktop skeleton
              <div className="rounded border-2 border-gray-200 p-4">
                <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            ) : (
              // Mobile skeleton
              <div className="flex flex-col border-b-2 border-gray-200 pb-4">
                <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
                <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

#### Step 2.2: Update Loading State Logic

修改 `AllBudgets` 元件中的 loading 邏輯（line 65）：

**Before:**
```typescript
if (isLoading) return <>loading</>;
if (isError) return redirect(ERROR_REDIRECT_ROUTE);
```

**After:**
```typescript
// 使用 skeleton 取代簡單的 "loading" 文字
if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
if (isError) return redirect(ERROR_REDIRECT_ROUTE);
```

### Phase 3: Code Cleanup

#### Step 3.1: Remove Debug Console.log

移除檔案中的所有 `console.log` 語句：
- Line 35: `console.log({ proposals });` ← 刪除
- Line 46: `console.log(data.budgets);` ← 刪除（已在 Phase 1 處理）

#### Step 3.2: Remove TODO Comment

移除 line 37 的 TODO 註解：
```typescript
// TODO: add skeleton  ← 刪除此行
```

### Phase 4: Verification & Testing

#### Step 4.1: Type Checking

```bash
cd /Users/user/Documents/code/congress-budget
pnpm typecheck
```

**Expected Output:**
- ✅ No TypeScript errors
- ✅ All Proposal types properly imported and used
- ✅ BudgetTableData type satisfied

#### Step 4.2: Linting

```bash
cd /Users/user/Documents/code/congress-budget
pnpm lint:check
```

**Expected Output:**
- ✅ No ESLint errors
- ✅ No unused imports
- ✅ Proper formatting

#### Step 4.3: Visual Testing Checklist

啟動開發伺服器：
```bash
cd /Users/user/Documents/code/congress-budget
pnpm dev
```

Navigate to `/all-budgets` route and verify:

**Loading State (Skeleton):**
- [ ] Skeleton appears on initial load
- [ ] Skeleton structure matches actual page layout
- [ ] Animations are smooth (pulse effect)
- [ ] Desktop/mobile responsive skeletons work correctly

**Data Display:**
- [ ] Proposal ID 正確顯示
- [ ] 部會名稱從 `proposal.government.name` 正確顯示
- [ ] 審議日期從 `proposal.budget.year` 正確顯示
- [ ] 提案人從 `proposal.proposers[0].name` 正確顯示（非硬編碼）
- [ ] 連署人從 `proposal.coSigners` 正確顯示並用頓號連接（非硬編碼）
- [ ] 提案類型從 `proposal.proposalTypes` 正確轉換為中文（非硬編碼「凍結」）
- [ ] 審議結果從 `proposal.result` 正確顯示（非硬編碼「通過」）
- [ ] 預算金額從 `proposal.budget.budgetAmount` 正確顯示
- [ ] 減列/凍結金額從 `proposal.freezeAmount` 或 `proposal.reductionAmount` 正確顯示（非重複 budgetAmount）
- [ ] 提案內容從 `proposal.description` 正確顯示

**Sorting Functionality:**
- [ ] 專案名稱排序（A-Z / Z-A）正常運作
- [ ] 預算金額排序（高到低 / 低到高）正常運作
- [ ] 年度排序（新到舊 / 舊到新）正常運作
- [ ] 排序後資料順序正確

**UI Layout (Must NOT Change):**
- [ ] 頁面整體佈局與之前完全相同
- [ ] 標題區塊位置不變
- [ ] 進度條顯示正常（desktop/mobile）
- [ ] BudgetsSelector 正常運作
- [ ] SortToolbar 正常運作
- [ ] BudgetTable 表格顯示正常（desktop/mobile）
- [ ] 所有邊框、間距、顏色與之前一致

**Edge Cases:**
- [ ] 無資料時顯示空陣列（不 crash）
- [ ] proposers 為空陣列時顯示「無」
- [ ] coSigners 為空陣列時顯示「無」
- [ ] proposalTypes 為空陣列時顯示「未分類」
- [ ] result 為 null 時顯示「待審議」
- [ ] nested budget 為 null 時正確處理

## Task Checklist

實作時請按照以下順序完成：

### Phase 1: Data Migration
- [ ] 1.1 新增 helper functions（`getProposalTypeDisplay`, `proposalToBudgetTableData`, `proposalToBudgetForSorting`）
- [ ] 1.2 移除舊的 budget query，更新為只使用 proposals query
- [ ] 1.3 更新 `tableData` useMemo 邏輯
- [ ] 1.4 更新 imports（新增 Proposal types，移除 budget query imports）

### Phase 2: Skeleton Implementation
- [ ] 2.1 建立 `AllBudgetsSkeleton` 元件
- [ ] 2.2 更新 loading state 邏輯使用 skeleton

### Phase 3: Cleanup
- [ ] 3.1 移除所有 `console.log` 語句
- [ ] 3.2 移除 `// TODO: add skeleton` 註解

### Phase 4: Verification
- [ ] 4.1 執行 `pnpm typecheck` 並確保通過
- [ ] 4.2 執行 `pnpm lint:check` 並確保通過
- [ ] 4.3 手動測試所有視覺檢查項目

## Validation Gates

### Gate 1: TypeScript Compilation
```bash
cd /Users/user/Documents/code/congress-budget && pnpm typecheck
```
**Pass Criteria:** Exit code 0, no type errors

### Gate 2: Linting
```bash
cd /Users/user/Documents/code/congress-budget && pnpm lint:check
```
**Pass Criteria:** Exit code 0, no ESLint errors

### Gate 3: Build Success
```bash
cd /Users/user/Documents/code/congress-budget && pnpm build
```
**Pass Criteria:** Build completes successfully without errors

### Gate 4: Development Server
```bash
cd /Users/user/Documents/code/congress-budget && pnpm dev
```
**Pass Criteria:** 
- Server starts without errors
- Navigate to `/all-budgets` route loads successfully
- Skeleton appears during initial load
- Data displays correctly after loading

## Gotchas & Common Pitfalls

### 1. Nested Data Structure
⚠️ **Pitfall:** Proposal 的 budget-related 欄位（如 `year`, `budgetAmount`, `projectName`）都在 nested `budget` 物件中。

**Solution:** 使用 optional chaining `proposal.budget?.year`

### 2. ProposalTypes Array to String
⚠️ **Pitfall:** `proposalTypes` 是陣列，可能包含多個值或空陣列。

**Solution:** 使用 `getProposalTypeDisplay()` helper 函式處理所有情況。

### 3. Sorting Compatibility
⚠️ **Pitfall:** `sortBudgetsByOption` 函式期望 `Budget` 型別，但我們現在有 `Proposal`。

**Solution:** 使用 `proposalToBudgetForSorting()` adapter 來扁平化資料。

### 4. Empty Arrays vs Null
⚠️ **Pitfall:** `proposers` 和 `coSigners` 可能是空陣列 `[]` 或 `null`/`undefined`。

**Solution:** 使用 `proposal.proposers?.[0]?.name || "無"` 同時處理兩種情況。

### 5. Amount Fields Logic
⚠️ **Pitfall:** `reducedAmount` 應該顯示 `freezeAmount` 或 `reductionAmount`，不應該再用 `budgetAmount`。

**Solution:** `proposal.freezeAmount || proposal.reductionAmount || 0`

### 6. Skeleton Responsive Design
⚠️ **Pitfall:** Desktop 和 mobile 的佈局不同，skeleton 也需要響應式。

**Solution:** 使用 `isDesktop` prop 來渲染不同的 skeleton 結構。

## References & Documentation

### GraphQL Documentation
- Proposal Schema: `schema.graphql` lines 717-876
- Query Definition: `app/queries/proposal.queries.ts`
- GraphQL Endpoint: https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql

### Codebase Patterns
- React Query Pattern: `app/queries/budget.queries.ts`
- Component Structure: `app/all-budgets/index.tsx`
- Sorting Logic: `app/components/sort-toolbar.tsx`
- Table type: `app/components/budget-table.tsx` (BudgetTableData type)

### TypeScript Types
- Proposal Type: `app/graphql/graphql.ts` lines 1123-1150
- Budget Type: `app/graphql/graphql.ts` lines 29-44
- ProposalProposalTypeType Enum: `app/graphql/graphql.ts` lines 1276-1280

### TailwindCSS Utilities
- Skeleton Animation: `animate-pulse` utility class
- Responsive Breakpoints: `md:` (768px), `lg:` (960px)

## Success Criteria

此 PRP 實作成功的標準：

1. ✅ **資料切換完成**：
   - 移除 `GET_BUDGETS_QUERY`，完全使用 `GET_PROPOSALS_QUERY`
   - 所有欄位正確映射到 Proposal 資料結構

2. ✅ **資料準確性**：
   - 提案人、連署人、提案類型、審議結果顯示真實資料（非硬編碼）
   - 減列/凍結金額顯示正確（非重複 budgetAmount）

3. ✅ **功能完整性**：
   - 排序功能正常運作（專案名稱、預算金額、年度）
   - 所有現有功能（BudgetsSelector, SortToolbar, BudgetTable）無破壞

4. ✅ **UI 一致性**：
   - 頁面佈局與之前完全相同
   - 無視覺差異或佈局位移

5. ✅ **Skeleton Loading**：
   - Loading 狀態顯示 skeleton（非簡單文字）
   - Skeleton 結構匹配實際頁面
   - Desktop/mobile 響應式正常

6. ✅ **程式碼品質**：
   - TypeScript 編譯通過（無 type errors）
   - ESLint 檢查通過（無 linting errors）
   - 無 console.log 或 TODO 註解殘留

7. ✅ **Edge Cases 處理**：
   - 空資料、null 值、空陣列等情況正確處理
   - 無 runtime errors 或 crashes

## Confidence Score

**9/10** - 高信心一次性實作成功

**理由：**
- ✅ 完整的 GraphQL schema 和型別定義
- ✅ 清晰的欄位映射表和轉換邏輯
- ✅ 詳細的 helper functions 和 adapter pattern
- ✅ 具體的 skeleton 實作範例
- ✅ 可執行的驗證指令
- ✅ 完整的測試檢查清單

**扣 1 分原因：**
- ⚠️ 需要視覺確認實際 Proposal 資料的顯示效果
- ⚠️ ProposalTypes 的中文轉換可能需要根據實際需求微調

**風險緩解：**
- 提供完整的 Edge Cases 檢查清單
- 提供詳細的 Gotchas 說明
- 提供手動測試步驟

