# PRP: 使用 GraphQL 整合視覺化頁面資料（Visualization Data Integration）

## 概述

在 `/visualization` 頁面移除 mock data，改用 GraphQL + React Query + Zustand 獲取真實資料。將 Proposals 資料聚合並轉換為 D3 Circle Pack Chart 所需的 `NodeDatum` 格式，實作依立委和依部會兩種視覺化模式，並計算統計資料（刪減金額、凍結金額、提案數量）。

## 背景與研究發現

### 當前 Codebase 狀態

- **框架**: React Router v7 (SPA mode)
- **資料獲取**: React Query v5.86.0 + GraphQL with typed document nodes
- **狀態管理**: Zustand v5.0.8 (全域/跨元件狀態)
- **視覺化**: D3.js v7.9.0 (Circle Pack Chart)
- **TypeScript**: v5.8.3 with full type safety
- **樣式**: TailwindCSS v4

### 當前視覺化頁面架構

#### 現有 Mock Data 結構

**檔案**: `app/visualization/circle-pack-chart.tsx` (行 6-48)

```typescript
type NodeDatum = {
  name: string;
  value?: number;
  color?: string;
  id?: string;
  isFrozen?: boolean;
  children?: NodeDatum[];
};

const FAKE_DATA: NodeDatum = {
  name: "root",
  children: [
    {
      name: "徐巧芯\n中國國民黨\n999999萬",
      value: 999999,
      color: "#6B7FFF",
      isFrozen: true,
      id: "1-14-1-05-024-7990",
    },
    // ... more children
  ],
};
```

**問題點**:
- 使用硬編碼的 FAKE_DATA
- 沒有從 GraphQL 獲取資料
- 統計資料為假資料
- 無法根據年度、模式篩選

#### 視覺化頁面狀態

**檔案**: `app/visualization/index.tsx` (行 19-23)

```typescript
const Visualization = () => {
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(yearOptions);
  // ...
}
```

**UI 控制項**:
- ✅ Tab: `legislator` (依立委) / `department` (依部會)
- ✅ Mode: `amount` (依金額) / `count` (依數量)
- ✅ Year selector: `2025`, `2024`
- ⚠️ 目前狀態僅存在元件內部，未使用 Zustand

#### 統計資料顯示

**檔案**: `app/visualization/index.tsx` (行 87-101)

```typescript
<div>
  <p>總共刪減 <span>28,470,404</span>元（<span>32</span>個提案）</p>
  <p>凍結 <span>28,470</span>元（<span>134</span>個提案）</p>
  <p>主決議提案數： <span>32</span>個</p>
</div>
```

**需求統計資料**:
1. 總刪減金額 (`reductionAmount` 總和)
2. 總凍結金額 (`freezeAmount` 總和)
3. 各類型提案數量（刪減案、凍結案、主決議案）

### GraphQL Schema 分析

#### Proposal Type 結構

**檔案**: `schema.graphql` (行 738-762)

```graphql
type Proposal {
  id: ID!
  description: String
  reason: String
  freezeAmount: Int           # ← 凍結金額
  reductionAmount: Int        # ← 刪減金額
  proposalTypes: String       # ← 提案類型（可能包含逗號分隔的多類型）
  government: Government      # ← 所屬機關
  budget: Budget
  proposers: [People!]        # ← 提案人（可能多位）
  coSigners: [People!]        # ← 連署人
  # ... 其他欄位
}
```

#### People Type 結構

**檔案**: `schema.graphql` (行 652-661)

```graphql
type People {
  id: ID!
  name: String
  party: People     # ← 注意：party 是指向另一個 People 的關聯（可能是 Party entity）
  type: String
  description: String
  # ...
}
```

**重要發現**: 
- ✅ `party` 欄位存在但結構為 `People` type（應該是 party name 存在 party.name）
- ⚠️ 需要透過 `proposers.party.name` 取得政黨名稱
- ⚠️ 需要透過 `proposers.party.type` 可能取得政黨類型（用於顏色）

