# PRP: 實作依立委篩選提案功能（Sort by People / Legislator Filter）

## 概述

在 `/all-budgets` 頁面的 `BudgetsSelector` 元件中實作「依立委分類」功能。透過下拉選單選擇特定立法委員，過濾並顯示該立委所提案的提案資料。此功能將整合 GraphQL、React Query 與 Zustand，並維持現有的分頁與排序功能。

## 背景與研究發現

### 當前 Codebase 狀態

- **框架**: React Router v7 (SPA mode)
- **資料獲取**: React Query v5.86.0 + GraphQL with typed document nodes
- **狀態管理**: Zustand v5.0.8 (全域/跨元件狀態)
- **UI 元件**: react-select v5.10.2
- **TypeScript**: v5.8.3 with full type safety
- **樣式**: TailwindCSS v4

### GraphQL Schema 分析

#### People Type 結構

**檔案**: `schema.graphql` (行 652-661)

```graphql
type People {
  committees(cursor: CommitteeWhereUniqueInput, orderBy: [CommitteeOrderByInput!]! = [], skip: Int! = 0, take: Int, where: CommitteeWhereInput! = {}): [Committee!]
  committeesCount(where: CommitteeWhereInput! = {}): Int
  description: String
  id: ID!
  name: String
  party: People      # ← 指向另一個 People 對象（政黨）
  term: Term
  type: String
}
```

**重要特徵**:
- `party` 欄位是自我參照的，指向另一個 `People` 對象來表示政黨
- `name` 是立委姓名
- `type` 可用於區分立委、政黨等類型

#### PeopleList Query

**檔案**: `schema.graphql` (行 914-916)

```graphql
peopleList(
  cursor: PeopleWhereUniqueInput, 
  orderBy: [PeopleOrderByInput!]! = [], 
  skip: Int! = 0, 
  take: Int, 
  where: PeopleWhereInput! = {}
): [People!]
peopleListCount(where: PeopleWhereInput! = {}): Int
```

#### PeopleWhereInput 過濾條件

**檔案**: `schema.graphql` (行 722-733)

```graphql
input PeopleWhereInput {
  AND: [PeopleWhereInput!]
  NOT: [PeopleWhereInput!]
  OR: [PeopleWhereInput!]
  committees: CommitteeManyRelationFilter
  description: StringFilter
  id: IDFilter
  name: StringFilter
  party: PeopleWhereInput
  term: TermWhereInput
  type: StringFilter    # ← 可用於篩選立委類型
}
```

#### Proposals 與 Proposers 關聯

**檔案**: `schema.graphql` (行 755-756, 881)

```graphql
type Proposal {
  # ...
  proposers(cursor: PeopleWhereUniqueInput, orderBy: [PeopleOrderByInput!]! = [], skip: Int! = 0, take: Int, where: PeopleWhereInput! = {}): [People!]
  proposersCount(where: PeopleWhereInput! = {}): Int
  # ...
}

input ProposalWhereInput {
  # ...
  proposers: PeopleManyRelationFilter  # ← 關鍵：支援依提案人過濾
  # ...
}
```

#### PeopleManyRelationFilter

**檔案**: `schema.graphql` (行 672-676)

```graphql
input PeopleManyRelationFilter {
  every: PeopleWhereInput
  none: PeopleWhereInput
  some: PeopleWhereInput    # ← 使用此欄位來過濾「至少有一個提案人符合條件」
}
```

**重要發現**:
- ✅ `ProposalWhereInput` 有 `proposers: PeopleManyRelationFilter` 欄位
- ✅ 可以使用 `some` 來過濾有特定提案人的提案
- ✅ 支援巢狀過濾（如 `where: { proposers: { some: { id: { equals: "person-id" } } } }`）

### 現有實作參考

#### 依部會分類的實作模式

**檔案**: `app/components/budgets-selector.tsx` (行 59-180)

`ByDepartmentSelector` 元件展示了如何：
1. 使用 `useQuery` 獲取選項資料（governments）
2. 從 `budget-selector` store 讀取篩選狀態
3. 使用 `react-select` 顯示下拉選單
4. 支援兩階段篩選（category → department）

**關鍵模式**:
```typescript
const { data: governmentsData, isLoading } = useQuery({
  queryKey: governmentQueryKeys.lists(),
  queryFn: () => execute(GET_GOVERNMENTS_QUERY),
  enabled: value === "by-department", // 只在選中時 fetch
});

const departmentFilter = useStore(
  useBudgetSelectStore,
  (state) => state.departmentFilter
);
const setDepartmentId = useStore(
  useBudgetSelectStore,
  (state) => state.setDepartmentId
);
```

