## FEATs

# BudgetsPanel 組件設計（以 Zustand 為單一真實來源）

本組件將既有的頁面區塊（標題、進度、篩選、排序、清單）模組化為可重用元件，預設以 `Zustand` 的 `budget-selector` store 管理狀態，同時支援「受控模式」以便父層完全掌控排序/渲染。

---

## 元件命名與職責

- 名稱：`BudgetsPanel`
- 職責：呈現標題區、進度區、`BudgetsSelector`、`SortToolbar` 與清單渲染
- 資料來源：由父層透過 `props` 傳入 `budgets` 陣列（避免耦合資料抓取）
- 狀態：預設讀寫 `Zustand` 的 `selectedSort`/`setSelectedSort`（可切換為受控模式）

---

## Props 介面（草案）

```ts
import type { Budget } from "~/graphql/graphql";

type SortValue = string; // 例如 "projectName-asc"

interface BudgetsPanelProps {
  // 資料
  budgets: Budget[];
  isLoading?: boolean;
  isError?: boolean;

  // 文案/樣式
  title?: string; // 預設用 content.title
  showProgress?: boolean; // 是否顯示進度區塊（預設 true）
  className?: string;

  // 排序（受控模式可選）
  sortValue?: SortValue; // 若提供則走受控模式
  onSortChange?: (value: SortValue) => void;

  // 清單渲染（可客製清單項）
  renderItem?: (budget: Budget) => React.ReactNode;

  // 事件
  onItemClick?: (budget: Budget) => void;
}
```

- 預設行為：
  - `sortValue`/`onSortChange` 未提供 → 使用 `useBudgetSelectStore` 的 `selectedSort`/`setSelectedSort`
  - `renderItem` 未提供 → 提供簡潔預設卡片
  - `showProgress` 預設 `true`

---

## 結構與 Hooks 順序

- 先呼叫所有 Hooks：`useQuery`(若父層使用)、`useStore` 取得 `selectedSort`、`useMemo` 排序
- 再處理 early return（`isLoading` / `isError`）
- 最後回傳 JSX（Title → Progress → BudgetsSelector → SortToolbar → List）
- 遵守 React Hooks 規則（參考：[Rules of Hooks](https://react.dev/link/rules-of-hooks)）

---

## 使用方式

### 1) 非受控（預設走 Zustand store）

```tsx
<BudgetsPanel budgets={data?.budgets ?? []} />
```

### 2) 受控模式（父層管理排序）

```tsx
const [sort, setSort] = useState<SortValue>("projectName-asc");

<BudgetsPanel
  budgets={data?.budgets ?? []}
  sortValue={sort}
  onSortChange={setSort}
/>;
```

### 3) 客製清單項渲染

```tsx
<BudgetsPanel
  budgets={data?.budgets ?? []}
  renderItem={(b) => (
    <section key={b.id} className="rounded border p-4">
      <h4 className="font-semibold">{b.projectName ?? "（未命名）"}</h4>
      <div className="text-sm text-blue-700">
        預算金額：
        {typeof b.budgetAmount === "number"
          ? `NT$ ${b.budgetAmount.toLocaleString()}`
          : "未設定"}
      </div>
    </section>
  )}
/>
```

---

## 檔案結構建議

- `app/components/budgets-panel/index.tsx`（主元件）
- 沿用既有組件：
  - `app/components/budgets-selector.tsx`
  - `app/components/sort-toolbar.tsx`
  - `app/components/progress-bar.tsx`
- 狀態：`app/stores/budget-selector.tsx`（提供 `selectedSort` / `setSelectedSort`）

---

## 設計理由

- 以 Zustand 為單一真實來源，符合專案規範；同時保留受控模式彈性
- 清楚分離資料與視圖：資料由父層提供、視圖與互動在元件內
- 排序只保存 key，實際排序用 `useMemo`，效能與可讀性兼顧
- 易於擴充：新增排序/篩選或替換 `renderItem` 不需改變既有狀態結構

---

## 後續實作建議

1. 建立 `app/components/budgets-panel/index.tsx`
2. 將 `all-budgets/index.tsx` 中現有區塊替換為 `BudgetsPanel`
3. 確認與 `budget-selector` 既有 store 一致（`selectedSort` 預設值、actions 命名）