#### Proposals Query

**檔案**: `schema.graphql` (行 918-919)

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

#### ProposalWhereInput 過濾條件

**檔案**: `schema.graphql` (行 867-893)

```graphql
input ProposalWhereInput {
  AND: [ProposalWhereInput!]
  OR: [ProposalWhereInput!]
  NOT: [ProposalWhereInput!]
  budget: BudgetWhereInput
  government: GovernmentWhereInput
  proposers: PeopleManyRelationFilter
  # ... 其他欄位
}
```

**過濾需求**:
- 年度過濾: `budget.year.equals: 2025`
- 機關過濾: `government.id.equals: "xxx"` (依部會模式)
- 提案人過濾: `proposers.some.id.equals: "xxx"` (依立委模式)

### 現有 Query 模式參考

#### Proposal Queries

**檔案**: `app/queries/proposal.queries.ts` (行 37-81)

```typescript
export const GET_PROPOSALS_QUERY = graphql(`
  query GetProposalsOrderedByIdDesc {
    proposals(orderBy: [{ id: desc }]) {
      id
      description
      reason
      freezeAmount
      reductionAmount
      proposalTypes
      government { id name category }
      budget { id projectName budgetAmount year }
      proposers { id name type description }
      coSigners { id name type }
    }
    proposalsCount
  }
`)
```

**關鍵發現**: 
- ✅ 已有完整的 proposals query 結構
- ✅ 包含必要的 `freezeAmount`, `reductionAmount`, `proposalTypes`
- ⚠️ 未包含 `proposers.party` 資訊
- ⚠️ 未包含 `budget.year` 過濾參數

#### Query Keys Pattern

**檔案**: `app/queries/proposal.queries.ts` (行 185-206)

```typescript
export const proposalQueryKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [
    ...proposalQueryKeys.lists(),
    { filters },
  ],
  paginated: (page: number, pageSize: number, sortBy: string, where?: Record<string, unknown>) =>
    [...proposalQueryKeys.lists(), "paginated", { page, pageSize, sortBy, where }] as const,
  details: () => [...proposalQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalQueryKeys.details(), id] as const,
} as const
```

### 現有 Zustand Store 模式

#### 全域 UI Store 範例

**檔案**: `app/stores/uiStore.ts` (行 52-165)

```typescript
export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      headerState: { isShareModalOpen: false },
      progressState: { currentStep: 0, isComplete: false },
      actions: {
        toggleShareModal: () => set(..., undefined, 'toggleShareModal'),
        // ...
      },
    }),
    { name: "ui-store", enabled: process.env.NODE_ENV === "development" }
  )
);

export const useHeaderState = () => useUIStore((s) => s.headerState);
export const useUIActions = () => useUIStore((s) => s.actions);
```

**模式總結**:
- 使用 `devtools` middleware（開發模式啟用）
- Actions 分離到 `actions` 命名空間
- 提供 selector hooks 避免不必要的重渲染
- 使用第三個參數命名 actions（DevTools 顯示）

### 資料聚合邏輯

#### 依立委聚合 (Legislator Mode)

**需求**: 將每位立委的所有提案聚合成一個節點

```typescript
// 偽代碼
proposalsByLegislator = proposals.reduce((acc, proposal) => {
  proposal.proposers.forEach(proposer => {
    if (!acc[proposer.id]) {
      acc[proposer.id] = {
        id: proposer.id,
        name: proposer.name,
        party: proposer.party?.name,
        proposals: []
      }
    }
    acc[proposer.id].proposals.push(proposal)
  })
  return acc
}, {})

// 轉換為 NodeDatum
nodeDatum = {
  name: "root",
  children: Object.values(proposalsByLegislator).map(legislator => ({
    name: `${legislator.name}\n${legislator.party}\n${calculateValue(legislator.proposals)}萬`,
    value: calculateValue(legislator.proposals),
    color: getPartyColor(legislator.party),
    id: legislator.id,
    isFrozen: hasFreeze(legislator.proposals)
  }))
}
```

