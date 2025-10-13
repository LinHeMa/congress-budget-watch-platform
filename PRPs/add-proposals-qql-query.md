# PRP: Add Proposals GraphQL Query with React Query Integration

## Overview

實作一個可重複使用的 Proposals GraphQL query 和 React Query hooks，遵循現有代碼庫模式，按照 id 降序（descending）獲取提案資料，不包含任何元件實作。這是一個純資料層功能，重點在於建立可復用的 query function 和 hooks。

## Context & Research Findings

### Current Codebase State

- **Framework**: React Router v7 in SPA mode (`ssr: false`)
- **Data Fetching**: @tanstack/react-query v5.86.0 for server state management
- **GraphQL**: Code generation with `@graphql-codegen/client-preset`
- **GraphQL Endpoint**: `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql`
- **TypeScript**: Full type safety with generated GraphQL types

### GraphQL Schema Analysis

從 `schema.graphql` (lines 717-876) 分析 Proposal type：

```graphql
type Proposal {
  id: ID!
  budget: Budget
  budgetImageUrl: String
  coSigners(cursor: PeopleWhereUniqueInput, orderBy: [PeopleOrderByInput!]! = [], skip: Int! = 0, take: Int, where: PeopleWhereInput! = {}): [People!]
  description: String
  freezeAmount: Int
  government: Government
  historicalProposals(cursor: ProposalWhereUniqueInput, orderBy: [ProposalOrderByInput!]! = [], skip: Int! = 0, take: Int, where: ProposalWhereInput! = {}): [Proposal!]
  meetings(cursor: MeetingWhereUniqueInput, orderBy: [MeetingOrderByInput!]! = [], skip: Int! = 0, take: Int, where: MeetingWhereInput! = {}): [Meeting!]
  mergedProposals(cursor: ProposalWhereUniqueInput, orderBy: [ProposalOrderByInput!]! = [], skip: Int! = 0, take: Int, where: ProposalWhereInput! = {}): [Proposal!]
  proposalTypes: [ProposalProposalTypeType!]
  proposers(cursor: PeopleWhereUniqueInput, orderBy: [PeopleOrderByInput!]! = [], skip: Int! = 0, take: Int, where: PeopleWhereInput! = {}): [People!]
  publishStatus: String
  reason: String
  recognitionAnswer: String
  reductionAmount: Int
  result: String
  unfreezeHistory(cursor: MeetingWhereUniqueInput, orderBy: [MeetingOrderByInput!]! = [], skip: Int! = 0, take: Int, where: MeetingWhereInput! = {}): [Meeting!]
  unfreezeStatus: String
}
```

**Query 支援** (line 876):
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

**ProposalOrderByInput** (lines 772-783):
```graphql
input ProposalOrderByInput {
  budgetImageUrl: OrderDirection
  description: OrderDirection
  freezeAmount: OrderDirection
  id: OrderDirection  # ← 我們需要這個
  publishStatus: OrderDirection
  reason: OrderDirection
  recognitionAnswer: OrderDirection
  reductionAmount: OrderDirection
  result: OrderDirection
  unfreezeStatus: OrderDirection
}

enum OrderDirection {
  asc
  desc
}
```

### Existing Implementation Patterns

#### 1. GraphQL Query Definition Pattern

從 `app/queries/budget.queries.ts` 可以看到現有模式：

```typescript
import { graphql } from "~/graphql";

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

export const budgetQueryKeys = {
  all: ["budgets"] as const,
  lists: () => [...budgetQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...budgetQueryKeys.lists(), { filters }] as const,
  listsWithGovernment: () =>
    [...budgetQueryKeys.all, "listWithGovernment"] as const,
  listWithGovernment: (filters?: Record<string, unknown>) =>
    [...budgetQueryKeys.listsWithGovernment(), { filters }] as const,
  details: () => [...budgetQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...budgetQueryKeys.details(), id] as const,
} as const;
```

**重要模式識別**：
- ✅ 使用 `graphql` tagged template function 來定義 query
- ✅ Export query constant 和對應的 query keys factory
- ✅ Query keys 使用層級結構（all > lists > list）
- ✅ JSDoc 註解說明 query 用途

#### 2. Execute Function Pattern

從 `app/graphql/execute.ts` 可以看到執行模式：

```typescript
import type { TypedDocumentString } from "./graphql";
import { GQL_ENDPOINTS } from "~/constants/endpoints";

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
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  return result.data as TResult;
}
```