#### Budget Selector Store 結構

**檔案**: `app/stores/budget-selector.tsx`

```typescript
type DepartmentFilter = {
  category: string | null;
  departmentId: string | null;
};

type BudgetSelectProps = {
  selectedValue: string;      // "all" | "by-department" | "by-legislator"
  searchedValue: string;
  visible: boolean;
  selectedSort: string;
  departmentFilter: DepartmentFilter;
};

type BudgetSelectState = BudgetSelectProps & {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
};
```

**擴充策略**: 新增 `peopleFilter` 狀態與相關 actions

#### All-Budgets 頁面整合

**檔案**: `app/all-budgets/index.tsx` (行 63-90)

```typescript
const whereFilter = useMemo((): ProposalWhereInput => {
  if (departmentId) {
    return {
      government: {
        id: { equals: departmentId },
      },
    };
  }
  return {};
}, [departmentId]);

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
  placeholderData: keepPreviousData,
});
```

**關鍵發現**: 
- 已有 `whereFilter` 邏輯處理 department 過濾
- 需要擴充以支援 people 過濾
- 使用 `useMemo` 計算過濾條件
- 當過濾條件改變時，會透過 `useEffect` 重置到第 1 頁（行 100-102）

### TypeScript Types 參考

**檔案**: `app/graphql/graphql.ts` (行 1021-1031, 1106-1117)

```typescript
export type People = {
  __typename?: 'People';
  committees?: Maybe<Array<Committee>>;
  committeesCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  party?: Maybe<People>;
  term?: Maybe<Term>;
  type?: Maybe<Scalars['String']['output']>;
};

export type PeopleWhereInput = {
  AND?: InputMaybe<Array<PeopleWhereInput>>;
  NOT?: InputMaybe<Array<PeopleWhereInput>>;
  OR?: InputMaybe<Array<PeopleWhereInput>>;
  committees?: InputMaybe<CommitteeManyRelationFilter>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
  party?: InputMaybe<PeopleWhereInput>;
  term?: InputMaybe<TermWhereInput>;
  type?: InputMaybe<StringFilter>;
};
```

## 實作計畫

### 階段一：建立 GraphQL Query

**檔案**: `app/queries/budget.queries.ts` (新增到檔案末尾)

建立查詢以獲取所有立委清單，包含政黨資訊。

```typescript
/**
 * GraphQL query to get all people (legislators) with party info
 */
export const GET_PEOPLE_LIST_QUERY = graphql(`
  query GetPeopleList {
    peopleList(orderBy: [{ name: asc }]) {
      id
      name
      type
      description
      party {
        id
        name
        type
      }
    }
  }
`);

/**
 * React Query keys for people-related queries
 */
export const peopleQueryKeys = {
  all: ["people"] as const,
  lists: () => [...peopleQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...peopleQueryKeys.lists(), { filters }] as const,
} as const;
```

**匯出更新**: 在 `app/queries/index.ts` 中新增匯出

```typescript
export {
  GET_PEOPLE_LIST_QUERY,
  peopleQueryKeys,
} from "./budget.queries";
```

### 階段二：擴充 Budget Selector Store

**檔案**: `app/stores/budget-selector.tsx`

新增 `peopleFilter` 狀態來儲存選中的立委 ID。

**Step 2.1**: 新增 Type 定義

```typescript
// 在現有 DepartmentFilter 下方新增
type PeopleFilter = {
  personId: string | null;
};
```

**Step 2.2**: 更新 `BudgetSelectProps`

```typescript
type BudgetSelectProps = {
  selectedValue: string;
  searchedValue: string;
  visible: boolean;
  selectedSort: string;
  departmentFilter: DepartmentFilter;
  peopleFilter: PeopleFilter;  // ← 新增
};
```

**Step 2.3**: 更新 `BudgetSelectState`

```typescript
type BudgetSelectState = BudgetSelectProps & {
  setSearchedValue: (value: string) => void;
  setSelectedValue: (value: string) => void;
  toggleVisible: () => void;
  setSelectedSort: (value: string) => void;
  resetToDefault: () => void;
  setDepartmentCategory: (category: string | null) => void;
  setDepartmentId: (id: string | null) => void;
  clearDepartmentFilter: () => void;
  // ← 新增 people filter actions
  setPersonId: (id: string | null) => void;
  clearPeopleFilter: () => void;
};
```

**Step 2.4**: 更新 `DEFAULT_PROPS`

```typescript
const DEFAULT_PROPS: BudgetSelectProps = {
  selectedValue: "all",
  searchedValue: "",
  visible: true,
  selectedSort: "id-asc",
  departmentFilter: { category: null, departmentId: null },
  peopleFilter: { personId: null },  // ← 新增
};
```