**計算邏輯**:
- `amount` mode: `value = sum(reductionAmount + freezeAmount)`
- `count` mode: `value = proposals.length`
- `isFrozen`: 至少一個 proposal 的 `proposalTypes` 包含 "凍結"

#### 依部會聚合 (Department Mode)

**需求**: 
1. 頂層顯示「全部」
2. 每個機關 (government) 單獨顯示為一個 chart

```typescript
// 偽代碼
proposalsByDepartment = proposals.reduce((acc, proposal) => {
  const govId = proposal.government.id
  if (!acc[govId]) {
    acc[govId] = {
      id: govId,
      name: proposal.government.name,
      proposals: []
    }
  }
  acc[govId].proposals.push(proposal)
  return acc
}, {})
```

### 政黨顏色對應

**參考**: 台灣主要政黨顏色（需要建立映射表）

```typescript
const PARTY_COLORS: Record<string, string> = {
  "民主進步黨": "#1B9431",      // 綠色
  "中國國民黨": "#000095",      // 藍色
  "台灣民眾黨": "#28C7C1",      // 青色
  "時代力量": "#FFD700",        // 黃色
  "台灣基進": "#CD5C5C",        // 紅色
  "無黨籍": "#808080",          // 灰色
  // ... 更多政黨
}
```

### 效能考量

#### 資料快取策略

**React Query 設定**:
```typescript
const { data } = useQuery({
  queryKey: visualizationQueryKeys.list({ year, mode }),
  queryFn: () => execute(GET_VISUALIZATION_PROPOSALS_QUERY, { year }),
  staleTime: 5 * 60 * 1000,      // 5 分鐘內視為新鮮
  gcTime: 10 * 60 * 1000,        // 10 分鐘後清除快取
})
```

#### 資料轉換最佳化

```typescript
// 使用 useMemo 避免重複計算
const chartData = useMemo(() => {
  if (!data?.proposals) return null
  return aggregateProposals(data.proposals, { mode, activeTab })
}, [data?.proposals, mode, activeTab])
```

### 外部研究

#### D3 Circle Pack 資料格式

參考: https://d3js.org/d3-hierarchy/pack

**關鍵要求**:
- 必須有 `name` 和 `value` 欄位
- `children` 為可選的遞迴結構
- `value` 決定圓圈大小（自動由 D3 計算）

#### React Query 最佳實踐

參考: https://tanstack.com/query/latest/docs/framework/react/guides/queries

**重點**:
- 使用 hierarchical query keys
- 啟用 `staleTime` 減少重複請求
- 使用 `enabled` 選項控制查詢時機

## 實作計畫

### 階段 1: 建立 Zustand Store

**目標**: 集中管理視覺化頁面狀態

**檔案**: `app/stores/visualization.store.ts` (新建)

**實作步驟**:

1. 建立狀態型別定義
2. 建立 store 結構（包含 state 和 actions）
3. 提供 selector hooks
4. 啟用 devtools 中介層

**型別定義**:
```typescript
type VisualizationTab = "legislator" | "department"
type VisualizationMode = "amount" | "count"

type VisualizationState = {
  activeTab: VisualizationTab
  mode: VisualizationMode
  selectedYear: string
}

type VisualizationActions = {
  setActiveTab: (tab: VisualizationTab) => void
  setMode: (mode: VisualizationMode) => void
  setSelectedYear: (year: string) => void
  reset: () => void
}

type VisualizationStoreState = {
  state: VisualizationState
  actions: VisualizationActions
}
```

**驗證標準**:
- [x] Store 正確匯出
- [x] Selector hooks 可正常使用
- [x] DevTools 顯示正確的 action 名稱
- [x] 型別檢查通過