**關鍵特性**：
- ✅ 支援 typed variables
- ✅ 自動處理沒有 variables 的情況
- ✅ Type-safe return value
- ✅ 統一的錯誤處理

#### 3. React Query Usage Pattern

從 `app/all-budgets/index.tsx` 可以看到使用模式：

```typescript
import { useQuery } from "@tanstack/react-query";
import { execute } from "~/graphql/execute";
import { GET_BUDGETS_QUERY, budgetQueryKeys } from "~/queries";

const AllBudgets = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: budgetQueryKeys.lists(),
    queryFn: () => execute(GET_BUDGETS_QUERY),
  });

  // ... component logic
};
```

### Endpoint Configuration

從 `app/constants/endpoints.ts`：

```typescript
const GQL_ENDPOINTS =
  "https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql";
```

⚠️ **重要發現**：Feature file 中提到的 endpoint 是 `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/`，但實際配置中有 `/api/graphql` 後綴。我們應該使用現有配置的 endpoint。

### React Query Best Practices

根據 TanStack Query v5 文件：
- Query keys 應該是陣列形式，支援層級結構
- Query keys 應該包含所有會影響 query 的參數
- 使用 factory function 來生成一致的 query keys
- 保持 query 和 mutation 的職責分離

參考：
- https://tanstack.com/query/v5/docs/react/guides/query-keys
- https://tkdodo.eu/blog/effective-react-query-keys

## Implementation Blueprint

### Phase 1: GraphQL Query Definition

建立 `app/queries/proposal.queries.ts` 檔案，定義 Proposals query。

**重要設計決策**：

1. **選擇重要欄位**：不選擇所有欄位，只選擇常用的核心欄位
2. **關聯資料**：包含 government、budget、proposers 等重要關聯
3. **排序**：使用 `orderBy: [{ id: desc }]` 按 ID 降序
4. **分頁支援**：雖然初版不用分頁，但 query 結構支援未來擴充

```typescript
import { graphql } from "~/graphql";

/**
 * GraphQL query to get all proposals ordered by ID descending
 * Includes related government, budget, and proposers data
 */
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
`);

/**
 * React Query keys for proposal-related queries
 * Following the recommended hierarchical pattern
 */