**Step 2.5**: 實作 Actions

在 `createBudgetSelectStore` 的 return statement 中新增：

```typescript
setPersonId: (id: string | null) =>
  set((state) => ({
    ...state,
    peopleFilter: {
      personId: id,
    },
  })),

clearPeopleFilter: () =>
  set((state) => ({
    ...state,
    peopleFilter: {
      personId: null,
    },
  })),
```

### 階段三：建立 ByPeopleSelector 元件

**檔案**: `app/components/budgets-selector.tsx`

在 `ByDepartmentSelector` 元件之後、`ByLegislatorSelector` 元件之前新增。

**Step 3.1**: 移除或更新現有的 `ByLegislatorSelector`

現有的 `ByLegislatorSelector`（行 181-201）是一個 placeholder，需要替換成實際功能。

**Step 3.2**: 實作完整的 `ByPeopleSelector` 元件

```typescript
const ByPeopleSelector = ({ value }: { value: string }) => {
  // 從 store 取得狀態與 actions
  const personId = useStore(
    useBudgetSelectStore,
    (state) => state.peopleFilter.personId
  );
  const setPersonId = useStore(
    useBudgetSelectStore,
    (state) => state.setPersonId
  );

  // Fetch people list data
  const { data: peopleData, isLoading } = useQuery({
    queryKey: peopleQueryKeys.lists(),
    queryFn: () => execute(GET_PEOPLE_LIST_QUERY),
    enabled: value === "by-legislator", // 只在選中時 fetch
  });

  // 計算選項清單（只顯示立委，不包含政黨）
  const peopleOptions = useMemo(() => {
    if (!peopleData?.peopleList) return [];

    // 過濾出立委（假設 type !== "政黨" 或類似邏輯）
    // 如果需要更精確的過濾，可能需要根據實際資料調整
    return peopleData.peopleList
      .filter((person) => person.name) // 確保有名字
      .map((person) => ({
        value: person.id,
        label: person.name || "未命名",
        party: person.party?.name || null, // 保留政黨資訊以便顯示
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [peopleData?.peopleList]);

  // 當前選擇的值（用於 react-select）
  const selectedPersonValue = useMemo(() => {
    if (!personId || !peopleData?.peopleList) {
      return null;
    }
    const person = peopleData.peopleList.find((p) => p.id === personId);
    return person ? { value: person.id, label: person.name || "未命名" } : null;
  }, [personId, peopleData?.peopleList]);

  if (value !== "by-legislator") return null;

  return (
    <div className="flex flex-col gap-y-3">
      <Select
        value={selectedPersonValue}
        onChange={(opt) => {
          const singleValue = opt as SingleValue<OptionType>;
          setPersonId(singleValue?.value || null);
        }}
        options={peopleOptions}
        components={{ DropdownIndicator }}
        className="md:w-96"
        styles={{
          control: (styles) => ({ ...styles, border: "2px solid black" }),
          indicatorSeparator: (styles) => ({ ...styles, display: "none" }),
        }}
        placeholder={isLoading ? "載入中..." : "選擇立法委員"}
        isLoading={isLoading}
        isClearable
        aria-label="選擇立法委員"
      />
    </div>
  );
};
```

**Step 3.3**: 更新 `BudgetsSelector` 主元件中的條件渲染

找到行 263-268，將原本的硬編碼 `ByLegislatorSelector` 替換：

```typescript
{selectedValue === option.value && (
  <ByDepartmentSelector value={option.value} />
)}
{selectedValue === option.value && (
  <ByPeopleSelector value={option.value} />  {/* ← 使用新元件 */}
)}
```

**Step 3.4**: 新增必要的 imports

在檔案頂部新增：

```typescript
import { GET_PEOPLE_LIST_QUERY, peopleQueryKeys } from "~/queries";
```

### 階段四：整合過濾邏輯到 All-Budgets 頁面

**檔案**: `app/all-budgets/index.tsx`

**Step 4.1**: 從 store 讀取 peopleFilter

在行 37-40 的 `departmentId` 下方新增：

```typescript
const personId = useStore(
  useBudgetSelectStore,
  (s) => s.peopleFilter.personId
);
```

**Step 4.2**: 更新 `whereFilter` 邏輯

修改行 63-72 的 `whereFilter` useMemo：