### 階段 2: 建立 GraphQL Query

**目標**: 定義視覺化資料查詢

**檔案**: `app/queries/visualization.queries.ts` (新建)

**實作步驟**:

1. 定義 `GET_VISUALIZATION_PROPOSALS_QUERY`
2. 包含必要欄位（含 `proposers.party`）
3. 定義 query keys 函式
4. 加入 JSDoc 說明使用範例

**Query 結構**:
```graphql
query GetVisualizationProposals($where: ProposalWhereInput!) {
  proposals(where: $where, orderBy: [{ id: desc }]) {
    id
    description
    freezeAmount
    reductionAmount
    proposalTypes
    government {
      id
      name
      category
    }
    budget {
      id
      year
    }
    proposers {
      id
      name
      type
      party {
        name
        type
      }
    }
  }
  proposalsCount(where: $where)
}
```

**Query Keys**:
```typescript
export const visualizationQueryKeys = {
  all: ['visualization'] as const,
  lists: () => [...visualizationQueryKeys.all, 'list'] as const,
  list: (filters: {
    year?: string
    tab?: string
    departmentId?: string
  }) => [...visualizationQueryKeys.lists(), { filters }] as const,
} as const
```

**驗證標準**:
- [x] Query 可正確執行
- [x] 回傳包含 `proposers.party.name`
- [x] Query keys 結構正確
- [x] TypeScript 型別自動產生

### 階段 3: 建立資料轉換函式

**目標**: 將 Proposals 轉換為 NodeDatum 格式

**檔案**: `app/visualization/helpers.ts` (新建)

**實作步驟**:

1. 定義政黨顏色映射表
2. 實作立委聚合函式 `aggregateByLegislator`
3. 實作部會聚合函式 `aggregateByDepartment`
4. 實作統計資料計算函式 `calculateStatistics`
5. 確保 immutable 轉換

**函式簽名**:
```typescript
import type { GetVisualizationProposalsQuery } from '~/graphql/graphql'

type Proposal = GetVisualizationProposalsQuery['proposals'][number]

export type NodeDatum = {
  name: string
  value?: number
  color?: string
  id?: string
  isFrozen?: boolean
  children?: NodeDatum[]
}

export type Statistics = {
  totalReduction: number
  totalFreeze: number
  reductionCount: number
  freezeCount: number
  mainResolutionCount: number
}

export function aggregateByLegislator(
  proposals: Proposal[],
  mode: 'amount' | 'count'
): NodeDatum

export function aggregateByDepartment(
  proposals: Proposal[],
  mode: 'amount' | 'count'
): NodeDatum[]

export function calculateStatistics(
  proposals: Proposal[]
): Statistics

export function getPartyColor(partyName?: string | null): string
```

**政黨顏色映射**:
```typescript
const PARTY_COLORS: Record<string, string> = {
  "民主進步黨": "#1B9431",
  "中國國民黨": "#000095",
  "台灣民眾黨": "#28C7C1",
  "時代力量": "#FFD700",
  "台灣基進": "#CD5C5C",
  "無黨籍": "#808080",
  "default": "#6B7FFF"        // 預設顏色
}
```

**驗證標準**:
- [x] 函式回傳符合 `NodeDatum` 型別
- [x] 資料轉換為 immutable（不修改原始資料）
- [x] 正確計算 `amount` 和 `count` 模式
- [x] 正確判斷 `isFrozen` 狀態
- [x] 統計資料計算正確

### 階段 4: 整合 `/visualization` 主頁面

**目標**: 移除 mock data，使用真實資料

**檔案**: `app/visualization/index.tsx`

**實作步驟**:

1. 引入 Zustand store hooks
2. 引入 React Query
3. 使用 `useQuery` 獲取資料
4. 使用 `useMemo` 轉換資料
5. 更新統計資料顯示
6. 傳遞真實資料給 Chart 元件
7. 移除本地 `useState`（改用 store）