export const proposalQueryKeys = {
  all: ["proposals"] as const,
  lists: () => [...proposalQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...proposalQueryKeys.lists(), { filters }] as const,
  details: () => [...proposalQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const;
```

### Phase 2: Export from Index

更新 `app/queries/index.ts` 來 export 新的 proposals queries：

```typescript
// 現有的
export { GET_BUDGETS_QUERY, budgetQueryKeys } from "./budget.queries";

// 新增
export { GET_PROPOSALS_QUERY, proposalQueryKeys } from "./proposal.queries";
```

### Phase 3: Type Generation

執行 GraphQL code generation：

```bash
pnpm codegen
```

這會：
1. 從 remote schema 獲取最新的 type definitions
2. 基於我們定義的 query 生成 TypeScript types
3. 更新 `app/graphql/graphql.ts` 檔案

### Phase 4: Usage Example Documentation

在 query 檔案中加入使用範例註解：

```typescript
/**
 * Usage Example:
 * 
 * ```tsx
 * import { useQuery } from "@tanstack/react-query";
 * import { execute } from "~/graphql/execute";
 * import { GET_PROPOSALS_QUERY, proposalQueryKeys } from "~/queries";
 * 
 * const MyComponent = () => {
 *   const { data, isLoading, isError } = useQuery({
 *     queryKey: proposalQueryKeys.lists(),
 *     queryFn: () => execute(GET_PROPOSALS_QUERY),
 *   });
 * 
 *   if (isLoading) return <div>Loading...</div>;
 *   if (isError) return <div>Error loading proposals</div>;
 * 
 *   return (
 *     <div>
 *       {data?.proposals?.map((proposal) => (
 *         <div key={proposal.id}>
 *           <h3>{proposal.description}</h3>
 *           <p>Amount: {proposal.freezeAmount || proposal.reductionAmount}</p>
 *         </div>
 *       ))}
 *       <p>Total: {data?.proposalsCount}</p>
 *     </div>
 *   );
 * };
 * ```
 */
```

## Critical Implementation Details

### TypeScript Type Safety

生成的 types 會包含：

```typescript
// Auto-generated in app/graphql/graphql.ts
export type GetProposalsOrderedByIdDescQuery = {
  proposals: Array<{
    id: string;
    description?: string | null;
    freezeAmount?: number | null;
    // ... all selected fields with proper nullable types
    government?: {
      id: string;
      name?: string | null;
      // ...
    } | null;
  }>;
  proposalsCount: number;
};
```

### Query Key Strategy

遵循 TanStack Query 的建議模式：

1. **層級結構**：`['proposals']` → `['proposals', 'list']` → `['proposals', 'list', { filters }]`
2. **可擴展性**：未來可以加入 `proposalQueryKeys.list({ orderBy: 'id', direction: 'desc' })`
3. **一致性**：與現有 `budgetQueryKeys` 保持相同結構

### Error Handling Strategy

1. **Network Errors**: `execute` function 會拋出 error，React Query 會自動處理
2. **GraphQL Errors**: 回傳的 `result.data` 可能包含 partial data
3. **Type Safety**: TypeScript 會強制檢查所有 nullable 欄位

### Performance Considerations

1. **欄位選擇**：只選擇必要的欄位，減少 payload size
2. **關聯資料深度**：限制在 2 層（proposal → government/budget）
3. **快取策略**：React Query 會自動快取，預設 staleTime 為 0
4. **建議配置**：

```typescript
// 使用時可以自訂 staleTime 和 cacheTime
useQuery({
  queryKey: proposalQueryKeys.lists(),
  queryFn: () => execute(GET_PROPOSALS_QUERY),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (舊版叫 cacheTime)
});
```

## Identified Issues & Solutions

### 🔴 Issue #1: Endpoint URL 不一致

**問題**：Feature file 提到 endpoint 是 `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/`，但 `endpoints.ts` 中實際配置是 `https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql`（多了 `/api/graphql` 後綴）。

**分析**：
- 查看 `codegen.ts` 可以確認它使用 `GQL_ENDPOINTS` from `./app/constants/endpoints`
- 現有的 budget queries 都正常工作，證明配置是正確的
- Feature file 可能只是省略了路徑細節

**解決方案**：
✅ 使用現有的 `GQL_ENDPOINTS` 配置，不需要修改
✅ 在 PRP 中註明這個發現，讓後續開發者知道正確的 endpoint

**建議**：向使用者確認 endpoint URL，但預設使用現有配置。

### 🟡 Issue #2: Query 複雜度與效能

**問題**：Proposal type 有很多關聯欄位（historicalProposals、mergedProposals、meetings 等），如果全選會導致：
- 過大的 payload
- N+1 query 問題（如果 backend 沒有 DataLoader）
- 前端處理複雜

**解決方案**：
✅ 只選擇核心欄位和一層關聯（government, budget, proposers, coSigners）
✅ 不選擇巢狀的 list 欄位（historicalProposals, mergedProposals, meetings）
✅ 如果未來需要詳細資料，建立 separate query：`GET_PROPOSAL_DETAIL_QUERY`

### 🟢 Issue #3: 復用性設計

**優點**：
- Query keys factory 設計支援未來擴充
- 可以輕鬆加入 filters 和 pagination
- Type safety 確保所有使用都是正確的

**未來擴充範例**：

```typescript
// 未來可以加入
export const GET_PROPOSALS_WITH_FILTERS_QUERY = graphql(`
  query GetProposalsWithFilters($where: ProposalWhereInput, $take: Int) {
    proposals(
      orderBy: [{ id: desc }]
      where: $where
      take: $take
    ) {
      # ... fields
    }
  }
`);

// 使用時
useQuery({
  queryKey: proposalQueryKeys.list({ where: { publishStatus: 'published' } }),
  queryFn: () => execute(GET_PROPOSALS_WITH_FILTERS_QUERY, { 
    where: { publishStatus: { equals: "published" } },
    take: 20
  }),
});
```

## Validation Gates

### Pre-Implementation Checklist

```bash
# 1. 確認開發環境正常
pnpm dev

# 2. 檢查 GraphQL endpoint 可用性
curl -X POST https://ly-budget-gql-dev-1075249966777.asia-east1.run.app/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# 3. 確認 codegen 配置正確
cat codegen.ts | grep "schema:"

# 4. 檢查現有 query patterns
cat app/queries/budget.queries.ts

# 5. TypeScript compilation
pnpm typecheck
```

### Post-Implementation Validation

```bash
# 1. 建立新檔案後，執行 GraphQL code generation
pnpm codegen
# 預期輸出：✔ Parse Configuration
#          ✔ Generate outputs

# 2. TypeScript type checking (必須通過)
pnpm typecheck
# 預期：No errors

# 3. 建置驗證 (必須成功)
pnpm build
# 預期：Build successful

# 4. Linting check
pnpm lint:check
# 預期：No linting errors

# 5. 格式化檢查
pnpm format:check
# 預期：All files formatted correctly
```

### React Query DevTools Verification

在開發環境中使用 React Query DevTools 檢查：

1. 開啟瀏覽器的 React Query DevTools（已在 root.tsx 中配置）
2. 找到 `['proposals', 'list']` query
3. 檢查：
   - ✅ Query status: success
   - ✅ Data structure 符合預期
   - ✅ Fetch time 合理（< 2 秒）
   - ✅ Cache 正確運作

## External Resources & Documentation

### TanStack React Query v5

- **Official Docs**: https://tanstack.com/query/v5/docs/react/overview
- **Query Keys Guide**: https://tanstack.com/query/v5/docs/react/guides/query-keys
- **TypeScript Guide**: https://tanstack.com/query/v5/docs/react/typescript
- **Best Practices**: https://tkdodo.eu/blog/effective-react-query-keys

### GraphQL Code Generation

- **Client Preset**: https://the-guild.dev/graphql/codegen/docs/guides/react-vue
- **TypedDocumentNode**: https://the-guild.dev/graphql/codegen/plugins/typescript/typed-document-node
- **Configuration**: https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config

### Keystone GraphQL Schema

Keystone CMS 使用 Prisma-like schema，理解其 query patterns 有助於撰寫有效的 queries：
- **Query API**: https://keystonejs.com/docs/graphql/overview
- **Filtering**: https://keystonejs.com/docs/guides/filters
- **Sorting**: https://keystonejs.com/docs/graphql/sorting

### TypeScript Best Practices

- **Avoiding `any`**: 本專案嚴格禁止使用 `any`
- **Generated Types**: 全部使用 codegen 產生的 types
- **Nullable Types**: 適當處理 `Maybe<T>` types

## Expected Deliverables

### 1. New File: `app/queries/proposal.queries.ts`

- ✅ Export `GET_PROPOSALS_QUERY` with proper GraphQL query
- ✅ Export `proposalQueryKeys` factory object
- ✅ Include JSDoc comments for documentation
- ✅ Include usage example in comments
- ✅ Follow existing code style and patterns

### 2. Modified File: `app/queries/index.ts`

- ✅ Add export for `GET_PROPOSALS_QUERY` and `proposalQueryKeys`
- ✅ Maintain alphabetical or logical ordering

### 3. Generated Files (by codegen)

- ✅ Updated `app/graphql/graphql.ts` with new query types
- ✅ Updated `app/graphql/gql.ts` with query lookup
- ✅ Updated `schema.graphql` if schema changed

### 4. No Component Files

- ❌ **不要**建立任何 component 檔案
- ❌ **不要**建立任何 page/route 檔案（除了臨時測試檔案）
- ✅ 這是純資料層的實作

## Implementation Sequence & Time Estimates

### Task 1: Create Proposal Query Definition (15 min)

1. 建立 `app/queries/proposal.queries.ts`
2. 定義 `GET_PROPOSALS_QUERY` with selected fields
3. 定義 `proposalQueryKeys` factory
4. 加入 JSDoc 和 usage example comments

### Task 2: Update Queries Index (2 min)

1. 修改 `app/queries/index.ts`
2. Export 新的 queries 和 keys

### Task 3: Run Code Generation (5 min)

1. 執行 `pnpm codegen`
2. 檢查生成的 types
3. 確認沒有錯誤

### Task 4: Type Checking & Validation (10 min)

1. 執行 `pnpm typecheck`
2. 執行 `pnpm lint:check`
3. 執行 `pnpm format:check`
4. 修正任何發現的問題

### Task 5: Functional Testing (15 min)

1. 建立臨時測試 route
2. 測試 query 是否正常運作
3. 檢查資料排序和結構
4. 使用 React Query DevTools 驗證
5. 刪除測試檔案

### Task 6: Documentation Review (3 min)

1. 檢查所有註解是否清晰
2. 確認 usage example 正確
3. 確認遵循現有 patterns

**Total Estimated Time**: ~50 minutes for complete implementation and testing

## Success Criteria

- ✅ `GET_PROPOSALS_QUERY` 正確定義並返回預期的資料結構
- ✅ Proposals 按 ID 降序排列（最新的在前）
- ✅ `proposalQueryKeys` factory 遵循現有 pattern
- ✅ TypeScript compilation 通過無錯誤
- ✅ GraphQL code generation 成功執行
- ✅ 生成的 types 完全 type-safe
- ✅ Linting 和 formatting 檢查通過
- ✅ 可以在元件中正常使用 `useQuery` hook
- ✅ React Query DevTools 顯示正確的 cache 和 data
- ✅ 沒有建立任何 component 檔案（純資料層）
- ✅ 符合專案的 code style 和 conventions
- ✅ Documentation 完整且清晰

## Risk Mitigation

### Potential Issues & Solutions

1. **GraphQL Schema 變更**
   - 風險：Remote schema 可能與本地 schema.graphql 不同
   - 解決：執行 `pnpm codegen` 更新 schema
   - 機率：低（schema 通常穩定）

2. **欄位不存在**
   - 風險：選擇的欄位在 schema 中不存在
   - 解決：仔細對照 schema.graphql (lines 717-851)
   - 機率：極低（已經驗證所有欄位）

3. **Type Generation 失敗**
   - 風險：Codegen 可能因為 syntax error 失敗
   - 解決：使用 GraphQL 標準 syntax，參考現有 queries
   - 機率：低（遵循現有 patterns）

4. **效能問題**
   - 風險：Query 返回過多資料
   - 解決：限制選擇的欄位，不包含巢狀 lists
   - 機率：低（已經優化欄位選擇）

5. **Endpoint 連線失敗**
   - 風險：無法連接到 GraphQL endpoint
   - 解決：確認 endpoint URL 正確，檢查網路連線
   - 機率：低（現有 queries 都正常）

## Additional Notes

### 關於不破壞現有功能

- ✅ 只新增檔案，不修改現有 query logic
- ✅ 不修改 `execute` function
- ✅ 不修改 `endpoints.ts`
- ✅ 不修改任何 component 檔案
- ✅ 新增的 exports 不會與現有的衝突

### 關於復用性

- ✅ Query keys factory 支援未來的 filtering 和 pagination
- ✅ Query 結構支援未來加入 variables
- ✅ 可以輕鬆建立 variants（例如 GET_PROPOSAL_BY_ID_QUERY）
- ✅ Type safety 確保所有使用都是正確的

### 未來擴充建議

如果未來需要更複雜的功能，可以考慮：

1. **分頁支援**：
```typescript
export const GET_PROPOSALS_PAGINATED_QUERY = graphql(`
  query GetProposalsPaginated($take: Int, $skip: Int) {
    proposals(orderBy: [{ id: desc }], take: $take, skip: $skip) {
      # ... fields
    }
  }
`);
```

2. **篩選支援**：
```typescript
export const GET_PROPOSALS_FILTERED_QUERY = graphql(`
  query GetProposalsFiltered($where: ProposalWhereInput) {
    proposals(orderBy: [{ id: desc }], where: $where) {
      # ... fields
    }
  }
`);
```

3. **詳細資料 Query**：
```typescript
export const GET_PROPOSAL_DETAIL_QUERY = graphql(`
  query GetProposalDetail($id: ID!) {
    proposal(where: { id: $id }) {
      # ... all fields including nested lists
      historicalProposals {
        # ...
      }
      meetings {
        # ...
      }
    }
  }
`);
```

## Confidence Score: 9.5/10

此 PRP 提供了全面的 context，包括：

- ✅ 詳細的 codebase 分析和現有 patterns
- ✅ 完整的 GraphQL schema 研究
- ✅ 可執行的 validation gates
- ✅ 清晰的實作步驟和時間估算
- ✅ Type-safe 的實作策略
- ✅ 識別並解決潛在問題（endpoint URL）
- ✅ 完整的外部資源連結
- ✅ 符合專案規範（不使用 any、使用繁體中文註解等）

唯一的小風險是 remote schema 可能與本地不完全一致，但透過 codegen 可以立即發現並修正。建議在實作前先執行一次 `pnpm codegen` 確保 schema 是最新的。