```typescript
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

**重要**: 如果未來需要支援同時過濾 department 和 legislator，此邏輯已經支援（兩個條件會同時套用 AND 邏輯）。

**Step 4.3**: 更新重置邏輯

修改行 100-102 的 `useEffect`，加入 `personId` 依賴：

```typescript
// 排序或篩選變更時重置到第 1 頁
useEffect(() => {
  setPage(1);
}, [selectedSort, departmentId, personId, setPage]);
```

### 階段五：清理與優化

**Step 5.1**: 確保狀態清除邏輯

當使用者切換回 "all" 時，應清除所有過濾器。

在 `app/components/budgets-selector.tsx` 的 `handleSelectionChange` 函式（行 229-234）中，考慮新增清理邏輯：

```typescript
const handleSelectionChange = (value: string) => {
  setSelectedValue(value);
  
  // 切換選項時清除相關過濾器
  if (value !== "by-department") {
    clearDepartmentFilter();
  }
  if (value !== "by-legislator") {
    clearPeopleFilter();
  }
  
  if (onSelectionChange) {
    onSelectionChange(value);
  }
};
```

需要先從 store 取得 `clearDepartmentFilter` 和 `clearPeopleFilter`：

```typescript
const clearDepartmentFilter = useStore(
  useBudgetSelectStore,
  (state) => state.clearDepartmentFilter
);
const clearPeopleFilter = useStore(
  useBudgetSelectStore,
  (state) => state.clearPeopleFilter
);
```

**Step 5.2**: 型別檢查

確認所有新增的 TypeScript 類型都已正確匯入和使用。特別檢查：
- `PeopleFilter` type
- `ProposalWhereInput` 中的 `proposers` 欄位
- GraphQL generated types 中的 `People` type

## 驗證與測試策略

### 編譯驗證

```bash
# 型別檢查
npx tsc --noEmit

# Linting
npx eslint app/
```

### 功能驗證清單

手動測試以下情境：

1. **基本功能**
   - [ ] 在 `/all-budgets` 頁面選擇「依立委分類」
   - [ ] 下拉選單正確顯示所有立委清單（按姓名排序）
   - [ ] 選擇一位立委後，表格只顯示該立委提案的項目

2. **與現有功能整合**
   - [ ] 選擇立委後，排序功能仍然正常運作
   - [ ] 選擇立委後，分頁功能正常運作
   - [ ] 切換回「全部」時，過濾被正確清除
   - [ ] 與「依部會分類」不衝突（可獨立運作）

3. **邊界情況**
   - [ ] 選擇的立委沒有任何提案時，顯示空清單（不崩潰）
   - [ ] 清除選擇（使用 `isClearable`）後，顯示所有提案
   - [ ] 快速切換不同立委時，資料正確更新
   - [ ] 資料載入中時，顯示載入狀態

4. **效能**
   - [ ] 只有在選擇「依立委分類」時才發起 `peopleList` 查詢
   - [ ] 切換到其他分類方式時，不重複查詢

5. **UI/UX**
   - [ ] 下拉選單樣式與「依部會分類」一致
   - [ ] 載入狀態有適當提示
   - [ ] 清除按鈕（x）正常運作
   - [ ] 在手機版和桌面版都正常顯示

### GraphQL Query 測試

可以先在 GraphQL Playground 或類似工具測試查詢：

```graphql
# 測試 1: 取得所有立委清單
query GetPeopleList {
  peopleList(orderBy: [{ name: asc }]) {
    id
    name
    type
    description
    party {
      id
      name
      type
    }
  }
}