**修改重點**:

**Before**:
```typescript
const Visualization = () => {
  const [activeTab, setActiveTab] = useState("legislator");
  const [mode, setMode] = useState<"amount" | "count">("amount");
  const [selectOptions, setSelectOptions] = useState(yearOptions);
  
  return (
    // ...
    <CirclePackChart />
    <DepartmentChart />
  )
}
```

**After**:
```typescript
import { useQuery } from '@tanstack/react-query'
import { execute } from '~/graphql/execute'
import { GET_VISUALIZATION_PROPOSALS_QUERY, visualizationQueryKeys } from '~/queries/visualization.queries'
import { useVisualizationState, useVisualizationActions } from '~/stores/visualization.store'
import { aggregateByLegislator, aggregateByDepartment, calculateStatistics } from './helpers'

const Visualization = () => {
  // 使用 Zustand store
  const { activeTab, mode, selectedYear } = useVisualizationState()
  const { setActiveTab, setMode, setSelectedYear } = useVisualizationActions()
  
  // 建構 where filter
  const whereFilter = useMemo((): ProposalWhereInput => {
    const filters: ProposalWhereInput = {
      budget: {
        year: { equals: parseInt(selectedYear) }
      }
    }
    return filters
  }, [selectedYear])
  
  // 獲取資料
  const { data, isLoading, isError } = useQuery({
    queryKey: visualizationQueryKeys.list({ year: selectedYear, tab: activeTab }),
    queryFn: () => execute(GET_VISUALIZATION_PROPOSALS_QUERY, { where: whereFilter }),
    staleTime: 5 * 60 * 1000,
  })
  
  // 轉換資料
  const chartData = useMemo(() => {
    if (!data?.proposals) return null
    
    if (activeTab === 'legislator') {
      return aggregateByLegislator(data.proposals, mode)
    } else {
      return aggregateByDepartment(data.proposals, mode)
    }
  }, [data?.proposals, activeTab, mode])
  
  // 計算統計
  const statistics = useMemo(() => {
    if (!data?.proposals) return null
    return calculateStatistics(data.proposals)
  }, [data?.proposals])
  
  // 處理 loading/error 狀態
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>
  
  return (
    <div>
      {/* ... 控制項保持不變 ... */}
      
      {/* 更新統計資料 */}
      <div>
        <p>總共刪減 <span>{statistics?.totalReduction || 0}</span>元
          （<span>{statistics?.reductionCount || 0}</span>個提案）</p>
        <p>凍結 <span>{statistics?.totalFreeze || 0}</span>元
          （<span>{statistics?.freezeCount || 0}</span>個提案）</p>
        <p>主決議提案數： <span>{statistics?.mainResolutionCount || 0}</span>個</p>
      </div>
      
      {/* 傳遞真實資料 */}
      {activeTab === "legislator" && chartData && (
        <CirclePackChart data={chartData} />
      )}
      {activeTab === "department" && chartData && Array.isArray(chartData) && (
        <DepartmentChart data={chartData} />
      )}
    </div>
  )
}
```

**驗證標準**:
- [x] 頁面正常載入
- [x] 年度選擇器可切換
- [x] Tab 切換正常
- [x] Mode 切換正常
- [x] 統計資料顯示正確數值
- [x] Chart 正常渲染
- [x] 無 console errors

### 階段 5: 更新 `CirclePackChart` 元件

**目標**: 移除內部 FAKE_DATA

**檔案**: `app/visualization/circle-pack-chart.tsx`

**實作步驟**:

1. 移除 `FAKE_DATA` 常數定義（行 15-48）
2. 移除 `data` prop 的預設值
3. 調整 prop 型別為必填

**修改重點**:

