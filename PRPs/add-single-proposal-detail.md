# PRP: Add Single Proposal Query and Detail Page Implementation

## Overview

為 `app/budget-detail/index.tsx` 實作完整的資料獲取功能，包含：
1. 建立 GraphQL query 來獲取單一 proposal 的詳細資料
2. 在詳細頁面中使用路由參數（`:id`）來獲取並渲染真實資料
3. 實作 skeleton loading 狀態以提升使用者體驗
4. 保持現有的 UI 佈局和排版完全不變

此變更必須遵循專案現有的模式與慣例，確保與現有架構無縫整合。

## Context & Research Findings

### Current State Analysis

#### 現有路由配置

From `app/routes.ts`:
```typescript
export default [
  index("routes/home.tsx"),
  route("/all-budgets", "all-budgets/index.tsx"),
  route("/visualization", "visualization/index.tsx"),
  route("/collaboration", "routes/collaboration.tsx"),
  route("/budget/:id", "budget-detail/index.tsx"),  // ← 目標路由
  route("/visualization/legislator/:id", "visualization/legislator/index.tsx"),
] satisfies RouteConfig;
```

**路由模式**: `/budget/:id` - 使用動態路由參數 `:id` 來識別特定的 proposal。

#### 現有詳細頁面狀態

From `app/budget-detail/index.tsx`:
- **當前實作**: 使用硬編碼的 MOCK_DATA 和靜態文字
- **元件結構**: 
  - 響應式設計（desktop/mobile 兩種佈局）
  - 使用 `useMediaQuery("(min-width: 768px)")` 來判斷裝置類型
  - 包含 Timeline 元件顯示審議階段
  - 支援 `hasImage` prop 來切換是否顯示提案單圖檔
- **硬編碼資料範例**:
  ```typescript
  const MOCK_DATA = [
    {
      id: 1,
      date: "2024年2月1日",
      title: "立法院三讀通過",
      description: "院會進行最終表決，正式通過預算案。",
    },
    // ...
  ];
  ```
  - 編號: "99"
  - 部會: "台灣自來水股份有限公司"
  - 提案人: "李柏毅"
  - 連署人: "王美惠、張宏陸"
  - 提案類型: "凍結"
  - 審議結果: "通過"
  - 預算金額: "21,200,000"
  - 等等...

#### GraphQL Schema Analysis

From `schema.graphql` (lines 897, 739-765):

**Single Proposal Query**:
```graphql
type Query {
  proposal(where: ProposalWhereUniqueInput!): Proposal
}

input ProposalWhereUniqueInput {
  id: ID
}
```

**Proposal Type Structure**:
```graphql
type Proposal {
  budget: Budget
  budgetImageUrl: String
  coSigners(cursor: PeopleWhereUniqueInput, orderBy: [PeopleOrderByInput!]! = [], skip: Int! = 0, take: Int, where: PeopleWhereInput! = {}): [People!]
  coSignersCount(where: PeopleWhereInput! = {}): Int
  description: String
  freezeAmount: Int
  government: Government
  historicalProposals(cursor: ProposalWhereUniqueInput, orderBy: [ProposalOrderByInput!]! = [], skip: Int! = 0, take: Int, where: ProposalWhereInput! = {}): [Proposal!]
  historicalProposalsCount(where: ProposalWhereInput! = {}): Int
  id: ID!
  meetings(cursor: MeetingWhereUniqueInput, orderBy: [MeetingOrderByInput!]! = [], skip: Int! = 0, take: Int, where: MeetingWhereInput! = {}): [Meeting!]
  meetingsCount(where: MeetingWhereInput! = {}): Int
  mergedProposals(cursor: ProposalWhereUniqueInput, orderBy: [ProposalOrderByInput!]! = [], skip: Int! = 0, take: Int, where: ProposalWhereInput! = {}): [Proposal!]
  mergedProposalsCount(where: ProposalWhereInput! = {}): Int
  proposalTypes: [ProposalProposalTypeType!]
  proposers(cursor: PeopleWhereUniqueInput, orderBy: [PeopleOrderByInput!]! = [], skip: Int! = 0, take: Int, where: PeopleWhereInput! = {}): [People!]
  proposersCount(where: PeopleWhereInput! = {}): Int
  publishStatus: String
  reason: String
  recognitionAnswer: String
  reductionAmount: Int
  result: String
  unfreezeHistory(cursor: MeetingWhereUniqueInput, orderBy: [MeetingOrderByInput!]! = [], skip: Int! = 0, take: Int, where: MeetingWhereInput! = {}): [Meeting!]
  unfreezeHistoryCount(where: MeetingWhereInput! = {}): Int
  unfreezeStatus: String
}
```

**Related Types**:
```graphql
type Budget {
  budgetAmount: Float
  budgetUrl: String
  description: String
  government: Government
  id: ID!
  lastYearSettlement: Float
  majorCategory: String
  mediumCategory: String
  minorCategory: String
  projectDescription: String
  projectName: String
  type: String
  year: Int
}

type Government {
  category: String
  description: String
  id: ID!
  name: String
}

type People {
  description: String
  id: ID!
  name: String
  party: People
  term: Term
  type: String
}

type Meeting {
  committee: Committee
  description: String
  displayName: String
  government: Government
  id: ID!
  location: String
  meetingDate: DateTime
  meetingRecordUrl: String
  type: String
}
```

### Existing Query Patterns