# 測試 2: 過濾特定立委的提案
query GetProposalsByPerson($personId: ID!) {
  proposals(
    where: {
      proposers: {
        some: {
          id: { equals: $personId }
        }
      }
    }
    take: 10
  ) {
    id
    description
    proposers {
      id
      name
    }
  }
}
```

## 潛在問題與解決方案

### 問題 1: People Type 資料結構不清楚

**問題**: `type` 欄位可能包含「立委」、「政黨」等不同類型，但不清楚具體值。

**解決方案**:
1. 先不進行 type 過濾，顯示所有 `peopleList` 的項目
2. 如果發現包含政黨，可以透過 `where` 參數過濾（如 `where: { type: { not: { equals: "政黨" } } }`）
3. 或透過前端 `filter` 移除不需要的項目

### 問題 2: 政黨資訊顯示

**問題**: 是否需要在下拉選單中顯示立委的政黨？

**解決方案**: 
- 目前實作只顯示立委姓名
- 如果需要顯示政黨，可以修改 `label` 為：`${person.name} (${person.party?.name})`
- 或使用 `react-select` 的 `formatOptionLabel` 自訂選項顯示

### 問題 3: 效能考量

**問題**: 如果立委清單很長（例如 100+ 人），下拉選單可能會卡頓。

**解決方案**:
- `react-select` 內建虛擬滾動，應可處理數百個選項
- 如果仍有效能問題，可以考慮：
  - 新增搜尋功能（`react-select` 已內建）
  - 使用 `react-window` 或 `react-virtual` 優化渲染

### 問題 4: 清除過濾器的時機

**問題**: 使用者切換分類方式時，是否應該保留之前的過濾設定？

**解決方案**: 
- 目前實作會在切換時清除對應的過濾器（Step 5.1）
- 這樣可以避免混淆（例如同時選了部會和立委）
- 如果需求是保留設定，可以移除清除邏輯

## 參考資料

### 官方文件

- **React Query**: https://tanstack.com/query/latest/docs/framework/react/overview
  - Query Keys: https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
  - Dependent Queries: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries
  
- **Zustand**: https://zustand-demo.pmnd.rs/
  - Best Practices: https://tkdodo.eu/blog/working-with-zustand
  
- **react-select**: https://react-select.com/home
  - Props: https://react-select.com/props
  - Styles: https://react-select.com/styles

### Codebase 參考範例

- **依部會分類實作**: `app/components/budgets-selector.tsx` (行 59-180)
- **Zustand Store 模式**: `app/stores/budget-selector.tsx`
- **GraphQL Query 範例**: `app/queries/budget.queries.ts`
- **All-Budgets 過濾整合**: `app/all-budgets/index.tsx` (行 63-90)

## 實作任務清單

按照以下順序執行：

- [ ] **Task 1**: 建立 GraphQL query (`GET_PEOPLE_LIST_QUERY`) 並新增到 `app/queries/budget.queries.ts`
- [ ] **Task 2**: 在 `app/queries/index.ts` 中匯出新的 query 和 query keys
- [ ] **Task 3**: 擴充 `app/stores/budget-selector.tsx`，新增 `peopleFilter` 狀態與 actions
- [ ] **Task 4**: 在 `app/components/budgets-selector.tsx` 中實作 `ByPeopleSelector` 元件
- [ ] **Task 5**: 更新 `app/components/budgets-selector.tsx` 中的條件渲染邏輯
- [ ] **Task 6**: 在 `app/all-budgets/index.tsx` 中讀取 `personId` 狀態
- [ ] **Task 7**: 更新 `app/all-budgets/index.tsx` 中的 `whereFilter` 邏輯以支援 people 過濾
- [ ] **Task 8**: 更新 `app/all-budgets/index.tsx` 中的重置邏輯（useEffect 依賴）
- [ ] **Task 9**: 實作清除過濾器的邏輯（切換分類時）
- [ ] **Task 10**: 執行型別檢查與 linting
- [ ] **Task 11**: 執行功能驗證清單中的所有測試項目

## 成功標準

✅ 此 PRP 實作成功的標準：

1. **功能完整性**
   - 使用者可以選擇任一立委來過濾提案
   - 過濾結果正確（只顯示該立委提案的項目）
   - 清除選擇後恢復顯示所有提案

2. **整合性**
   - 與現有排序功能無縫整合
   - 與現有分頁功能無縫整合
   - 不破壞「依部會分類」功能

3. **程式碼品質**
   - 通過 TypeScript 編譯（無型別錯誤）
   - 通過 ESLint 檢查
   - 遵循專案的 Zustand 與 React Query 模式

4. **使用者體驗**
   - 載入狀態有適當提示
   - 下拉選單操作流暢
   - 樣式與現有元件一致

## PRP 品質評分

**信心指數**: 8.5/10

**理由**:
- ✅ GraphQL schema 支援所需的查詢與過濾
- ✅ 有完整的參考範例（`ByDepartmentSelector`）可依循
- ✅ 專案架構清晰，擴充點明確
- ✅ 提供詳細的實作步驟與程式碼範例
- ⚠️  不確定 `People.type` 欄位的實際值，可能需要調整過濾邏輯
- ⚠️  未實際執行測試，可能存在未預見的邊界情況

**預期一次性實作成功機率**: 高（85%）

**潛在需要調整的部分**:
1. `People` 資料的 `type` 欄位過濾邏輯（如果需要區分立委與政黨）
2. 下拉選單的顯示格式（是否顯示政黨資訊）
3. 效能優化（如果立委清單非常長）

---

**注意事項**:
- 本 PRP 假設不需要同時支援「依部會」和「依立委」雙重過濾。如果需要，`whereFilter` 邏輯已經支援（兩個條件會以 AND 方式結合）。
- 實作時請確保不破壞現有的「依部會分類」功能。
- 如果在實作過程中發現 GraphQL schema 與文件不符，請先測試實際的 API 響應。