**Before**:
```typescript
const FAKE_DATA: NodeDatum = { /* ... */ }

const CirclePackChart = ({
  data = FAKE_DATA,  // ← 移除預設值
  width: customWidth = 720,
  height: customHeight,
  padding = 3,
}: CirclePackChartProps) => {
  // ...
}
```

**After**:
```typescript
type CirclePackChartProps = {
  data: NodeDatum      // ← 改為必填
  width?: number
  height?: number
  padding?: number
}

const CirclePackChart = ({
  data,                // ← 必填，無預設值
  width: customWidth = 720,
  height: customHeight,
  padding = 3,
}: CirclePackChartProps) => {
  // ...
}
```

**驗證標準**:
- [x] FAKE_DATA 已移除
- [x] `data` prop 為必填
- [x] TypeScript 檢查通過
- [x] 元件正常渲染真實資料

### 階段 6: 更新 `DepartmentChart` 元件

**目標**: 接收並渲染多個部會的資料

**檔案**: `app/visualization/department/index.tsx`

**實作步驟**:

1. 移除 `FAKE_DATA` 定義
2. 接收 `data: NodeDatum[]` prop
3. 動態渲染每個部會的 chart

**修改重點**:

**Before**:
```typescript
const FAKE_DATA: NodeDatum = { /* ... */ }

const DepartmentChart = () => {
  return (
    <div>
      <div><p>全部</p><CirclePackChart data={FAKE_DATA} /></div>
      <div><p>OOOO署</p><CirclePackChart data={FAKE_DATA} /></div>
      <div><p>OOOO署</p><CirclePackChart data={FAKE_DATA} /></div>
    </div>
  )
}
```

**After**:
```typescript
type DepartmentChartProps = {
  data: NodeDatum[]
}

const DepartmentChart = ({ data }: DepartmentChartProps) => {
  // 第一個為「全部」的聚合
  const allData: NodeDatum = {
    name: "root",
    children: data.flatMap(d => d.children || [])
  }
  
  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      <div className="flex flex-col items-center justify-center gap-y-5 font-bold">
        <p>全部</p>
        <CirclePackChart data={allData} />
      </div>
      
      {data.map((dept, index) => (
        <div key={index} className="flex flex-col items-center justify-center gap-y-5 font-bold">
          <p>{dept.name}</p>
          <CirclePackChart data={dept} />
        </div>
      ))}
    </div>
  )
}
```

**驗證標準**:
- [x] FAKE_DATA 已移除
- [x] 接收 `data` prop
- [x] 動態渲染所有部會
- [x] 「全部」chart 正確聚合
- [x] 每個部會 chart 正常顯示

### 階段 7: 建立 Loading/Error 狀態元件

**目標**: 提供良好的 UX

**檔案**: `app/components/skeleton/visualization-skeleton.tsx` (新建)

**實作步驟**:

1. 建立 Loading 骨架元件
2. 建立 Error 顯示元件
3. 在主頁面整合

**Loading 骨架**:
```typescript
export const VisualizationSkeleton = () => (
  <div className="flex flex-col gap-y-3 p-4 animate-pulse">
    {/* 控制項骨架 */}
    <div className="flex flex-col gap-y-2 md:flex-row md:justify-center">
      <div className="h-10 w-40 bg-gray-200 rounded"></div>
      <div className="h-10 w-60 bg-gray-200 rounded"></div>
    </div>
    
    {/* 統計資料骨架 */}
    <div className="h-24 bg-gray-200 rounded md:mx-auto md:max-w-[488px]"></div>
    
    {/* Chart 骨架 */}
    <div className="h-[720px] w-[720px] mx-auto bg-gray-200 rounded-full"></div>
  </div>
)
```

**Error 顯示**:
```typescript
export const VisualizationError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 gap-4">
    <p className="text-red-600 text-lg">載入資料時發生錯誤</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      重試
    </button>
  </div>
)
```

**驗證標準**:
- [x] Loading 狀態顯示骨架
- [x] Error 狀態顯示錯誤訊息
- [x] 重試按鈕可正常運作