#### Pattern 1: List Query (from `app/queries/proposal.queries.ts`)

```typescript
import { graphql } from '~/graphql'

export const GET_PROPOSALS_QUERY = graphql(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
      id
      description
      reason
      # ... more fields
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

**重要觀察**:
- 使用 `graphql` 函式包裹 query string
- Query keys 已經預留了 `detail` 和 `details()` 的結構
- 遵循 React Query 的 hierarchical key pattern

#### Pattern 2: Data Fetching in Component (from `app/all-budgets/index.tsx`)

```typescript
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";

const AllBudgets = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.lists(),
    queryFn: () => execute(GET_PROPOSALS_QUERY),
  });
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  if (isLoading) return <AllBudgetsSkeleton isDesktop={isDesktop} />;
  if (isError) return redirect(ERROR_REDIRECT_ROUTE);
  
  return (
    // ... render logic
  );
};
```

**重要觀察**:
- 使用 `@tanstack/react-query` 的 `useQuery` hook
- 使用 `execute` 函式來執行 GraphQL query
- Loading 狀態使用專用的 Skeleton 元件
- Error 狀態使用 `redirect` 導向錯誤頁面

### React Router v7 Data Loading Patterns

From `react-router.config.ts`:
```typescript
export default {
  ssr: false,  // SPA mode
  basename: "/project/3/congress-budget-watch/",
} satisfies Config;
```

**重要**: 此專案使用 **SPA mode**，不使用 React Router 的 loader function。所有資料獲取都在元件內使用 React Query 進行。

### Skeleton Loading Pattern

From `app/components/skeleton/all-budgets-skeleton.tsx`:

```typescript
const AllBudgetsSkeleton = ({ isDesktop }: { isDesktop: boolean }) => {
  const skeletonCount = 6;

  return (
    <div className="p-5 md:mx-auto md:max-w-[720px] md:p-0 md:pt-8 lg:max-w-[960px]">
      {/* Title skeleton */}
      <div className="mb-3 flex w-full justify-center">
        <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
      </div>
      
      {/* ... more skeleton elements */}
      
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

export default AllBudgetsSkeleton;
```

**Skeleton 設計原則**:
- 使用 TailwindCSS 的 `animate-pulse` utility
- 模擬實際頁面的結構和佈局
- 支援響應式設計（desktop/mobile）
- 使用 `bg-gray-200` 作為 skeleton 的背景色
- 使用不同的寬度（`w-full`, `w-3/4`, `w-1/2`）來模擬不同長度的內容

### Field Mapping Analysis

根據現有的 `budget-detail/index.tsx` UI 結構，需要映射以下欄位：

| UI 欄位 | Proposal 資料來源 | 轉換邏輯 | Notes |
|---------|-------------------|----------|-------|
| **編號** | `proposal.id` | 直接顯示 | ✅ Direct |
| **分類** | `proposal.government?.category` | 直接顯示 | ✅ Direct |
| **部會** | `proposal.government?.name` | 直接顯示 | ✅ Direct |
| **提案人** | `proposal.proposers?.[0]?.name` | 取第一個提案人 | 🟢 Array access |
| **連署人** | `proposal.coSigners` | `coSigners.map(s => s.name).join('、')` | 🟢 Array join |
| **提案類型** | `proposal.proposalTypes` | 使用 `getProposalTypeDisplay()` 轉換 | 🟢 Enum to Chinese |
| **審議結果** | `proposal.result` | 根據值轉換（"passed" → "通過"） | 🟢 String mapping |
| **審議階段** | `proposal.meetings` | 轉換為 Timeline 格式 | 🔴 Complex transformation |
| **是否併案** | `proposal.mergedProposals` / `proposal.historicalProposals` | 判斷陣列長度 > 0 | 🟢 Boolean check |
| **併案列表** | `proposal.mergedProposals` | 顯示併案的提案人和日期 | 🔴 Complex transformation |
| **提案內容** | `proposal.reason` | 直接顯示 | ✅ Direct |
| **預算金額** | `proposal.budget?.budgetAmount` | 格式化數字 | 🟢 Number format |
| **減列金額** | `proposal.reductionAmount` | 格式化數字 | 🟢 Number format |
| **凍結金額** | `proposal.freezeAmount` | 格式化數字 | 🟢 Number format |
| **提案單圖檔** | `proposal.budgetImageUrl` | 判斷是否存在來決定顯示 | 🟢 Conditional render |
| **科目/計畫** | `proposal.budget?.majorCategory` / `mediumCategory` / `minorCategory` | 組合字串 | 🟢 String concatenation |
| **計畫說明** | `proposal.budget?.projectDescription` | 直接顯示 | ✅ Direct |
| **上年度決算** | `proposal.budget?.lastYearSettlement` | 格式化數字 | 🟢 Number format |
| **上年度法定預算** | `proposal.budget?.budgetAmount` (前一年) | 需要額外查詢或計算 | ⚠️ May not be available |
| **與上年度比較** | 計算差異 | 需要前一年資料 | ⚠️ May not be available |

**⚠️ 資料限制**:
- "上年度法定預算" 和 "與上年度比較" 可能需要額外的查詢或在後端計算
- 如果資料不可用，應顯示 "N/A" 或 "資料不足"

### Helper Functions from Existing Code

From `app/all-budgets/index.tsx`:

```typescript
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
```

**可重用**: 此函式可以直接在 `budget-detail/index.tsx` 中重用。

### Error Handling Pattern

From `app/constants/endpoints.ts` and `app/all-budgets/index.tsx`:

```typescript
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { redirect } from "react-router";

if (isError) return redirect(ERROR_REDIRECT_ROUTE);
```

## Implementation Blueprint

### Phase 1: Create Single Proposal Query

#### Step 1.1: Add GET_PROPOSAL_BY_ID_QUERY to `app/queries/proposal.queries.ts`

在現有的 `GET_PROPOSALS_QUERY` 之後新增：

```typescript
/**
 * GraphQL query to get a single proposal by ID
 * Includes all related data needed for the detail page
 *
 * Usage Example:
 *
 * ```tsx
 * import { useQuery } from "@tanstack/react-query";
 * import { execute } from "~/graphql/execute";
 * import { GET_PROPOSAL_BY_ID_QUERY, proposalQueryKeys } from "~/queries";
 *
 * const BudgetDetail = () => {
 *   const { id } = useParams();
 *   const { data, isLoading, isError } = useQuery({
 *     queryKey: proposalQueryKeys.detail(id!),
 *     queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
 *     enabled: !!id,
 *   });
 *
 *   if (isLoading) return <BudgetDetailSkeleton />;
 *   if (isError || !data?.proposal) return <div>Error</div>;
 *
 *   return <div>{data.proposal.description}</div>;
 * };
 * ```
 */
export const GET_PROPOSAL_BY_ID_QUERY = graphql(`
  query GetProposalById($id: ID!) {
    proposal(where: { id: $id }) {
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
        projectDescription
        budgetAmount
        budgetUrl
        lastYearSettlement
        year
        type
        majorCategory
        mediumCategory
        minorCategory
        description
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
      meetings(orderBy: [{ meetingDate: desc }]) {
        id
        displayName
        meetingDate
        description
        location
        meetingRecordUrl
        type
      }
      mergedProposals {
        id
        proposers {
          id
          name
        }
      }
      historicalProposals {
        id
        proposers {
          id
          name
        }
      }
    }
  }
`)
```

**重要細節**:
- Query 接受 `$id: ID!` 變數
- 使用 `where: { id: $id }` 來查詢特定 proposal
- 包含所有詳細頁面需要的欄位
- `meetings` 按 `meetingDate` 降序排列（最新的在前）
- 包含 `mergedProposals` 和 `historicalProposals` 以判斷是否併案

#### Step 1.2: Export Query in `app/queries/index.ts`

更新 exports：

```typescript
export {
  GET_PROPOSALS_QUERY,
  GET_PROPOSAL_BY_ID_QUERY,  // ← 新增
  proposalQueryKeys,
} from './proposal.queries'
```

### Phase 2: Create Helper Functions and Types

#### Step 2.1: Create Helper Functions File

建立 `app/budget-detail/helpers.ts`：

```typescript
import type {
  Proposal,
  ProposalProposalTypeType,
  Meeting,
} from "~/graphql/graphql";
import { ProposalProposalTypeType as ProposalProposalTypeTypeEnum } from "~/graphql/graphql";

/**
 * Timeline 元件所需的資料格式
 */
export type TimelineItem {
  id: number | string;
  date: string;
  title: string;
  description: string;
}

/**
 * 併案資訊的資料格式
 */
export type MergedProposalInfo {
  id: string;
  date: string;
  proposers: string;
}

/**
 * 將 ProposalProposalTypeType 轉換為中文顯示文字
 */
export function getProposalTypeDisplay(
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
 * 將審議結果轉換為中文顯示文字
 */
export function getResultDisplay(result?: string | null): string {
  if (!result) return "待審議";
  
  // 根據實際 API 回傳的值來調整
  const resultMap: Record<string, string> = {
    passed: "通過",
    rejected: "不通過",
    pending: "待審議",
  };
  
  return resultMap[result] || result;
}

/**
 * 格式化數字為千分位格式
 */
export function formatNumber(num?: number | null): string {
  if (num === null || num === undefined) return "N/A";
  return num.toLocaleString("zh-TW");
}

/**
 * 將 Meeting 陣列轉換為 Timeline 格式
 * 如果沒有 meetings 資料，返回空陣列
 */
export function meetingsToTimeline(meetings?: Meeting[] | null): TimelineItem[] {
  if (!meetings || meetings.length === 0) return [];

  return meetings.map((meeting, index) => ({
    id: meeting.id || index,
    date: meeting.meetingDate 
      ? new Date(meeting.meetingDate).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "日期未定",
    title: meeting.displayName || meeting.type || "會議",
    description: meeting.description || meeting.location || "",
  }));
}

/**
 * 將 mergedProposals 轉換為顯示格式
 */
export function formatMergedProposals(
  mergedProposals?: Array<{ id: string; proposers?: Array<{ name?: string | null }> | null }> | null
): MergedProposalInfo[] {
  if (!mergedProposals || mergedProposals.length === 0) return [];

  return mergedProposals.map((proposal) => ({
    id: proposal.id,
    date: "2025/08/01", // TODO: 如果 API 有提供日期，使用實際日期
    proposers: proposal.proposers
      ?.map((p) => p.name)
      .filter(Boolean)
      .join("、") || "未知",
  }));
}

/**
 * 組合科目/計畫字串
 */
export function formatBudgetCategory(
  majorCategory?: string | null,
  mediumCategory?: string | null,
  minorCategory?: string | null
): string {
  const parts = [majorCategory, mediumCategory, minorCategory].filter(Boolean);
  
  if (parts.length === 0) return "N/A";
  
  return parts.join(" > ");
}

/**
 * 判斷是否有併案
 */
export function hasMergedProposals(proposal?: Proposal | null): boolean {
  if (!proposal) return false;
  
  const mergedCount = proposal.mergedProposals?.length || 0;
  const historicalCount = proposal.historicalProposals?.length || 0;
  
  return mergedCount + historicalCount > 0;
}
```

### Phase 3: Create Skeleton Component

#### Step 3.1: Create `app/components/skeleton/budget-detail-skeleton.tsx`

```typescript
/**
 * BudgetDetail 頁面的 Skeleton Loading 狀態
 * 模擬頁面實際結構，提供載入中的視覺回饋
 */
const BudgetDetailSkeleton = ({ isDesktop }: { isDesktop: boolean }) => {
  if (isDesktop) {
    return (
      <div className="pb-8 text-sm">
        <div className="mx-2.5 flex flex-col md:mx-8">
          {/* Back link skeleton */}
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />
          
          <div className="relative mt-6">
            {/* Shadow box */}
            <div className="absolute h-full w-full translate-x-3 -translate-y-3 rounded-lg border-2 bg-[#C1C1C1]" />
            
            {/* Main content box */}
            <div className="relative flex flex-col rounded-lg border-2 bg-[#F6F6F6] p-5 pb-30">
              {/* ID section skeleton */}
              <div className="mb-4 flex gap-5 border-b-2 p-3">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
              </div>
              
              <div className="flex flex-col gap-y-10">
                {/* Row 1: Basic info */}
                <section className="flex gap-x-8">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                      <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </section>
                
                {/* Row 2: Timeline and merged proposals */}
                <section className="flex gap-x-8">
                  <div className="w-1/3">
                    <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="h-16 animate-pulse rounded bg-gray-200" />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                    <div className="h-32 animate-pulse rounded bg-gray-200" />
                  </div>
                </section>
                
                {/* Row 3: Proposal content */}
                <section>
                  <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  </div>
                </section>
                
                {/* Row 4: Budget amounts */}
                <section className="flex gap-x-8">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex-1">
                      <div className="mb-2 h-8 w-24 animate-pulse rounded-t-lg bg-gray-200" />
                      <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile skeleton
  return (
    <div className="mx-2.5 flex flex-col">
      {/* Back link skeleton */}
      <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />
      
      <div className="mt-2 border-2 px-2 py-3">
        {/* ID section */}
        <section className="mb-4 flex gap-6">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
        </section>
        
        {/* Basic info sections */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="mb-4">
            <div className="mb-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            {idx % 2 === 0 && (
              <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetDetailSkeleton;
```

### Phase 4: Update Budget Detail Component

#### Step 4.1: Update Imports in `app/budget-detail/index.tsx`

在檔案頂部更新 imports：

```typescript
import { NavLink, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Timeline } from "../components/timeline/Timeline";
import Image from "~/components/image";
import { useMediaQuery } from "usehooks-ts";
import { execute } from "~/graphql/execute";
import { GET_PROPOSAL_BY_ID_QUERY, proposalQueryKeys } from "~/queries";
import { ERROR_REDIRECT_ROUTE } from "~/constants/endpoints";
import { redirect } from "react-router";
import BudgetDetailSkeleton from "~/components/skeleton/budget-detail-skeleton";
import {
  getProposalTypeDisplay,
  getResultDisplay,
  formatNumber,
  meetingsToTimeline,
  formatMergedProposals,
  formatBudgetCategory,
  hasMergedProposals,
} from "./helpers";
import type { Proposal } from "~/graphql/graphql";
```

#### Step 4.2: Add Data Fetching Logic

在 `BudgetDetail` 元件開頭新增資料獲取邏輯：

```typescript
const BudgetDetail = () => {
  const { id } = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  // Fetch proposal data
  const { data, isLoading, isError } = useQuery({
    queryKey: proposalQueryKeys.detail(id!),
    queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
    enabled: !!id, // Only run query if id exists
  });
  
  // Handle loading and error states
  if (isLoading) return <BudgetDetailSkeleton isDesktop={isDesktop} />;
  if (isError || !data?.proposal) return redirect(ERROR_REDIRECT_ROUTE);
  
  const proposal = data.proposal;
  
  // Transform data for rendering
  const timelineData = meetingsToTimeline(proposal.meetings);
  const mergedProposalsData = formatMergedProposals(proposal.mergedProposals);
  const hasMerged = hasMergedProposals(proposal);
  const hasImage = !!proposal.budgetImageUrl;
  
  // Prepare display values
  const proposerName = proposal.proposers?.[0]?.name || "無";
  const cosignersText = proposal.coSigners && proposal.coSigners.length > 0
    ? proposal.coSigners.map(s => s.name).join("、")
    : "無";
  const proposalType = getProposalTypeDisplay(proposal.proposalTypes);
  const resultText = getResultDisplay(proposal.result);
  const budgetCategory = formatBudgetCategory(
    proposal.budget?.majorCategory,
    proposal.budget?.mediumCategory,
    proposal.budget?.minorCategory
  );
  
  // Rest of the component logic...
```

#### Step 4.3: Replace Hardcoded Values with Real Data

**Desktop版本範例** (lines 39-84):

**Before:**
```typescript
<div className="mb-4 flex gap-5 border-b-2 p-3 text-xl font-bold">
  <p>編號</p>
  <p className="text-[#D18081]">99</p>
</div>
```

**After:**
```typescript
<div className="mb-4 flex gap-5 border-b-2 p-3 text-xl font-bold">
  <p>編號</p>
  <p className="text-[#D18081]">{proposal.id}</p>
</div>
```

**Row 1 - Basic Info** (lines 45-84):

**Before:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      分類
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
      經濟部
    </p>
  </div>
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      部會
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
      台灣自來水股份有限公司
    </p>
  </div>
  {/* ... more hardcoded fields */}
</section>
```

**After:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      分類
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
      {proposal.government?.category || "N/A"}
    </p>
  </div>
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      部會
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
      {proposal.government?.name || "N/A"}
    </p>
  </div>
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      提案人（連署）
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-8 lg:pr-12">
      {proposerName}
      <br />
      （{cosignersText}）
    </p>
  </div>
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      提案
    </p>
    <p className="flex w-fit border-t-1 pt-4 md:pr-12">{proposalType}</p>
  </div>
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      審議結果
    </p>
    <p className="flex border-t-1 pt-4 pr-12">{resultText}</p>
  </div>
</section>
```

**Row 2 - Timeline and Merged Proposals** (lines 86-147):

**Before:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      審議階段
    </p>
    <div className="flex w-fit border-t-1 pt-4 pr-13 md:pr-24">
      <Timeline items={MOCK_DATA} />
    </div>
  </div>
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      是否併案
    </p>
    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
      <p>是</p>
      {/* ... hardcoded merged proposals */}
    </div>
  </div>
</section>
```

**After:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      審議階段
    </p>
    <div className="flex w-fit border-t-1 pt-4 pr-13 md:pr-24">
      {timelineData.length > 0 ? (
        <Timeline items={timelineData} />
      ) : (
        <p className="text-gray-500">暫無審議資料</p>
      )}
    </div>
  </div>
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      是否併案
    </p>
    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
      <p>{hasMerged ? "是" : "否"}</p>
      {hasMerged && mergedProposalsData.length > 0 && (
        <div className="grid-rows-auto grid grid-cols-3 gap-4.5">
          {mergedProposalsData.map((merged) => (
            <div key={merged.id} className="flex gap-x-2">
              <div className="mt-2 size-2 rounded-full bg-black" />
              <div className="text-[#868686]">
                <p className="underline">{merged.date}</p>
                <p>{merged.proposers}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</section>
```

**Row 3 - Proposal Content** (lines 149-160):

**Before:**
```typescript
<section className="flex">
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      提案內容
    </p>
    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
      <p className="text-sm">
        原住民族委員會為深化民族教育內涵...【208】
      </p>
    </div>
  </div>
</section>
```

**After:**
```typescript
<section className="flex">
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      提案內容
    </p>
    <div className="flex flex-col gap-y-4 border-t-1 pt-4">
      <p className="text-sm whitespace-pre-wrap">
        {proposal.reason || proposal.description || "無提案內容"}
      </p>
    </div>
  </div>
</section>
```

**Row 4 - Budget Amounts (without image)** (lines 162-189):

**Before:**
```typescript
{!hasImage && (
  <section className="flex">
    <div>
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        預算金額
      </p>
      <p className="flex w-fit border-t-1 border-black pt-4 pr-32 font-bold text-[#E9808E]">
        21,200,000
      </p>
    </div>
    {/* ... more hardcoded amounts */}
  </section>
)}
```

**After:**
```typescript
{!hasImage && (
  <section className="flex">
    <div>
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        預算金額
      </p>
      <p className="flex w-fit border-t-1 border-black pt-4 pr-32 font-bold text-[#E9808E]">
        {formatNumber(proposal.budget?.budgetAmount)}
      </p>
    </div>
    <div>
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        減列金額
      </p>
      <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold text-[#E9808E]">
        {formatNumber(proposal.reductionAmount)}
      </p>
    </div>
    <div className="grow">
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        凍結金額
      </p>
      <p className="flex border-t-1 border-black pt-4 font-bold text-[#E9808E]">
        {formatNumber(proposal.freezeAmount)}
      </p>
    </div>
  </section>
)}
```

**Row 4 - Budget Amounts (with image)** (lines 191-253):

類似的更新邏輯，並新增圖片顯示：

```typescript
{hasImage && (
  <section className="flex">
    <div id="left" className="flex w-6/11 flex-col">
      <div className="flex">
        <div>
          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
            預算金額
          </p>
          <p className="flex w-fit border-t-1 border-black pt-4 font-bold text-[#E9808E] md:pr-8 lg:pr-16 xl:pr-32">
            {formatNumber(proposal.budget?.budgetAmount)}
          </p>
        </div>
        {/* ... similar updates for other amounts */}
      </div>
      <div className="mt-9 flex max-w-5/6 flex-col gap-y-9">
        <div className="grow">
          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
            科目/計畫
          </p>
          <p className="flex border-t-1 border-black pt-4 pr-9">
            {budgetCategory}
          </p>
        </div>
        <div className="">
          <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
            計畫說明
          </p>
          <p className="flex border-t-1 border-black pt-4 whitespace-pre-wrap">
            {proposal.budget?.projectDescription || "N/A"}
          </p>
        </div>
      </div>
    </div>
    <div id="right" className="w-5/11">
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        提案單圖檔
      </p>
      <div className="flex border-t-1 border-black pt-4 font-bold">
        <Image
          src={proposal.budgetImageUrl || "/icon/default-image.svg"}
          alt="proposal-image"
          className="w-full"
        />
      </div>
    </div>
  </section>
)}
```

**Row 5 - Budget Category (without image)** (lines 255-276):

**Before:**
```typescript
{!hasImage && (
  <section className="flex">
    <div className="grow">
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        科目/計畫
      </p>
      <p className="flex border-t-1 border-black pt-4 pr-9">
        3703610100 一般行政 {">"} 02 基本行政工作維持費 {">"}{" "}
        計畫 1090000
      </p>
    </div>
    {/* ... */}
  </section>
)}
```

**After:**
```typescript
{!hasImage && (
  <section className="flex">
    <div className="grow">
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        科目/計畫
      </p>
      <p className="flex border-t-1 border-black pt-4 pr-9">
        {budgetCategory}
      </p>
    </div>

    <div className="w-[478px] max-w-[478px]">
      <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
        計畫說明
      </p>
      <p className="flex border-t-1 border-black pt-4 whitespace-pre-wrap">
        {proposal.budget?.projectDescription || "N/A"}
      </p>
    </div>
  </section>
)}
```

**Row 6 - Last Year Data** (lines 278-303):

**Before:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      上年度決算
    </p>
    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
      21,200,000
    </p>
  </div>
  {/* ... */}
</section>
```

**After:**
```typescript
<section className="flex">
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      上年度決算
    </p>
    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
      {formatNumber(proposal.budget?.lastYearSettlement)}
    </p>
  </div>
  <div>
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      上年度法定預算
    </p>
    <p className="flex w-fit border-t-1 border-black pt-4 pr-[136px] font-bold">
      N/A
    </p>
  </div>
  <div className="grow">
    <p className="w-fit rounded-t-lg border-2 border-black bg-[#E9808E] px-2.5 py-1 text-white">
      與上年度比較
    </p>
    <p className="flex border-t-1 border-black pt-4 font-bold text-[#3E51FF]">
      N/A
    </p>
  </div>
</section>
```

**注意**: "上年度法定預算" 和 "與上年度比較" 目前設為 "N/A"，因為這些資料可能需要額外的查詢或計算。

**Mobile 版本的更新邏輯類似**，只是佈局不同。主要更新點：
- Line 358: `{proposal.id}`
- Line 363: `{proposal.government?.category || "N/A"}`
- Line 367: `{proposal.government?.name || "N/A"}`
- Line 373: 使用 `timelineData`
- Line 405: `{proposerName}`
- Line 406: `（{cosignersText}）`
- Line 415: `{proposalType}`
- Line 419: `{resultText}`
- Line 431: `{proposal.reason || proposal.description || "無提案內容"}`
- Line 440, 444, 451: 使用 `formatNumber()` 格式化金額
- Line 479: `{budgetCategory}`
- Line 492: `{proposal.budget?.projectDescription || "N/A"}`
- Line 501, 505, 509: 使用 `formatNumber()` 格式化上年度資料

#### Step 4.4: Remove MOCK_DATA

刪除檔案頂部的 `MOCK_DATA` 常數（lines 6-25）：

```typescript
// DELETE THIS:
const MOCK_DATA = [
  {
    id: 1,
    date: "2024年2月1日",
    title: "立法院三讀通過",
    description: "院會進行最終表決，正式通過預算案。",
  },
  // ...
];
```

#### Step 4.5: Update Component Signature

更新元件簽名，移除 `hasImage` prop（因為現在從資料中判斷）：

**Before:**
```typescript
const BudgetDetail = ({ hasImage = false }: { hasImage?: boolean }) => {
```

**After:**
```typescript
const BudgetDetail = () => {
```

### Phase 5: Code Cleanup and Validation

#### Step 5.1: Remove Unused Imports

確保移除任何未使用的 imports。

#### Step 5.2: Add Error Boundary (Optional Enhancement)

考慮在 `app/root.tsx` 中已經有 `ErrorBoundary`，所以個別頁面的錯誤會被捕獲。

## Validation Gates

### Gate 1: TypeScript Compilation

```bash
cd /Users/user/Documents/code/congress-budget && pnpm typecheck
```

**Pass Criteria:** 
- Exit code 0
- No TypeScript errors
- All types properly imported and used

**Common Issues to Check**:
- `useParams()` 返回的 `id` 可能是 `undefined`，需要使用 `id!` 或 optional chaining
- GraphQL query 的變數型別必須匹配
- Helper functions 的參數和返回值型別正確

### Gate 2: Linting

```bash
cd /Users/user/Documents/code/congress-budget && pnpm lint:check
```

**Pass Criteria:**
- Exit code 0 (or only pre-existing errors)
- No new ESLint errors introduced
- Proper formatting

### Gate 3: GraphQL Code Generation

```bash
cd /Users/user/Documents/code/congress-budget && pnpm codegen
```

**Pass Criteria:**
- Exit code 0
- `GET_PROPOSAL_BY_ID_QUERY` 正確生成型別
- `app/graphql/graphql.ts` 更新成功

### Gate 4: Build Success

```bash
cd /Users/user/Documents/code/congress-budget && pnpm build
```

**Pass Criteria:**
- Build completes successfully
- No build errors
- All imports resolve correctly

### Gate 5: Manual Testing (Optional - User Skipped)

根據 Reminders，不需要執行 `pnpm dev`，但如果需要測試：

```bash
cd /Users/user/Documents/code/congress-budget && pnpm dev
```

**Test Cases**:
1. **Valid Proposal ID**:
   - Navigate to `/budget/1` (或任何有效的 proposal ID)
   - 驗證：
     - Skeleton 在載入時顯示
     - 資料載入後正確顯示
     - 所有欄位都有正確的值
     - 圖片（如果有）正確顯示
     - Timeline 正確渲染
     - 併案資訊正確顯示

2. **Invalid Proposal ID**:
   - Navigate to `/budget/999999` (不存在的 ID)
   - 驗證：
     - 正確導向錯誤頁面
     - 不會 crash

3. **Responsive Design**:
   - 在不同螢幕尺寸下測試
   - 驗證：
     - Desktop 和 mobile 佈局都正確
     - Skeleton 響應式正常

4. **Edge Cases**:
   - Proposal 缺少某些欄位（如沒有 budget）
   - 驗證：
     - 顯示 "N/A" 或預設值
     - 不會 crash

## Gotchas & Common Pitfalls

### 1. Route Parameter Type Safety

⚠️ **Pitfall:** `useParams()` 返回的 `id` 可能是 `undefined`。

**Solution:**
```typescript
const { id } = useParams();

// 使用 enabled 選項確保只在 id 存在時執行 query
const { data, isLoading, isError } = useQuery({
  queryKey: proposalQueryKeys.detail(id!),
  queryFn: () => execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! }),
  enabled: !!id,  // ← 重要！
});
```

### 2. GraphQL Query Variables

⚠️ **Pitfall:** GraphQL query 需要正確的變數型別。

**Solution:**
```typescript
// Query 定義
export const GET_PROPOSAL_BY_ID_QUERY = graphql(`
  query GetProposalById($id: ID!) {  // ← 注意 $id: ID!
    proposal(where: { id: $id }) {
      # ...
    }
  }
`)

// 使用時
execute(GET_PROPOSAL_BY_ID_QUERY, { id: id! })  // ← 傳遞 { id: string }
```

### 3. Nested Data Access

⚠️ **Pitfall:** Proposal 的許多欄位都是 nested（如 `proposal.budget?.budgetAmount`），需要使用 optional chaining。

**Solution:**
```typescript
// 正確
const amount = proposal.budget?.budgetAmount || 0;

// 錯誤 - 可能會 crash
const amount = proposal.budget.budgetAmount;
```

### 4. Array Access Safety

⚠️ **Pitfall:** `proposers` 和 `coSigners` 可能是空陣列或 `null`。

**Solution:**
```typescript
// 正確
const proposer = proposal.proposers?.[0]?.name || "無";

// 錯誤 - 可能會 crash
const proposer = proposal.proposers[0].name;
```

### 5. Timeline Data Format

⚠️ **Pitfall:** Timeline 元件期望特定的資料格式。

**Solution:** 使用 `meetingsToTimeline()` helper 函式來轉換資料，確保格式正確。

### 6. Number Formatting

⚠️ **Pitfall:** 數字需要格式化為千分位格式。

**Solution:** 使用 `formatNumber()` helper 函式：
```typescript
// 正確
<p>{formatNumber(proposal.budget?.budgetAmount)}</p>

// 錯誤 - 沒有千分位
<p>{proposal.budget?.budgetAmount}</p>
```

### 7. Image URL Handling

⚠️ **Pitfall:** `budgetImageUrl` 可能是 `null` 或空字串。

**Solution:**
```typescript
const hasImage = !!proposal.budgetImageUrl;

// 使用時提供 fallback
<Image
  src={proposal.budgetImageUrl || "/icon/default-image.svg"}
  alt="proposal-image"
/>
```

### 8. Whitespace in Long Text

⚠️ **Pitfall:** 提案內容可能包含換行符，需要保留格式。

**Solution:**
```typescript
<p className="text-sm whitespace-pre-wrap">
  {proposal.reason || "無提案內容"}
</p>
```

### 9. Conditional Rendering

⚠️ **Pitfall:** 某些區塊只在特定條件下顯示（如有圖片時）。

**Solution:** 確保條件邏輯正確：
```typescript
const hasImage = !!proposal.budgetImageUrl;

{!hasImage && (
  // Without image layout
)}

{hasImage && (
  // With image layout
)}
```

### 10. GraphQL Code Generation

⚠️ **Pitfall:** 新增 query 後需要重新生成型別。

**Solution:** 
```bash
pnpm codegen
```

在實作完成後，務必執行此指令以生成新的 TypeScript 型別。

## Task Checklist

實作時請按照以下順序完成：

### Phase 1: GraphQL Query Setup
- [ ] 1.1 在 `app/queries/proposal.queries.ts` 中新增 `GET_PROPOSAL_BY_ID_QUERY`
- [ ] 1.2 在 `app/queries/index.ts` 中 export 新的 query
- [ ] 1.3 執行 `pnpm codegen` 生成型別

### Phase 2: Helper Functions
- [ ] 2.1 建立 `app/budget-detail/helpers.ts` 檔案
- [ ] 2.2 實作所有 helper functions（8個函式）
- [ ] 2.3 Export 所有必要的 types 和 functions

### Phase 3: Skeleton Component
- [ ] 3.1 建立 `app/components/skeleton/budget-detail-skeleton.tsx`
- [ ] 3.2 實作 desktop skeleton 佈局
- [ ] 3.3 實作 mobile skeleton 佈局

### Phase 4: Update Budget Detail Component
- [ ] 4.1 更新 imports（新增 React Query、helpers、skeleton）
- [ ] 4.2 新增 `useParams()` 和資料獲取邏輯
- [ ] 4.3 新增 loading 和 error 處理
- [ ] 4.4 準備 display values（proposerName, cosignersText, etc.）
- [ ] 4.5 更新 desktop 版本的所有硬編碼值：
  - [ ] 編號 (ID)
  - [ ] Row 1: 分類、部會、提案人、提案類型、審議結果
  - [ ] Row 2: 審議階段 (Timeline)、是否併案
  - [ ] Row 3: 提案內容
  - [ ] Row 4: 預算金額、減列金額、凍結金額（with/without image）
  - [ ] Row 5: 科目/計畫、計畫說明（without image）
  - [ ] Row 6: 上年度決算
- [ ] 4.6 更新 mobile 版本的所有硬編碼值
- [ ] 4.7 移除 `MOCK_DATA` 常數
- [ ] 4.8 更新元件簽名（移除 `hasImage` prop）

### Phase 5: Cleanup and Validation
- [ ] 5.1 移除未使用的 imports
- [ ] 5.2 執行 `pnpm typecheck` 並修復錯誤
- [ ] 5.3 執行 `pnpm lint:check` 並修復錯誤
- [ ] 5.4 執行 `pnpm build` 確保建置成功
- [ ] 5.5 （可選）手動測試功能

## References & Documentation

### GraphQL Documentation
- **Schema**: `schema.graphql` lines 739-765 (Proposal type), 897 (Query.proposal)
- **Endpoint**: https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql
- **GraphQL Codegen**: https://the-guild.dev/graphql/codegen

### Codebase Patterns
- **Query Pattern**: `app/queries/proposal.queries.ts` (existing list query)
- **Data Fetching**: `app/all-budgets/index.tsx` (React Query usage)
- **Skeleton Pattern**: `app/components/skeleton/all-budgets-skeleton.tsx`
- **Route Config**: `app/routes.ts`

### React Query Documentation
- **useQuery Hook**: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
- **Query Keys**: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys

### React Router v7 Documentation
- **useParams Hook**: https://reactrouter.com/en/main/hooks/use-params
- **Dynamic Routes**: https://reactrouter.com/en/main/route/route#dynamic-segments

### TailwindCSS Utilities
- **animate-pulse**: https://tailwindcss.com/docs/animation#pulse
- **whitespace-pre-wrap**: https://tailwindcss.com/docs/whitespace

## Success Criteria

此 PRP 實作成功的標準：

1. ✅ **GraphQL Query 建立完成**：
   - `GET_PROPOSAL_BY_ID_QUERY` 正確定義並 export
   - Query 包含所有必要的欄位
   - 型別正確生成

2. ✅ **Helper Functions 實作完成**：
   - 所有 8 個 helper functions 正確實作
   - 型別定義完整
   - 邊界情況正確處理

3. ✅ **Skeleton Component 實作完成**：
   - Desktop 和 mobile 佈局都正確
   - 模擬實際頁面結構
   - 動畫效果正常

4. ✅ **資料獲取與顯示**：
   - 使用 `useParams()` 正確獲取路由參數
   - React Query 正確配置
   - Loading 和 error 狀態正確處理
   - 所有硬編碼值替換為真實資料

5. ✅ **UI 一致性**：
   - 頁面佈局與之前完全相同
   - 響應式設計正常運作
   - 所有樣式保持不變

6. ✅ **程式碼品質**：
   - TypeScript 編譯通過（無 type errors）
   - ESLint 檢查通過（無 linting errors）
   - Build 成功完成

7. ✅ **Edge Cases 處理**：
   - 缺少資料時顯示預設值或 "N/A"
   - 空陣列正確處理
   - Null/undefined 值安全處理
   - 無 runtime errors

8. ✅ **功能完整性**：
   - Timeline 正確顯示
   - 併案資訊正確顯示
   - 圖片條件渲染正常
   - 數字格式化正確

## Confidence Score

**8.5/10** - 高信心一次性實作成功

**理由：**
- ✅ 完整的 GraphQL schema 和型別定義
- ✅ 清晰的現有模式可供參考
- ✅ 詳細的欄位映射表和轉換邏輯
- ✅ 具體的 helper functions 實作範例
- ✅ 完整的 skeleton 實作指引
- ✅ 可執行的驗證指令
- ✅ 詳細的 gotchas 和解決方案

**扣 1.5 分原因：**
- ⚠️ Timeline 資料轉換可能需要根據實際 API 回傳格式微調
- ⚠️ 併案資訊的日期欄位可能不在 API 中，需要確認
- ⚠️ "上年度法定預算" 和 "與上年度比較" 可能需要額外的查詢或後端支援

**風險緩解：**
- 提供完整的 Edge Cases 處理邏輯
- 所有可能缺少的資料都有 fallback 值
- 詳細的 gotchas 說明和解決方案
- 完整的型別安全檢查