## 驗證閘門

### 語法與型別檢查

```bash
# TypeScript 型別檢查
pnpm typecheck

# ESLint 檢查
pnpm lint
```

### 功能驗證清單

**基礎功能**:
- [ ] 頁面載入時顯示 Loading 狀態
- [ ] 資料載入完成後顯示 Chart
- [ ] 年度選擇器可切換（2025 / 2024）
- [ ] Tab 切換正常（依立委 / 依部會）
- [ ] Mode 切換正常（依金額 / 依數量）

**資料正確性**:
- [ ] 統計資料顯示非零數值
- [ ] 統計資料隨年度改變
- [ ] 立委模式顯示立委名稱、政黨、金額
- [ ] 部會模式顯示多個部會 chart
- [ ] Circle 顏色對應政黨正確
- [ ] isFrozen 狀態正確（粉紅邊框）

**互動功能**:
- [ ] 點擊 circle 可導航到詳情頁（如有 id）
- [ ] Circle zoom 效果正常
- [ ] 文字標籤顯示正確

**效能**:
- [ ] 切換年度時使用快取（無重複請求）
- [ ] 資料轉換不阻塞 UI
- [ ] 無 memory leaks

**程式碼品質**:
- [ ] 無 console errors/warnings
- [ ] 無 TypeScript errors
- [ ] 無 ESLint errors
- [ ] 所有 mock data 已移除

### 測試場景

**場景 1: 初次載入**
1. 訪問 `/visualization`
2. 預期: 顯示 Loading 骨架 → 顯示 2025 年立委模式 chart
3. 檢查統計資料是否正確

**場景 2: 切換年度**
1. 選擇「113年度 (2024)」
2. 預期: Chart 和統計資料更新
3. 檢查是否使用快取（DevTools Network tab）

**場景 3: 切換 Tab**
1. 點擊「依部會」
2. 預期: 顯示多個部會 chart
3. 檢查每個 chart 顯示正確

**場景 4: 切換 Mode**
1. 選擇「依數量」radio button
2. 預期: Circle 大小改變（反映數量而非金額）
3. 檢查統計資料保持不變

**場景 5: 錯誤處理**
1. 模擬 API 錯誤（中斷網路）
2. 預期: 顯示錯誤訊息和重試按鈕
3. 點擊重試，確認可恢復

## 技術決策

### 1. 為何使用 Zustand 而非 local state？

**決策**: 視覺化狀態（tab, mode, year）使用 Zustand 全域 store

**理由**:
- 可能有未來需求：其他頁面連結到特定 tab/mode
- 狀態持久化：切換頁面後返回保持狀態
- DevTools 調試方便
- 符合專案 Zustand-first 準則

### 2. 資料聚合在前端 vs 後端？

**決策**: 在前端進行資料聚合

**理由**:
- GraphQL schema 不支援自訂聚合查詢
- 前端聚合靈活性高（易於調整演算法）
- 資料量可控（單一年度不會太大）
- 避免修改後端 schema

**權衡**: 若未來資料量暴增，需考慮後端聚合

### 3. Party 資料結構處理

**發現**: `People.party` 型別為 `People` 而非獨立的 `Party` type

**決策**: 
- 透過 `proposers.party.name` 取得政黨名稱
- 在前端建立 `PARTY_COLORS` 映射表
- 使用 fallback 顏色處理未知政黨

**替代方案（未採用）**: 修改 GraphQL schema 新增 `Party` type

### 4. 部會模式資料結構

**決策**: `aggregateByDepartment` 回傳 `NodeDatum[]`（陣列）

**理由**:
- 每個部會獨立顯示一個 chart
- 「全部」chart 由前端二次聚合
- 結構清晰，易於渲染

### 5. 統計資料計算

**決策**: 使用獨立的 `calculateStatistics` 函式

**理由**:
- 統計邏輯與視覺化邏輯分離
- 可重用於其他頁面
- 易於測試

## 潛在風險與緩解

### 風險 1: Party 資料為 null

**風險**: 部分提案人可能沒有 `party` 資料

**緩解**:
- 使用 optional chaining: `proposer.party?.name`
- 提供預設顏色: `getPartyColor(null) => '#808080'`
- 在轉換函式中加入 null 檢查

### 風險 2: 大量提案導致效能問題

**風險**: 單一年度可能有數千筆 proposals

**緩解**:
- 使用 `useMemo` 避免重複計算
- React Query 快取減少請求
- 考慮虛擬化（若單一年度 > 10000 筆）

### 風險 3: proposalTypes 格式不一致

**風險**: `proposalTypes` 可能是逗號分隔字串或其他格式

**緩解**:
```typescript
function isFrozenProposal(proposalTypes: string | null): boolean {
  if (!proposalTypes) return false
  return proposalTypes.toLowerCase().includes('凍結')
}
```

### 風險 4: 年度資料不存在

**風險**: 選擇的年度可能無任何 proposals

**緩解**:
- 顯示「無資料」訊息
- 檢查 `data?.proposals.length === 0`
- 提供返回選單按鈕

## 未來擴展

### 1. URL State Sync

將 Zustand state 同步到 URL query params

```typescript
// 範例
/visualization?year=2025&tab=legislator&mode=amount
```

**優點**: 可分享連結、瀏覽器前後導航

### 2. 立委詳情頁整合

在 `/visualization/legislator/:id` 頁面也使用相同 query

**複用**: `GET_VISUALIZATION_PROPOSALS_QUERY` 加上 proposer filter

### 3. 匯出功能

下載 chart 為 PNG 或 SVG

**實作**: 使用 `saveSvgAsPng` 套件

### 4. 比較模式

並排顯示兩個年度的 chart

**需求**: 調整 layout，允許多個 query

## 參考資源

### 官方文件

- [TanStack Query - Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries)
- [Zustand - Getting Started](https://zustand-demo.pmnd.rs/)
- [D3 Hierarchy - Pack](https://d3js.org/d3-hierarchy/pack)
- [GraphQL - Variables](https://graphql.org/learn/queries/#variables)

### 程式碼參考

- 分頁實作: `PRPs/add-pagination.md`
- 篩選實作: `PRPs/by-department-selector.md`
- 搜尋實作: `PRPs/search-budget.md`

### 範例程式碼

- React Query 整合: `app/all-budgets/index.tsx`
- Zustand store: `app/stores/uiStore.ts`
- GraphQL queries: `app/queries/proposal.queries.ts`

## 成功標準

此 PRP 實作完成後應達成：

1. ✅ 所有 mock data 已從程式碼中移除
2. ✅ 視覺化頁面使用真實 GraphQL 資料
3. ✅ 統計資料顯示正確數值
4. ✅ 年度/Tab/Mode 切換功能正常
5. ✅ 無 TypeScript/ESLint 錯誤
6. ✅ 符合專案 Zustand/React Query 模式
7. ✅ 提供良好的 Loading/Error UX
8. ✅ 保持現有排版不變

## PRP 信心評分

**評分**: 8/10

**理由**:
- ✅ 技術棧熟悉（React Query, Zustand, GraphQL 已在專案中使用）
- ✅ 有清晰的實作步驟和驗證標準
- ✅ 有現有程式碼可參考（all-budgets 頁面）
- ✅ GraphQL schema 支援所需查詢
- ⚠️ 資料聚合邏輯較複雜（需仔細處理 edge cases）
- ⚠️ Party 資料結構需要特別注意（可能為 null）

**降低風險**:
- 階段化實作，每階段有明確驗證標準
- 提供詳細的函式簽名和型別定義
- 包含錯誤處理和 edge cases 說明

